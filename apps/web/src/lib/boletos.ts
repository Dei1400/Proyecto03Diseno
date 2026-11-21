import { api } from './api';
import { PROVINCIAS_API } from './catalogo';
import { nombreDeCodigo } from './eventos';

export interface BoletoVista {
  id: number;
  codigo: string;
  descripcion: string;
  qr: string;
}

export interface BoletoApi extends BoletoVista {
  evento: {
    id: number;
    nombre: string;
    fechaHora: string;
    lugar: string;
    provincia: string;
  };
}

export async function obtenerBoletos(): Promise<BoletoApi[]> {
  const boletos = await api<BoletoApi[]>('/boletos', { metodo: 'GET', autenticado: true });
  return boletos.map(convertirProvincia);
}

export async function obtenerBoleto(id: number): Promise<BoletoApi> {
  const boleto = await api<BoletoApi>(`/boletos/${id}`, { metodo: 'GET', autenticado: true });
  return convertirProvincia(boleto);
}

function convertirProvincia(boleto: BoletoApi): BoletoApi {
  return { ...boleto, evento: { ...boleto.evento, provincia: nombreDeCodigo(PROVINCIAS_API, boleto.evento.provincia) } };
}

export function agruparPorEvento(boletos: BoletoApi[]) {
  const grupos = new Map<number, { evento: BoletoApi['evento']; boletos: BoletoVista[]; pasado: boolean }>();
  const ahora = Date.now();
  for (const boleto of boletos) {
    const grupo = grupos.get(boleto.evento.id);
    if (grupo) {
      grupo.boletos.push(boleto);
    } else {
      grupos.set(boleto.evento.id, {
        evento: boleto.evento,
        boletos: [boleto],
        pasado: new Date(boleto.evento.fechaHora).getTime() < ahora,
      });
    }
  }
  return Array.from(grupos.values());
}
