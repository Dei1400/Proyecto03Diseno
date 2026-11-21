import { Injectable } from '@nestjs/common';
import { MetodoPago } from '@prisma/client';
import { SUFIJO_TARJETA_RECHAZADA } from '../pagos.constants';
import type {
  DatosPago,
  EstrategiaPago,
  OrdenAPagar,
  ResultadoPago,
} from './estrategia-pago';

// Tarjeta, se aprueba al instante, salvo la tarjeta de prueba que termina en 0002
@Injectable()
export class PagoTarjeta implements EstrategiaPago {
  readonly metodo = MetodoPago.TARJETA;

  procesar(_orden: OrdenAPagar, datos: DatosPago): ResultadoPago {
    const numero = datos.numeroTarjeta ?? '';
    if (numero.endsWith(SUFIJO_TARJETA_RECHAZADA)) {
      return {
        estado: 'RECHAZADO',
        mensaje: 'El banco rechazó la tarjeta. Prueba con otra.',
      };
    }
    // Solo se guardan los últimos 4 números
    return { estado: 'APROBADO', mensaje: 'Pago aprobado', ultimos4: numero.slice(-4) };
  }
}