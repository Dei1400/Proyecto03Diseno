import { api, ErrorApi } from './api';
import { CATEGORIAS_API, PROVINCIAS_API } from './catalogo';
import { nombreDeCodigo } from './eventos';

export interface Desglose {
  subtotal: number; iva: number; impuestoEspectaculos: number;
  impuestoMunicipal: number; cargoServicio: number; total: number;
}

export interface Zona {
  id: number; nombre: string; precioFinal: number; desglose: Desglose;
}

export interface EventoDetalle {
  id: number; nombre: string; descripcion: string; categoria: string; provincia: string; lugar: string;
  fechaHora: string; imagen?: string; clasificacionEdad: string; zonas: Zona[];
}

interface EventoDetalleApi extends Omit<EventoDetalle, 'imagen'> {
  imagenUrl: string;
}

export async function obtenerEvento(id: number): Promise<EventoDetalle | null> {
  try {
    const evento = await api<EventoDetalleApi>(`/eventos/${id}`, { metodo: 'GET' });
    return {
      ...evento,
      categoria: nombreDeCodigo(CATEGORIAS_API, evento.categoria),
      provincia: nombreDeCodigo(PROVINCIAS_API, evento.provincia),
      imagen: evento.imagenUrl,
    };
  } catch (error) {
    if (error instanceof ErrorApi && error.estado === 404) return null;
    throw error;
  }
}
