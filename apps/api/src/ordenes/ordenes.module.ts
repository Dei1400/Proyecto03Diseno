import { Module } from '@nestjs/common';
import { AsientosModule } from '../asientos/asientos.module';
import { EventosModule } from '../eventos/eventos.module';
import { PagosModule } from '../pagos/pagos.module';
import { OrdenesController } from './ordenes.controller';
import { OrdenesService } from './ordenes.service';
import { TiempoRealModule } from '../tiempo-real/tiempo-real.module';

@Module({
  imports: [EventosModule, AsientosModule, PagosModule, TiempoRealModule],
  controllers: [OrdenesController],
  providers: [OrdenesService],
})
export class OrdenesModule {}