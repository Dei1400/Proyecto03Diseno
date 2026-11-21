import { Module } from '@nestjs/common';
import { TiempoRealModule } from '../tiempo-real/tiempo-real.module';
import { AsientosController } from './asientos.controller';
import { AsientosService } from './asientos.service';

@Module({
  imports: [TiempoRealModule],
  controllers: [AsientosController],
  providers: [AsientosService],
  exports: [AsientosService],
})
export class AsientosModule {}