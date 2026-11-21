import { CATEGORIAS_API, limpiarTexto, PROVINCIAS_API } from './catalogo';
import type { Categoria, Orden, Provincia } from './catalogo';

export interface EventoResumen {
  id: number; nombre: string; categoria: string; provincia: string; lugar: string;
  fechaHora: string; imagen?: string; destacado: boolean; precioDesde: number | null;
}

export interface Filtros { q?: string; categoria?: Categoria; provincia?: Provincia; fecha?: string; fechaHasta?: string }

interface EventoApi extends Omit<EventoResumen, 'categoria' | 'provincia' | 'imagen'> {
  categoria: (typeof CATEGORIAS_API)[keyof typeof CATEGORIAS_API];
  provincia: (typeof PROVINCIAS_API)[Provincia];
  imagenUrl: string;
}

export const EJEMPLO: EventoResumen[] = [
  { id: 1, nombre: 'Noche de Rock Nacional', categoria: 'Conciertos', provincia: 'San José', lugar: 'Anfiteatro Central', fechaHora: '2026-12-12T19:00:00-06:00', imagen: '/rock.jpg', destacado: true, precioDesde: 25000 },
  { id: 2, nombre: 'Festival Pura Vida', categoria: 'Festivales', provincia: 'Heredia', lugar: 'Parque Central', fechaHora: '2026-12-20T15:00:00-06:00', imagen: '/puravidafes.jpg', destacado: false, precioDesde: 16500 },
  { id: 3, nombre: 'Gala de Orquesta Sinfónica', categoria: 'Teatro', provincia: 'San José', lugar: 'Teatro Principal', fechaHora: '2027-01-09T19:30:00-06:00', imagen: '/orquesta.jpg', destacado: false, precioDesde: 16500 },
  { id: 4, nombre: 'Stand-up en el Valle', categoria: 'Humor', provincia: 'Cartago', lugar: 'Centro de Eventos', fechaHora: '2027-01-23T20:00:00-06:00', imagen: '/standup.jpg', destacado: false, precioDesde: 16500 },
  { id: 5, nombre: 'Tarde de Música Latina', categoria: 'Conciertos', provincia: 'Alajuela', lugar: 'Plaza Mayor', fechaHora: '2027-02-06T17:00:00-06:00', imagen: '/festivallatino.jpg', destacado: false, precioDesde: 16500 },
  { id: 6, nombre: 'Festival de Sabores del Pacífico', categoria: 'Festivales', provincia: 'Puntarenas', lugar: 'Paseo Costero', fechaHora: '2027-02-13T14:00:00-06:00', imagen: '/festivalcomida.jpg', destacado: false, precioDesde: 16500 },
  { id: 7, nombre: 'Noche de Jazz bajo las Estrellas', categoria: 'Conciertos', provincia: 'Guanacaste', lugar: 'Anfiteatro del Sol', fechaHora: '2027-02-20T19:00:00-06:00', imagen: '/jazz.jpg', destacado: false, precioDesde: 25000 },
  { id: 8, nombre: 'Aventura en Familia', categoria: 'Familia', provincia: 'Heredia', lugar: 'Parque de los Encuentros', fechaHora: '2027-02-28T10:00:00-06:00', imagen: '/aventurafamilia.jpg', destacado: false, precioDesde: 16500 },
  { id: 9, nombre: 'Copa de Baloncesto Nacional', categoria: 'Deportes', provincia: 'San José', lugar: 'Gimnasio Central', fechaHora: '2027-03-06T16:00:00-06:00', imagen: '/baloncesto.jpg', destacado: false, precioDesde: 16500 },
  { id: 10, nombre: 'Historias del Bosque', categoria: 'Teatro', provincia: 'Cartago', lugar: 'Teatro del Valle', fechaHora: '2027-03-13T18:00:00-06:00', imagen: '/teatro.jpg', destacado: false, precioDesde: 16500 },
  { id: 11, nombre: 'Ritmos del Caribe', categoria: 'Festivales', provincia: 'Limón', lugar: 'Plaza del Caribe', fechaHora: '2027-03-20T15:00:00-06:00', imagen: '/ritmocaribe.jpg', destacado: false, precioDesde: 25000 },
  { id: 12, nombre: 'Encuentro de Música Acústica', categoria: 'Conciertos', provincia: 'Alajuela', lugar: 'Jardín Cultural', fechaHora: '2027-03-27T18:30:00-06:00', imagen: '/muiscaacustica.jpg', destacado: false, precioDesde: 16500 },
];

function filtrarEjemplo(filtros: Filtros): EventoResumen[] {
  return EJEMPLO.filter((evento) => {
    if (filtros.q && !limpiarTexto(`${evento.nombre} ${evento.lugar} ${evento.categoria}`).includes(limpiarTexto(filtros.q))) return false;
    if (filtros.categoria && evento.categoria !== filtros.categoria) return false;
    if (filtros.provincia && evento.provincia !== filtros.provincia) return false;
    if (!estaEnRango(evento, filtros)) return false;
    return true;
  });
}

function estaEnRango(evento: EventoResumen, filtros: Filtros): boolean {
  const fechaEvento = new Date(evento.fechaHora);
  return (!filtros.fecha || fechaEvento >= new Date(`${filtros.fecha}T00:00:00-06:00`))
    && (!filtros.fechaHasta || fechaEvento <= new Date(`${filtros.fechaHasta}T23:59:59.999-06:00`));
}

export function nombreDeCodigo<T extends string>(mapa: Record<T, string>, codigo: string): T {
  const nombre = (Object.keys(mapa) as T[]).find((clave) => mapa[clave] === codigo);
  if (!nombre) throw new Error(`Valor de catálogo desconocido: ${codigo}`);
  return nombre;
}

export async function obtenerEventos(filtros: Filtros = {}, tolerarError = true): Promise<EventoResumen[]> {
  const base = process.env.NEXT_PUBLIC_API_URL;
  if (!base) return filtrarEjemplo(filtros);
  try {
    const params = new URLSearchParams();
    if (filtros.q) params.set('q', filtros.q);
    if (filtros.categoria && filtros.categoria !== 'Humor') params.set('categoria', CATEGORIAS_API[filtros.categoria]);
    if (filtros.provincia) params.set('provincia', PROVINCIAS_API[filtros.provincia]);
    const consulta = params.toString();
    const res = await fetch(`${base.replace(/\/$/, '')}/eventos${consulta ? `?${consulta}` : ''}`, { next: { revalidate: 30 } });
    if (!res.ok) throw new Error('API no disponible');
    const eventos: EventoApi[] = await res.json();
    const convertidos = eventos.map((evento) => ({
      ...evento,
      categoria: nombreDeCodigo(CATEGORIAS_API, evento.categoria),
      provincia: nombreDeCodigo(PROVINCIAS_API, evento.provincia),
      imagen: evento.imagenUrl,
    }));
    // El API aún no admite la categoría Humor.
    return filtros.categoria === 'Humor' ? [] : convertidos.filter((evento) => estaEnRango(evento, filtros));
  } catch (error) {
    if (!tolerarError) throw error;
    console.error('No se pudieron cargar los eventos desde el API.', error);
    return filtrarEjemplo(filtros);
  }
}

export function ordenar(lista: EventoResumen[], orden: Orden): EventoResumen[] {
  const copia = [...lista];
  if (orden === 'precio') return copia.sort((a, b) => (a.precioDesde ?? Infinity) - (b.precioDesde ?? Infinity));
  if (orden === 'nombre') return copia.sort((a, b) => a.nombre.localeCompare(b.nombre, 'es'));
  return copia.sort((a, b) => new Date(a.fechaHora).getTime() - new Date(b.fechaHora).getTime());
}
