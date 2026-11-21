import {
  PrismaClient,
  Categoria,
  Provincia,
  EstadoAsiento,
  EstadoOrden,
  MetodoPago,
  Rol,
} from '@prisma/client';
import * as bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

// Contraseña de los usuarios de prueba (anotarla en el README)
const CONTRASENA_DEMO = 'AlexaDeilyn2026';

// Mismos porcentajes que usará CalculadoraPrecio (RN-05)
const CARGO_SERVICIO = 0.08;
const IMPUESTOS = 0.13 + 0.06 + 0.05; // IVA + espectáculos + municipal

const ZONAS = [
  { nombre: 'VIP', precio: 60000, filas: ['A', 'B'] },
  { nombre: 'Platea', precio: 35000, filas: ['C', 'D'] },
  { nombre: 'General', precio: 20000, filas: ['E'] },
];
const ASIENTOS_POR_FILA = 8; // 5 filas x 8 = 40 asientos por evento

const EVENTOS = [
  {
    nombre: 'Noche de Rock Nacional',
    artista: 'Varios artistas',
    descripcion: 'Las mejores bandas de rock costarricense en una sola noche.',
    categoria: Categoria.CONCIERTO,
    provincia: Provincia.SAN_JOSE,
    lugar: 'Estadio Nacional, La Sabana',
    dias: 20,
    destacado: true,
    factor: 1,
    clasificacionEdad: '+12',
  },
  {
    nombre: 'El Lago de los Cisnes',
    artista: 'Compañía de Danza Aurora',
    descripcion: 'El ballet clásico en una puesta en escena para toda la familia.',
    categoria: Categoria.TEATRO,
    provincia: Provincia.SAN_JOSE,
    lugar: 'Teatro Nacional',
    dias: 35,
    destacado: false,
    factor: 0.8,
    clasificacionEdad: 'Todo público',
  },
  {
    nombre: 'Festival del Pacífico',
    artista: 'Varios artistas',
    descripcion: 'Dos escenarios de música electrónica y latina frente al mar.',
    categoria: Categoria.FESTIVAL,
    provincia: Provincia.PUNTARENAS,
    lugar: 'Playa Jacó',
    dias: 50,
    destacado: true,
    factor: 1.2,
    clasificacionEdad: '+18',
  },
  {
    nombre: 'Final de Fútbol Sala',
    artista: 'Heredia vs. Cartago',
    descripcion: 'La gran final del torneo nacional de fútbol sala.',
    categoria: Categoria.DEPORTE,
    provincia: Provincia.HEREDIA,
    lugar: 'Palacio de los Deportes',
    dias: 12,
    destacado: false,
    factor: 0.6,
    clasificacionEdad: 'Todo público',
  },
  {
    nombre: 'Magia para la Familia',
    artista: 'El Mago Tavo',
    descripcion: 'Un show de magia e ilusionismo para grandes y pequeños.',
    categoria: Categoria.FAMILIAR,
    provincia: Provincia.ALAJUELA,
    lugar: 'Teatro Municipal de Alajuela',
    dias: 15,
    destacado: false,
    factor: 0.5,
    clasificacionEdad: 'Todo público',
  },
];

// Fecha dentro de N días a las 8:00 p. m. de Costa Rica (UTC-6)
function fechaEnDias(dias: number, hora = 20): Date {
  const fecha = new Date();
  fecha.setUTCDate(fecha.getUTCDate() + dias);
  fecha.setUTCHours(hora + 6, 0, 0, 0);
  return fecha;
}

async function main() {
  // Borra todo en orden (por las relaciones) para poder correrlo varias veces
  await prisma.boleto.deleteMany();
  await prisma.asiento.deleteMany();
  await prisma.zona.deleteMany();
  await prisma.orden.deleteMany();
  await prisma.evento.deleteMany();
  await prisma.usuario.deleteMany();

  const hash = await bcrypt.hash(CONTRASENA_DEMO, 10);

  const productora = await prisma.usuario.create({
    data: {
      nombre: 'Productora Demo',
      correo: 'productora@queplan.test',
      contrasenaHash: hash,
      cedula: '3-101-000000',
      telefono: '22223333',
      rol: Rol.PRODUCTORA,
    },
  });

  const comprador = await prisma.usuario.create({
    data: {
      nombre: 'Comprador Demo',
      correo: 'comprador@queplan.test',
      contrasenaHash: hash,
      cedula: '1-1111-1111',
      telefono: '88887777',
    },
  });

  for (const [i, e] of EVENTOS.entries()) {
    const evento = await prisma.evento.create({
      data: {
        productoraId: productora.id,
        nombre: e.nombre,
        artista: e.artista,
        descripcion: e.descripcion,
        categoria: e.categoria,
        provincia: e.provincia,
        lugar: e.lugar,
        fechaHora: fechaEnDias(e.dias),
        imagenUrl: `https://picsum.photos/seed/queplan-${i + 1}/1200/600`,
        clasificacionEdad: e.clasificacionEdad,
        destacado: e.destacado,
        zonas: {
          create: ZONAS.map((z) => ({
            nombre: z.nombre,
            precio: Math.round((z.precio * e.factor) / 500) * 500,
            asientos: {
              create: z.filas.flatMap((fila) =>
                Array.from({ length: ASIENTOS_POR_FILA }, (_, n) => ({
                  fila,
                  numero: n + 1,
                })),
              ),
            },
          })),
        },
      },
      include: { zonas: { include: { asientos: true } } },
    });

    // 2 asientos bloqueados por la productora en cada evento
    const general = evento.zonas.find((z) => z.nombre === 'General')!;
    await prisma.asiento.updateMany({
      where: { zonaId: general.id, numero: { in: [7, 8] } },
      data: { estado: EstadoAsiento.BLOQUEADO },
    });

    // Una compra pagada en el primer evento, para que haya boletos y ventas
    if (i === 0) {
      const platea = evento.zonas.find((z) => z.nombre === 'Platea')!;
      const vendidos = platea.asientos.filter(
        (a) => a.fila === 'C' && a.numero <= 2,
      );
      const subtotal = platea.precio * vendidos.length;
      const cargoServicio = Math.round(subtotal * CARGO_SERVICIO);
      const impuestos = Math.round(subtotal * IMPUESTOS);

      const orden = await prisma.orden.create({
        data: {
          usuarioId: comprador.id,
          eventoId: evento.id,
          subtotal,
          cargoServicio,
          impuestos,
          total: subtotal + cargoServicio + impuestos,
          metodoPago: MetodoPago.TARJETA,
          ultimos4: '4242',
          estado: EstadoOrden.PAGADA,
          boletos: { create: vendidos.map((a) => ({ asientoId: a.id })) },
        },
      });

      await prisma.asiento.updateMany({
        where: { id: { in: vendidos.map((a) => a.id) } },
        data: { estado: EstadoAsiento.VENDIDO, ordenId: orden.id },
      });
    }
  }

  console.log('Datos de prueba cargados');
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });