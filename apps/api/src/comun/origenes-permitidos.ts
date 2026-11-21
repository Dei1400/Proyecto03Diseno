// Páginas que pueden conectarse al API 
export function origenesPermitidos(): string[] | boolean {
  return process.env.FRONTEND_URL ? process.env.FRONTEND_URL.split(',') : true;
}