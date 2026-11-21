import { Injectable } from '@nestjs/common';
import { MetodoPago } from '@prisma/client';
import type {
  DatosPago,
  EstrategiaPago,
  OrdenAPagar,
  ResultadoPago,
} from './estrategias/estrategia-pago';
import { PagoCuotas } from './estrategias/pago-cuotas';
import { PagoTarjeta } from './estrategias/pago-tarjeta';

@Injectable()
export class ProcesadorPagos {
  private readonly estrategias: Record<MetodoPago, EstrategiaPago>;

  constructor(tarjeta: PagoTarjeta, cuotas: PagoCuotas) {
    this.estrategias = { TARJETA: tarjeta, CUOTAS: cuotas };
  }

  procesar(metodo: MetodoPago, orden: OrdenAPagar, datos: DatosPago): ResultadoPago {
    return this.estrategias[metodo].procesar(orden, datos);
  }
}