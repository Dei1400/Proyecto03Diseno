import { api } from './api';
import { CATEGORIAS_API, PROVINCIAS_API } from './catalogo';
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

export async function obtenerEventos(filtros: Filtros = {}): Promise<EventoResumen[]> {
  const params = new URLSearchParams();
  if (filtros.q) params.set('q', filtros.q);
  if (filtros.categoria) params.set('categoria', CATEGORIAS_API[filtros.categoria]);
  if (filtros.provincia) params.set('provincia', PROVINCIAS_API[filtros.provincia]);
  const consulta = params.toString();
  const eventos = await api<EventoApi[]>(`/eventos${consulta ? `?${consulta}` : ''}`, { metodo: 'GET' });
  return eventos.map((evento) => ({
    ...evento,
    categoria: nombreDeCodigo(CATEGORIAS_API, evento.categoria),
    provincia: nombreDeCodigo(PROVINCIAS_API, evento.provincia),
    imagen: evento.imagenUrl,
  })).filter((evento) => estaEnRango(evento, filtros));
}

export function ordenar(lista: EventoResumen[], orden: Orden): EventoResumen[] {
  const copia = [...lista];
  if (orden === 'precio') return copia.sort((a, b) => (a.precioDesde ?? Infinity) - (b.precioDesde ?? Infinity));
  if (orden === 'nombre') return copia.sort((a, b) => a.nombre.localeCompare(b.nombre, 'es'));
  return copia.sort((a, b) => new Date(a.fechaHora).getTime() - new Date(b.fechaHora).getTime());
}
