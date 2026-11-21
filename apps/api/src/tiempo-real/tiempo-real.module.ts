import { Module } from '@nestjs/common';
import { MapaTiempoReal } from './observadores/mapa-tiempo-real';
import { ReporteVentas } from './observadores/reporte-ventas';
import { PublicadorDeEventos } from './publicador-de-eventos.service';
import { TiempoRealGateway } from './tiempo-real.gateway';

// Los demás módulos solo ven al publicador
@Module({
  providers: [PublicadorDeEventos, TiempoRealGateway, MapaTiempoReal, ReporteVentas],
  exports: [PublicadorDeEventos],
})
export class TiempoRealModule {}