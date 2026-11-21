import { Injectable } from '@nestjs/common';
import { MetodoPago } from '@prisma/client';
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

  procesar(orden: OrdenAPagar, datos: DatosPago): ResultadoPago {
    const cantidad = datos.cuotas ?? 0;
    if (!CUOTAS_PERMITIDAS.includes(cantidad)) {
      return {
        estado: 'RECHAZADO',
        mensaje: `Elige ${CUOTAS_PERMITIDAS.join(', ')} cuotas`,
      };
    }
    return {
      estado: 'APROBADO',
      mensaje: `Pago aprobado en ${cantidad} cuotas`,
      cuotas: { cantidad, montoPorCuota: Math.ceil(orden.total / cantidad) },
    };
  }
}