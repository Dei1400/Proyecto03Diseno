import { Module } from '@nestjs/common';
import { AsientosModule } from '../asientos/asientos.module';
import { EventosModule } from '../eventos/eventos.module';
import { PagosModule } from '../pagos/pagos.module';
import { OrdenesController } from './ordenes.controller';
import { OrdenesService } from './ordenes.service';

@Module({
  imports: [EventosModule, AsientosModule, PagosModule],
  controllers: [OrdenesController],
  providers: [OrdenesService],
})
export class OrdenesModule {}