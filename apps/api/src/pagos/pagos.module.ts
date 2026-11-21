import { Module } from '@nestjs/common';
import { PagoCuotas } from './estrategias/pago-cuotas';
import { PagoTarjeta } from './estrategias/pago-tarjeta';
import { ProcesadorPagos } from './procesador-pagos.service';

@Module({
  providers: [ProcesadorPagos, PagoTarjeta, PagoCuotas],
  exports: [ProcesadorPagos],
})
export class PagosModule {}