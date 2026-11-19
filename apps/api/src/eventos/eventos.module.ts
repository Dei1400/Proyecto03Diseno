import { Module } from '@nestjs/common';
import { CalculadoraPrecioService } from './calculadora-precio.service';
import { EventosController } from './eventos.controller';
import { EventosService } from './eventos.service';

@Module({
  controllers: [EventosController],
  providers: [EventosService, CalculadoraPrecioService],
  exports: [CalculadoraPrecioService], // lo va a usar el módulo de órdenes
})
export class EventosModule {}