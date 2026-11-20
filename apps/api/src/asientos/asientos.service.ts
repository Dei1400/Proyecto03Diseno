import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { EstadoAsiento, EstadoOrden, Prisma } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import {
  MAXIMO_BOLETOS_POR_EVENTO,
  MINUTOS_RETENCION,
} from './asientos.constants';
import { ContextoAsiento } from './contexto-asiento';
import { SeleccionAsientosDto } from './dto/seleccion-asientos.dto';

const UN_MINUTO_EN_MS = 60 * 1000;
// Supabase está lejos: se le da más tiempo a la transacción que el de Prisma (5 s)
const TIEMPO_MAXIMO_TRANSACCION_MS = 15 * 1000;

// Una acción sobre un asiento (retener, liberar…)
type AccionAsiento = (asiento: ContextoAsiento) => void;

export interface ResultadoAsiento {
  id: number;
  estado: EstadoAsiento;
  vencenEn: Date | null;
}

@Injectable()
export class AsientosService {
  constructor(private readonly prisma: PrismaService) {}

  // apartar asientos por 10 minutos
  retener(usuarioId: number, datos: SeleccionAsientosDto) {
    const hasta = new Date(Date.now() + MINUTOS_RETENCION * UN_MINUTO_EN_MS);

    return this.prisma.$transaction(
      async (tx) => {
        await this.verificarMaximo(tx, usuarioId, datos);
        const asientos = await this.aplicar(tx, datos, (asiento) =>
          asiento.retener(usuarioId, hasta),
        );
        return { asientos, vencenEn: this.primeroEnVencer(asientos) };
      },
      { timeout: TIEMPO_MAXIMO_TRANSACCION_MS },
    );
  }

  // Devuelve los asientos para que otra persona los pueda tomar
  liberar(usuarioId: number, datos: SeleccionAsientosDto) {
    return this.prisma.$transaction(
      async (tx) => ({
        asientos: await this.aplicar(tx, datos, (asiento) =>
          asiento.liberar(usuarioId),
        ),
      }),
      { timeout: TIEMPO_MAXIMO_TRANSACCION_MS },
    );
  }

  // Aplica la acción a cada asiento (su estado decide si se puede) y la guarda
  private async aplicar(
    tx: Prisma.TransactionClient,
    datos: SeleccionAsientosDto,
    accion: AccionAsiento,
  ): Promise<ResultadoAsiento[]> {
    const registros = await tx.asiento.findMany({
      where: { id: { in: datos.asientoIds }, zona: { eventoId: datos.eventoId } },
    });
    if (registros.length !== datos.asientoIds.length) {
      throw new NotFoundException('Alguno de los asientos no existe en este evento');
    }

    const resultado: ResultadoAsiento[] = [];
    for (const registro of registros) {
      const asiento = new ContextoAsiento(registro);
      accion(asiento); // patrón State: si no se puede, la clase del estado lanza el error

      // Se guarda solo si nadie cambió el asiento desde que se leyó entoncesasí dos personas nunca se quedan con el mismo asiento
      const { count } = await tx.asiento.updateMany({
        where: {
          id: registro.id,
          estado: registro.estado,
          retenidoPorId: registro.retenidoPorId,
          retenidoHasta: registro.retenidoHasta,
        },
        data: asiento.datosParaGuardar(),
      });
      if (count === 0) {
        throw new ConflictException(
          'Otra persona acaba de tomar uno de los asientos. Elige otro.',
        );
      }

      resultado.push({
        id: asiento.id,
        estado: asiento.estadoActual,
        vencenEn: asiento.retenidoHasta,
      });
    }
    return resultado;
  }

  // máximo 6 boletos por persona en cada evento
  private async verificarMaximo(
    tx: Prisma.TransactionClient,
    usuarioId: number,
    datos: SeleccionAsientosDto,
  ) {
    const apartados = await tx.asiento.count({
      where: {
        zona: { eventoId: datos.eventoId },
        estado: EstadoAsiento.RETENIDO,
        retenidoPorId: usuarioId,
        retenidoHasta: { gt: new Date() },
        id: { notIn: datos.asientoIds },
      },
    });
    const comprados = await tx.boleto.count({
      where: {
        orden: { usuarioId, eventoId: datos.eventoId, estado: EstadoOrden.PAGADA },
      },
    });

    if (apartados + comprados + datos.asientoIds.length > MAXIMO_BOLETOS_POR_EVENTO) {
      throw new BadRequestException(
        `Puedes tener como máximo ${MAXIMO_BOLETOS_POR_EVENTO} boletos en este evento`,
      );
    }
  }

  // La hora en que vence el primer asiento apartado (para el temporizador)
  private primeroEnVencer(asientos: ResultadoAsiento[]): Date | null {
    const horas = asientos
      .map((asiento) => asiento.vencenEn)
      .filter((hora): hora is Date => hora !== null);
    return horas.length > 0
      ? new Date(Math.min(...horas.map((hora) => hora.getTime())))
      : null;
  }
}