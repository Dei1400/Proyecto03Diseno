import { obtenerToken } from './sesion';
export class ErrorApi extends Error {
  constructor(public readonly estado: number, mensaje: string) {
    super(mensaje);
    this.name = 'ErrorApi';
  }
}

export async function api<T>(
  ruta: string,
  opciones: { metodo: string; cuerpo?: unknown },
): Promise<T> {
  const base = process.env.NEXT_PUBLIC_API_URL
    || (process.env.NODE_ENV === 'development' ? 'http://localhost:3000' : undefined);

  if (!base) {
    throw new Error('Configura NEXT_PUBLIC_API_URL para conectar con el servidor.');
  }

  const respuesta = await fetch(`${base.replace(/\/$/, '')}${ruta}`, {
    method: opciones.metodo,
        headers: {
      'Content-Type': 'application/json',
      // Si hay sesión, se manda el token para las rutas privadas
      ...(typeof window !== 'undefined' && obtenerToken()
        ? { Authorization: `Bearer ${obtenerToken()}` }
        : {}),
    },
    body: opciones.cuerpo === undefined ? undefined : JSON.stringify(opciones.cuerpo),
  });

  if (!respuesta.ok) {
    const contenido: unknown = await respuesta.json().catch(() => null);
    const mensaje = typeof contenido === 'object' && contenido !== null
      && 'mensaje' in contenido && typeof contenido.mensaje === 'string'
      ? contenido.mensaje
      : `Error del servidor (${respuesta.status}).`;
    throw new ErrorApi(respuesta.status, mensaje);
  }

  return respuesta.json() as Promise<T>;
}
