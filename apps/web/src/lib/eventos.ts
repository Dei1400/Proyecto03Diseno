export interface EventoResumen {
  id: number; nombre: string; categoria: string; provincia: string; lugar: string;
  fechaHora: string; imagen?: string; destacado: boolean; precioDesde: number; // precio final
}

const EJEMPLO: EventoResumen[] = [
  { id: 1, nombre: 'Noche de Rock Nacional', categoria: 'Conciertos', provincia: 'San José', lugar: 'Anfiteatro Central', fechaHora: '2026-12-12T19:00:00-06:00', destacado: true, precioDesde: 25000 },
  { id: 2, nombre: 'Festival Pura Vida', categoria: 'Festivales', provincia: 'Heredia', lugar: 'Parque Central', fechaHora: '2026-12-20T15:00:00-06:00', destacado: false, precioDesde: 16500 },
  { id: 3, nombre: 'Gala de Orquesta Sinfónica', categoria: 'Teatro', provincia: 'San José', lugar: 'Teatro Principal', fechaHora: '2027-01-09T19:30:00-06:00', destacado: false, precioDesde: 16500 },
  { id: 4, nombre: 'Stand-up en el Valle', categoria: 'Humor', provincia: 'Cartago', lugar: 'Centro de Eventos', fechaHora: '2027-01-23T20:00:00-06:00', destacado: false, precioDesde: 16500 },
  { id: 5, nombre: 'Tarde de Música Latina', categoria: 'Conciertos', provincia: 'Alajuela', lugar: 'Plaza Mayor', fechaHora: '2027-02-06T17:00:00-06:00', destacado: false, precioDesde: 16500 },
];

export async function obtenerEventos(): Promise<EventoResumen[]> {
  const base = process.env.NEXT_PUBLIC_API_URL;
  if (!base) return EJEMPLO;
  try {
    const res = await fetch(`${base}/eventos`, { next: { revalidate: 30 } });
    if (!res.ok) throw new Error('API no disponible');
    return await res.json();
  } catch {
    return EJEMPLO;
  }
}
