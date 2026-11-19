export interface Evento {
  id: string;
  titulo: string;
  descripcion: string;
  fecha: string;
  hora: string;
  lugar: string;
  categoria: string;
  precio: number;
  imagen: string;
  destacado?: boolean;
}

export const eventosEjemplo: Evento[] = [
  {
    id: '1',
    titulo: 'Festival de Música Electrónica',
    descripcion: 'Disfruta de las mejores bandas de música electrónica en vivo.',
    fecha: '2026-12-15',
    hora: '20:00',
    lugar: 'Parque la Sabana, San José',
    categoria: 'Música',
    precio: 25000,
    imagen: '/eventos/musica-electronica.jpg',
    destacado: true,
  },
  {
    id: '2',
    titulo: 'Taller de Cocina Costarricense',
    descripcion: 'Aprende a preparar platillos típicos de Costa Rica con chefs locales.',
    fecha: '2026-11-25',
    hora: '14:00',
    lugar: 'Centro Comercial, San Pedro',
    categoria: 'Gastronomía',
    precio: 15000,
    imagen: '/eventos/cocina.jpg',
  },
  {
    id: '3',
    titulo: 'Conferencia de Tecnología e Innovación',
    descripcion: 'Descubre las últimas tendencias en tech y startups costarricenses.',
    fecha: '2026-11-30',
    hora: '09:00',
    lugar: 'Hotel Auténtico, San José',
    categoria: 'Tecnología',
    precio: 20000,
    imagen: '/eventos/tech-conf.jpg',
  },
  {
    id: '4',
    titulo: 'Noche de Comedia Stand-up',
    descripcion: 'Risa garantizada con los mejores comediantes locales.',
    fecha: '2026-12-01',
    hora: '21:00',
    lugar: 'Teatro Popular, San José',
    categoria: 'Comedia',
    precio: 12000,
    imagen: '/eventos/stand-up.jpg',
  },
  {
    id: '5',
    titulo: 'Carrera Benéfica 5K',
    descripcion: 'Corre por una buena causa. Todos los fondos van a organizaciones locales.',
    fecha: '2026-12-05',
    hora: '06:00',
    lugar: 'Parque Metropolitano, La Sabana',
    categoria: 'Deporte',
    precio: 8000,
    imagen: '/eventos/carrera-5k.jpg',
  },
  {
    id: '6',
    titulo: 'Exposición de Arte Contemporáneo',
    descripcion: 'Obras de artistas emergentes de Centroamérica. Acceso libre.',
    fecha: '2026-12-10',
    hora: '10:00',
    lugar: 'Museo de Arte, San José',
    categoria: 'Arte',
    precio: 0,
    imagen: '/eventos/arte.jpg',
  },
];

export async function obtenerEventos(): Promise<Evento[]> {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;

  if (!apiUrl) {
    return eventosEjemplo;
  }

  try {
    const response = await fetch(`${apiUrl}/eventos`, {
      cache: 'no-store',
    });
    if (!response.ok) {
      console.error(`API error: ${response.status}`);
      return eventosEjemplo;
    }
    return await response.json();
  } catch (error) {
    console.error('Error fetching eventos:', error);
    return eventosEjemplo;
  }
}
