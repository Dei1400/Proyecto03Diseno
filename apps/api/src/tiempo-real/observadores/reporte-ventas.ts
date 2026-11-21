import { Injectable, OnModuleInit } from '@nestjs/common';
import { EstadoAsiento, EstadoOrden } from '@prisma/client';
import { PrismaService } from '../../prisma/prisma.service';
import { PublicadorDeEventos } from '../publicador-de-eventos.service';
import { AVISO_VENTAS, SALA_PRODUCTORA } from '../tiempo-real.constants';
import { TiempoRealGateway } from '../tiempo-real.gateway';
import type { CambioDeAsientos, Observador } from './observador';

// aqui el observer se activa cuando se vende algo, recalcula las ventas del evento y se las manda a la productora
@Injectable()
export class ReporteVentas implements Observador, OnModuleInit {
  constructor(
    private readonly publicador: PublicadorDeEventos,
    private readonly prisma: PrismaService,
    private readonly gateway: TiempoRealGateway,
  ) {}

  onModuleInit() {
    this.publicador.suscribir(this);
  }

  async actualizar(cambio: CambioDeAsientos) {
    const huboVenta = cambio.asientos.some(
      (asiento) => asiento.estado === EstadoAsiento.VENDIDO,
    );
    if (!huboVenta) {
      return; // apartar o liberar asientos no cambia las ventas
    }
    this.gateway.enviar(SALA_PRODUCTORA, AVISO_VENTAS, await this.resumen(cambio.eventoId));
  }

  // Boletos vendidos y dinero recaudado de un evento
  async resumen(eventoId: number) {
    const pagadas = { eventoId, estado: EstadoOrden.PAGADA };
    const [boletosVendidos, suma] = await Promise.all([
      this.prisma.boleto.count({ where: { orden: pagadas } }),
      this.prisma.orden.aggregate({ where: pagadas, _sum: { total: true } }),
    ]);
    return { eventoId, boletosVendidos, recaudado: suma._sum.total ?? 0 };
  }
}