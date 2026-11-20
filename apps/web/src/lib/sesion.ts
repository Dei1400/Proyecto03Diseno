export interface Usuario {
  id: number;
  nombre: string;
  correo: string;
  cedula: string;
  telefono: string;
  rol: 'COMPRADOR' | 'PRODUCTORA';
}

export function guardarSesion(token: string, usuario: Usuario): void {
  sessionStorage.setItem('sesion', JSON.stringify({ token, usuario }));
}

export function obtenerToken(): string | null {
  const sesion = sessionStorage.getItem('sesion');
  if (!sesion) return null;
  try {
    const datos: unknown = JSON.parse(sesion);
    return typeof datos === 'object' && datos !== null && 'token' in datos
      && typeof datos.token === 'string' && datos.token ? datos.token : null;
  } catch (error) {
    console.error('No se pudo leer la sesión guardada.', error);
    return null;
  }
}
