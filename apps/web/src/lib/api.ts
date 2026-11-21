import { obtenerToken } from './sesion';

// por el plan gratis de render
const ESPERA_MAXIMA_MS = 60 * 1000;

export class ErrorApi extends Error {
  constructor(public readonly estado: number, mensaje: string) {
    super(mensaje);
    this.name = 'ErrorApi';
  }
}

// la variable de entorno o, en desarrollo, el API local
export function direccionApi(): string | undefined {
  const base = process.env.NEXT_PUBLIC_API_URL
    || (process.env.NODE_ENV === 'development' ? 'http://localhost:3000' : undefined);
  return base?.replace(/\/$/, '');
}

export async function api<T>(
  ruta: string,
  opciones: { metodo: string; cuerpo?: unknown; autenticado?: boolean },
): Promise<T> {
  const base = direccionApi();
  if (!base) {
    throw new Error('Configura NEXT_PUBLIC_API_URL para conectar con el servidor.');
  }

  const token = opciones.autenticado ? obtenerToken() : null;
  if (opciones.autenticado && !token) throw new Error('Debes iniciar sesión para continuar.');

  let respuesta: Response;
  try {
    respuesta = await fetch(`${base}${ruta}`, {
      method: opciones.metodo,
      headers: {
        ...(opciones.cuerpo === undefined ? {} : { 'Content-Type': 'application/json' }),
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      body: opciones.cuerpo === undefined ? undefined : JSON.stringify(opciones.cuerpo),
      cache: 'no-store',
      signal: AbortSignal.timeout(ESPERA_MAXIMA_MS),
    });
  } catch (error) {
    console.error('No se pudo conectar con el API.', error);
    throw new Error('No se pudo conectar con el servidor. Comprueba la conexión e inténtalo de nuevo.');
  }

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