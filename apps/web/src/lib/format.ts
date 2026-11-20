export function colones(monto: number): string {
  return '₡ ' + Math.round(monto).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
}
export function fecha(iso: string): string {
  return new Intl.DateTimeFormat('es-CR', {
    day: '2-digit', month: '2-digit', year: 'numeric', timeZone: 'America/Costa_Rica',
  }).format(new Date(iso));
}
export function hora(iso: string): string {
  return new Intl.DateTimeFormat('es-CR', {
    hour: 'numeric', minute: '2-digit', timeZone: 'America/Costa_Rica',
  }).format(new Date(iso));
}
export function fechaLarga(iso: string): string {
  return new Intl.DateTimeFormat('es-CR', {
    day: 'numeric', month: 'long', year: 'numeric', timeZone: 'America/Costa_Rica',
  }).format(new Date(iso));
}
