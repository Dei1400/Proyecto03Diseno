import { api } from './api';
import type { Desglose } from './evento-detalle';

export interface Asiento {
  id: number;
  fila: string;
  numero: number;
  estado: 'DISPONIBLE' | 'RETENIDO' | 'VENDIDO' | 'BLOQUEADO';
  retenidoPorId: number | null;
  retenidoHasta: string | null;
}

export interface ZonaAsientos {
  id: number;
  nombre: string;
  precioFinal: number;
  asientos: Asiento[];
}

export interface Reserva {
  asientos: { id: number; estado: string; vencenEn: string | null }[];
  vencenEn: string | null;
}

export interface OrdenCreada {
  orden: { id: number; total: number; estado: string };
  desglose: Desglose;
  asientos: { id: number; zona: string; fila: string; numero: number }[];
}

export interface PagoCompletado {
  orden: { id: number; total: number; estado: string };
  pago: { estado: string; mensaje: string; cuotas?: { cantidad: number; montoPorCuota: number } };
  boletos: number;
}

export function consultarAsientos(eventoId: number) {
  return api<ZonaAsientos[]>(`/eventos/${eventoId}/asientos`, { metodo: 'GET' });
}

export function retenerAsientos(eventoId: number, asientoIds: number[]) {
  return api<Reserva>('/asientos/retener', { metodo: 'POST', autenticado: true, cuerpo: { eventoId, asientoIds } });
}

export function liberarAsientos(eventoId: number, asientoIds: number[]) {
  return api<Reserva>('/asientos/liberar', { metodo: 'POST', autenticado: true, cuerpo: { eventoId, asientoIds } });
}

export function crearOrden(eventoId: number, asientoIds: number[]) {
  return api<OrdenCreada>('/ordenes', { metodo: 'POST', autenticado: true, cuerpo: { eventoId, asientoIds } });
}

export function pagarOrden(id: number, metodo: 'TARJETA' | 'CUOTAS', rechazar: boolean, cuotas: number) {
  return api<PagoCompletado>(`/ordenes/${id}/pagar`, {
    metodo: 'POST', autenticado: true,
    cuerpo: { metodo, numeroTarjeta: rechazar ? '4000000000000002' : '4111111111111111', ...(metodo === 'CUOTAS' ? { cuotas } : {}) },
  });
}
