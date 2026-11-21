import { Injectable } from '@nestjs/common';
import { MetodoPago } from '@prisma/client';
import { PagoTarjeta } from './pago-tarjeta';
import { CUOTAS_PERMITIDAS } from '../pagos.constants';
import type {
  DatosPago,
  EstrategiaPago,
  OrdenAPagar,
  ResultadoPago,
} from './estrategia-pago';

// Cuotas, se aprueba y se calcula cuánto es cada cuota

@Injectable()
export class PagoCuotas implements EstrategiaPago {
  readonly metodo = MetodoPago.CUOTAS;

  constructor(private readonly tarjeta: PagoTarjeta) {}

  procesar(orden: OrdenAPagar, datos: DatosPago): ResultadoPago {
    const cantidad = datos.cuotas ?? 0;
    if (!CUOTAS_PERMITIDAS.includes(cantidad)) {
      return {
        estado: 'RECHAZADO',
        mensaje: `Elige ${CUOTAS_PERMITIDAS.join(', ')} cuotas`,
      };
    }

    // La tarjeta se revisa igual que en un pago de contado
    const cobro = this.tarjeta.procesar(orden, datos);
    if (cobro.estado === 'RECHAZADO') {
      return cobro;
    }

    return {
      ...cobro,
      mensaje: `Pago aprobado en ${cantidad} cuotas`,
      cuotas: { cantidad, montoPorCuota: Math.ceil(orden.total / cantidad) },
    };
  }
}