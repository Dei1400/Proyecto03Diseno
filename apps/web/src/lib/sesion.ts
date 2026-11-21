export interface Usuario {
  id: number;
  nombre: string;
  correo: string;
  cedula: string;
  telefono: string;
  rol: 'COMPRADOR' | 'PRODUCTORA';
}

const EVENTO_SESION = 'queplan:sesion';

export function guardarSesion(token: string, usuario: Usuario): void {
  sessionStorage.setItem('sesion', JSON.stringify({ token, usuario }));
  window.dispatchEvent(new Event(EVENTO_SESION));
}

export function cerrarSesion(): void {
  sessionStorage.removeItem('sesion');
  window.dispatchEvent(new Event(EVENTO_SESION));
}

export function suscribirSesion(callback: () => void): () => void {
  window.addEventListener(EVENTO_SESION, callback);
  window.addEventListener('storage', callback);
  return () => {
    window.removeEventListener(EVENTO_SESION, callback);
    window.removeEventListener('storage', callback);
  };
}

export function destinoSeguro(volver: string | null): string {
  return volver && volver.startsWith('/') && !volver.startsWith('//')
    && !/[\\\u0000-\u001f]/.test(volver) ? volver : '/';
}

export function obtenerSesionGuardada(): string | null {
  return sessionStorage.getItem('sesion');
}

export function obtenerToken(): string | null {
  const sesion = obtenerSesionGuardada();
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
