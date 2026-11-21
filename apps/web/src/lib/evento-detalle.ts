import { CATEGORIAS_API, PROVINCIAS_API } from './catalogo';
import { EJEMPLO, nombreDeCodigo } from './eventos';
import type { EventoResumen } from './eventos';

export interface Desglose {
  subtotal: number; iva: number; impuestoEspectaculos: number;
  impuestoMunicipal: number; cargoServicio: number; total: number;
}

export interface Zona {
  id: number; nombre: string; precioFinal: number; desglose: Desglose;
}

export interface EventoDetalle {
  id: number; nombre: string; descripcion: string; categoria: string; provincia: string; lugar: string;
  fechaHora: string; imagen?: string; clasificacionEdad: string; zonas: Zona[]; esEjemplo: boolean;
}

interface EventoDetalleApi extends Omit<EventoDetalle, 'imagen' | 'esEjemplo'> {
  imagenUrl: string;
}

function desgloseEjemplo(subtotal: number): Desglose {
  const iva = Math.round(subtotal * 0.13);
  const impuestoEspectaculos = Math.round(subtotal * 0.06);
  const impuestoMunicipal = Math.round(subtotal * 0.05);
  const cargoServicio = Math.round(subtotal * 0.08);
  return { subtotal, iva, impuestoEspectaculos, impuestoMunicipal, cargoServicio, total: subtotal + iva + impuestoEspectaculos + impuestoMunicipal + cargoServicio };
}

function detalleEjemplo(evento: EventoResumen): EventoDetalle {
  const bases: Record<number, number> = { 25000: 18940, 16500: 12500 };
  const base = evento.precioDesde === null ? undefined : bases[evento.precioDesde];
  if (base === undefined) throw new Error(`No hay precios de ejemplo para el evento ${evento.id}.`);
  const zonas = [
    { nombre: 'VIP', factor: 2.5 },
    { nombre: 'Platea', factor: 1.5 },
    { nombre: 'General', factor: 1 },
  ].map((zona, indice) => {
    const desglose = desgloseEjemplo(Math.round(base * zona.factor));
    return { id: evento.id * 10 + indice, nombre: zona.nombre, precioFinal: desglose.total, desglose };
  });
  return {
    id: evento.id, nombre: evento.nombre, categoria: evento.categoria, provincia: evento.provincia,
    lugar: evento.lugar, fechaHora: evento.fechaHora, imagen: evento.imagen,
    clasificacionEdad: 'Mayores de 12 años',
    descripcion: 'Descripción de ejemplo del evento.',
    zonas, esEjemplo: true,
  };
}

export async function obtenerEvento(id: number): Promise<EventoDetalle | null> {
  const base = process.env.NEXT_PUBLIC_API_URL;
  if (!base) {
    const evento = EJEMPLO.find((e) => e.id === id);
    return evento ? detalleEjemplo(evento) : null;
  }
  const respuesta = await fetch(`${base.replace(/\/$/, '')}/eventos/${id}`, { next: { revalidate: 30 } });
  if (respuesta.status === 404) return null;
  if (!respuesta.ok) throw new Error(`No se pudo cargar el evento (${respuesta.status}).`);
  const evento: EventoDetalleApi = await respuesta.json();
  return {
    ...evento,
    categoria: nombreDeCodigo(CATEGORIAS_API, evento.categoria),
    provincia: nombreDeCodigo(PROVINCIAS_API, evento.provincia),
    imagen: evento.imagenUrl,
    esEjemplo: false,
  };
}
