export interface BoletoVista {
  id: number;
  descripcion: string;
  qr?: string;
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
  throw new Error('La consulta de boletos aún no está disponible.');
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
