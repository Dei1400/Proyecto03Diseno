import { MetodoPago } from '@prisma/client';

export interface OrdenAPagar {
  id: number;
  total: number;
}

export interface DatosPago {
  numeroTarjeta?: string;
  cuotas?: number;
}

export type EstadoPago = 'APROBADO' | 'RECHAZADO';

export interface ResultadoPago {
  estado: EstadoPago;
  mensaje: string;
  ultimos4?: string;
  cuotas?: { cantidad: number; montoPorCuota: number };
}

/**
 * Patrón Strategy
 */
export interface EstrategiaPago {
  readonly metodo: MetodoPago;
  procesar(orden: OrdenAPagar, datos: DatosPago): ResultadoPago;
}