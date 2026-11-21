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

// Contraseña de los usuarios de prueba 
const CONTRASENA_DEMO = 'AlexaDeilyn2026';

// Mismos porcentajes que usa CalculadoraPrecio 
const CARGO_SERVICIO = 0.08;
const IMPUESTOS = 0.13 + 0.06 + 0.05; // IVA + espectáculos + municipal

// Cada zona cuesta el precio base del evento por su factor
const ZONAS = [
  { nombre: 'VIP', factor: 2.5, filas: ['A', 'B'] },
  { nombre: 'Platea', factor: 1.5, filas: ['C', 'D'] },
  { nombre: 'General', factor: 1, filas: ['E'] },
];
const ASIENTOS_POR_FILA = 8; // 5 filas x 8 = 40 asientos por evento

// Precio base (sin impuestos) de la zona General
const PRECIO_ALTO = 18940; // precio final: 25 000
const PRECIO_NORMAL = 12500; // precio final: 16 500

// Los mismos eventos e imágenes del diseño de la web (apps/web/public)
const EVENTOS = [
  {
    nombre: 'Noche de Rock Nacional', artista: 'Varios artistas',
    descripcion: 'Las bandas de rock costarricense más conocidas en una sola noche.',
    categoria: Categoria.CONCIERTO, provincia: Provincia.SAN_JOSE, lugar: 'Anfiteatro Central',
    fechaHora: '2026-12-12T19:00:00-06:00', imagen: '/rock.jpg',
    destacado: true, precio: PRECIO_ALTO, clasificacionEdad: '+12',
  },
  {
    nombre: 'Festival Pura Vida', artista: 'Varios artistas',
    descripcion: 'Un día de música, comida y cultura costarricense al aire libre.',
    categoria: Categoria.FESTIVAL, provincia: Provincia.HEREDIA, lugar: 'Parque Central',
    fechaHora: '2026-12-20T15:00:00-06:00', imagen: '/puravidafes.jpg',
    destacado: false, precio: PRECIO_NORMAL, clasificacionEdad: 'Todo público',
  },
  {
    nombre: 'Gala de Orquesta Sinfónica', artista: 'Orquesta Sinfónica',
    descripcion: 'Una gala con obras clásicas interpretadas por la orquesta completa.',
    categoria: Categoria.TEATRO, provincia: Provincia.SAN_JOSE, lugar: 'Teatro Principal',
    fechaHora: '2027-01-09T19:30:00-06:00', imagen: '/orquesta.jpg',
    destacado: false, precio: PRECIO_NORMAL, clasificacionEdad: 'Todo público',
  },
  {
    nombre: 'Stand-up en el Valle', artista: 'Comediantes nacionales',
    descripcion: 'Una noche de comedia en vivo con humoristas costarricenses.',
    categoria: Categoria.TEATRO, provincia: Provincia.CARTAGO, lugar: 'Centro de Eventos',
    fechaHora: '2027-01-23T20:00:00-06:00', imagen: '/standup.jpg',
    destacado: false, precio: PRECIO_NORMAL, clasificacionEdad: '+18',
  },
  {
    nombre: 'Tarde de Música Latina', artista: 'Varios artistas',
    descripcion: 'Salsa, merengue y cumbia para bailar toda la tarde.',
    categoria: Categoria.CONCIERTO, provincia: Provincia.ALAJUELA, lugar: 'Plaza Mayor',
    fechaHora: '2027-02-06T17:00:00-06:00', imagen: '/festivallatino.jpg',
    destacado: false, precio: PRECIO_NORMAL, clasificacionEdad: 'Todo público',
  },
  {
    nombre: 'Festival de Sabores del Pacífico', artista: 'Cocineros del Pacífico',
    descripcion: 'Comida típica, música en vivo y actividades para toda la familia.',
    categoria: Categoria.FESTIVAL, provincia: Provincia.PUNTARENAS, lugar: 'Paseo Costero',
    fechaHora: '2027-02-13T14:00:00-06:00', imagen: '/festivalcomida.jpg',
    destacado: false, precio: PRECIO_NORMAL, clasificacionEdad: 'Todo público',
  },
  {
    nombre: 'Noche de Jazz bajo las Estrellas', artista: 'Ensamble de jazz',
    descripcion: 'Jazz en vivo al aire libre en una noche guanacasteca.',
    categoria: Categoria.CONCIERTO, provincia: Provincia.GUANACASTE, lugar: 'Anfiteatro del Sol',
    fechaHora: '2027-02-20T19:00:00-06:00', imagen: '/jazz.jpg',
    destacado: false, precio: PRECIO_ALTO, clasificacionEdad: '+12',
  },
  {
    nombre: 'Aventura en Familia', artista: 'Grupo de animación',
    descripcion: 'Juegos, música y teatro para niños y familias.',
    categoria: Categoria.FAMILIAR, provincia: Provincia.HEREDIA, lugar: 'Parque de los Encuentros',
    fechaHora: '2027-02-28T10:00:00-06:00', imagen: '/aventurafamilia.jpg',
    destacado: false, precio: PRECIO_NORMAL, clasificacionEdad: 'Todo público',
  },
  {
    nombre: 'Copa de Baloncesto Nacional', artista: 'Final del torneo nacional',
    descripcion: 'La gran final del torneo nacional de baloncesto.',
    categoria: Categoria.DEPORTE, provincia: Provincia.SAN_JOSE, lugar: 'Gimnasio Central',
    fechaHora: '2027-03-06T16:00:00-06:00', imagen: '/baloncesto.jpg',
    destacado: false, precio: PRECIO_NORMAL, clasificacionEdad: 'Todo público',
  },
  {
    nombre: 'Historias del Bosque', artista: 'Compañía de teatro',
    descripcion: 'Una obra sobre la naturaleza para toda la familia.',
    categoria: Categoria.TEATRO, provincia: Provincia.CARTAGO, lugar: 'Teatro del Valle',
    fechaHora: '2027-03-13T18:00:00-06:00', imagen: '/teatro.jpg',
    destacado: false, precio: PRECIO_NORMAL, clasificacionEdad: 'Todo público',
  },
  {
    nombre: 'Ritmos del Caribe', artista: 'Varios artistas',
    descripcion: 'Calipso, reggae y música caribeña frente al mar.',
    categoria: Categoria.FESTIVAL, provincia: Provincia.LIMON, lugar: 'Plaza del Caribe',
    fechaHora: '2027-03-20T15:00:00-06:00', imagen: '/ritmocaribe.jpg',
    destacado: false, precio: PRECIO_ALTO, clasificacionEdad: 'Todo público',
  },
  {
    nombre: 'Encuentro de Música Acústica', artista: 'Varios artistas',
    descripcion: 'Artistas nacionales en formato acústico, al aire libre.',
    categoria: Categoria.CONCIERTO, provincia: Provincia.ALAJUELA, lugar: 'Jardín Cultural',
    fechaHora: '2027-03-27T18:30:00-06:00', imagen: '/muiscaacustica.jpg',
    destacado: false, precio: PRECIO_NORMAL, clasificacionEdad: 'Todo público',
  },
];

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
        fechaHora: new Date(e.fechaHora),
        imagenUrl: e.imagen, // imagen de apps/web/public
        clasificacionEdad: e.clasificacionEdad,
        destacado: e.destacado,
        zonas: {
          create: ZONAS.map((z) => ({
            nombre: z.nombre,
            precio: Math.round(e.precio * z.factor),
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

    // Una compra pagada en el primer evento, para que haya boletos de ejemplo
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