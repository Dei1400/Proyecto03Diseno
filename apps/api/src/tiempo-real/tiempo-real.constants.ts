// Nombres de las salas y de los avisos que recibe la web
export const SALA_PRODUCTORA = 'productora';
export const AVISO_ASIENTOS = 'asiento.cambio';
export const AVISO_VENTAS = 'ventas.cambio';

// Cada evento tiene su sala, ahí están las personas que ven su mapa
export function salaDeEvento(eventoId: number): string {
  return `evento:${eventoId}`;
}