import {
  ConflictException,
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { EstadoAsiento, EstadoOrden, MetodoPago, Orden } from '@prisma/client';
import { AsientosService } from '../asientos/asientos.service';
import {
  CalculadoraPrecioService,
  type DesglosePrecio,
} from '../eventos/calculadora-precio.service';
import type { ResultadoPago } from '../pagos/estrategias/estrategia-pago';
import { ProcesadorPagos } from '../pagos/procesador-pagos.service';
import { TIEMPO_MAXIMO_TRANSACCION_MS } from '../prisma/prisma.constants';
import { PrismaService } from '../prisma/prisma.service';
import { CrearOrdenDto } from './dto/crear-orden.dto';
import { PagarOrdenDto } from './dto/pagar-orden.dto';

// Mensaje cuando una orden ya no se puede pagar
const ORDEN_NO_PENDIENTE: Record<EstadoOrden, string> = {
  PENDIENTE: '',
  PAGADA: 'Esta orden ya fue pagada',
  CANCELADA: 'Esta orden fue cancelada. Elige tus asientos de nuevo.',
};

@Injectable()
export class OrdenesService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly calculadora: CalculadoraPrecioService,
    private readonly asientos: AsientosService,
    private readonly procesador: ProcesadorPagos,
  ) {}

  // Crea la orden con los asientos apartados y su desglose
  crear(usuarioId: number, datos: CrearOrdenDto) {
    return this.prisma.$transaction(
      async (tx) => {
        const asientos = await tx.asiento.findMany({
          where: {
            id: { in: datos.asientoIds },
            zona: { eventoId: datos.eventoId },
            estado: EstadoAsiento.RETENIDO,
            retenidoPorId: usuarioId,
            retenidoHasta: { gt: new Date() },
          },
          include: { zona: { select: { nombre: true, precio: true } } },
        });
        if (asientos.length !== datos.asientoIds.length) {
          throw new ConflictException(
            'Primero aparta tus asientos. Si pasaron 10 minutos, vuelve a elegirlos.',
          );
        }

        // Una persona tiene una sola orden pendiente por evento
        await tx.orden.updateMany({
          where: { usuarioId, eventoId: datos.eventoId, estado: EstadoOrden.PENDIENTE },
          data: { estado: EstadoOrden.CANCELADA },
        });

        const desglose = this.sumar(
          asientos.map((asiento) => this.calculadora.calcular(asiento.zona.precio)),
        );
        const orden = await tx.orden.create({
          data: {
            usuarioId,
            eventoId: datos.eventoId,
            subtotal: desglose.subtotal,
            cargoServicio: desglose.cargoServicio,
            impuestos:
              desglose.iva + desglose.impuestoEspectaculos + desglose.impuestoMunicipal,
            total: desglose.total,
          },
        });
        await tx.asiento.updateMany({
          where: { id: { in: datos.asientoIds } },
          data: { ordenId: orden.id },
        });

        return {
          orden,
          desglose,
          asientos: asientos.map((asiento) => ({
            id: asiento.id,
            zona: asiento.zona.nombre,
            fila: asiento.fila,
            numero: asiento.numero,
          })),
        };
      },
      { timeout: TIEMPO_MAXIMO_TRANSACCION_MS },
    );
  }

  // Realiza el pago simulado con el método que elija la persona (patrón Strategy)
  async pagar(usuarioId: number, ordenId: number, datos: PagarOrdenDto) {
    const orden = await this.buscarPendiente(usuarioId, ordenId);
    const resultado = this.procesador.procesar(datos.metodo, orden, datos);

    if (resultado.estado === 'RECHAZADO') {
      throw new HttpException(resultado.mensaje, HttpStatus.PAYMENT_REQUIRED);
    }
    return this.completar(usuarioId, orden, datos.metodo, resultado);
  }

  // obtener el historial de compras
  historial(usuarioId: number) {
    return this.prisma.orden.findMany({
      where: { usuarioId },
      orderBy: { creadaEn: 'desc' },
      include: {
        evento: { select: { id: true, nombre: true, fechaHora: true, lugar: true } },
        _count: { select: { boletos: true } },
      },
    });
  }

  // Pago aprobado
  private completar(
    usuarioId: number,
    orden: Orden,
    metodo: MetodoPago,
    resultado: ResultadoPago,
  ) {
    return this.prisma.$transaction(
      async (tx) => {
        const vendidos = await this.asientos.venderDeOrden(tx, orden.id, usuarioId);
        if (vendidos.length === 0) {
          throw new ConflictException('La orden no tiene asientos. Elige tus asientos de nuevo.');
        }

        await tx.boleto.createMany({
          data: vendidos.map((asiento) => ({ ordenId: orden.id, asientoId: asiento.id })),
        });

        const pagada = await tx.orden.update({
          where: { id: orden.id },
          data: {
            estado: EstadoOrden.PAGADA,
            metodoPago: metodo,
            ultimos4: resultado.ultimos4 ?? null,
          },
        });
        return { orden: pagada, pago: resultado, boletos: vendidos.length };
      },
      { timeout: TIEMPO_MAXIMO_TRANSACCION_MS },
    );
  }

  private async buscarPendiente(usuarioId: number, ordenId: number) {
    const orden = await this.prisma.orden.findFirst({ where: { id: ordenId, usuarioId } });
    if (!orden) {
      throw new NotFoundException('La orden no existe');
    }
    if (orden.estado !== EstadoOrden.PENDIENTE) {
      throw new ConflictException(ORDEN_NO_PENDIENTE[orden.estado]);
    }
    return orden;
  }

  // para suma el desglose de cada asiento
  private sumar(desgloses: DesglosePrecio[]): DesglosePrecio {
    return desgloses.reduce(
      (suma, d) => ({
        subtotal: suma.subtotal + d.subtotal,
        cargoServicio: suma.cargoServicio + d.cargoServicio,
        iva: suma.iva + d.iva,
        impuestoEspectaculos: suma.impuestoEspectaculos + d.impuestoEspectaculos,
        impuestoMunicipal: suma.impuestoMunicipal + d.impuestoMunicipal,
        total: suma.total + d.total,
      }),
      {
        subtotal: 0,
        cargoServicio: 0,
        iva: 0,
        impuestoEspectaculos: 0,
        impuestoMunicipal: 0,
        total: 0,
      },
    );
  }
}