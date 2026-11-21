# QuéPlan

Página web para comprar entradas de conciertos y espectáculos en Costa Rica.
La persona busca un evento, elige sus asientos en el mapa, paga (pago simulado) y recibe sus boletos con código QR.

## Funcionalidades

- Buscar eventos por nombre, categoría, provincia y fecha.
- Ver el mapa de asientos de un evento, con cambios en tiempo real.
- Apartar asientos por 10 minutos mientras se paga.
- Pagar con tarjeta o en cuotas (pago simulado, no se cobra dinero real).
- Ver los boletos comprados con su código QR.
- Crear cuenta, iniciar sesión y editar el perfil.

## Tecnologías

| Parte | Tecnología | Publicación |
|---|---|---|
| Web (`apps/web`) | Next.js, React, TypeScript | Vercel |
| API (`apps/api`) | NestJS, TypeScript, Socket.IO | Render |
| Base de datos | PostgreSQL con Prisma | Supabase |

## Estructura

```
apps/
├── api/
│   ├── prisma/          esquema de la base de datos y datos de ejemplo
│   └── src/
│       ├── auth/        registro, inicio de sesión y token
│       ├── eventos/     catálogo y precio final
│       ├── asientos/    apartar y liberar asientos (State)
│       ├── ordenes/     crear y pagar órdenes
│       ├── pagos/       métodos de pago (Strategy)
│       ├── boletos/     boletos con código QR
│       ├── usuarios/    perfil
│       ├── tiempo-real/ avisos en vivo (Observer)
│       └── comun/       piezas compartidas
└── web/                 página web
```

## Cómo correrlo en local

Requisito: Node 20 o más nuevo. El API y la web se corren en dos terminales.

### API (puerto 3000)

```bash
cd apps/api
npm install
```

Copiar `.env.example` con el nombre `.env` y llenar los valores. Después:

```bash
npx prisma generate
npm run start:dev
```

Para revisar que funciona: http://localhost:3000/salud

Solo si la base de datos es nueva, crear las tablas y los datos de ejemplo
(no usarlo en una base de datos con datos reales, porque el seed los borra):

```bash
npx prisma db push
npx prisma db seed
```

### Web (puerto 3001)

```bash
cd apps/web
npm install
npm run dev
```

Abrir http://localhost:3001

## Variables de entorno

API (`apps/api/.env`):

| Variable | Descripción |
|---|---|
| `DATABASE_URL` | Conexión a PostgreSQL con pooler (puerto 6543) |
| `DIRECT_URL` | Conexión directa para `prisma db push` (puerto 5432) |
| `JWT_SECRET` | Texto secreto para firmar los tokens de sesión |
| `FRONTEND_URL` | Páginas que pueden usar el API, separadas por comas |
| `PORT` | Puerto del API (por defecto 3000) |

Web:

| Variable | Descripción |
|---|---|
| `NEXT_PUBLIC_API_URL` | Dirección del API publicado (en local no hace falta) |

## Usuarios de prueba

| Rol | Correo | Contraseña |
|---|---|---|
| Comprador | `comprador@queplan.test` | `AlexaDeilyn2026` |
| Productora | `productora@queplan.test` | `AlexaDeilyn2026` |

Para probar el pago, cualquier tarjeta de 16 dígitos se aprueba, excepto las que
terminan en `0002`, que se rechazan a propósito.

## Rutas del API

Las rutas que piden sesión usan el encabezado `Authorization: Bearer <token>`.
Todos los errores responden con la forma `{ "mensaje": "..." }`.

| Método | Ruta | Sesión | Descripción |
|---|---|---|---|
| GET | `/salud` | No | Revisa que el API y la base de datos respondan |
| POST | `/auth/registro` | No | Crea una cuenta |
| POST | `/auth/login` | No | Inicia sesión y devuelve el token |
| GET | `/eventos` | No | Lista eventos (filtros: `q`, `categoria`, `provincia`, `fecha`) |
| GET | `/eventos/:id` | No | Detalle de un evento con sus zonas y precios |
| GET | `/eventos/:id/asientos` | No | Asientos del evento con su estado |
| POST | `/asientos/retener` | Sí | Aparta asientos por 10 minutos |
| POST | `/asientos/liberar` | Sí | Devuelve asientos apartados |
| POST | `/ordenes` | Sí | Crea la orden con el desglose del precio |
| POST | `/ordenes/:id/pagar` | Sí | Paga la orden con `TARJETA` o `CUOTAS` |
| GET | `/ordenes` | Sí | Historial de compras |
| GET | `/boletos` | Sí | Boletos de la persona con código QR |
| GET | `/boletos/:id` | Sí | Detalle de un boleto |
| GET | `/usuarios/yo` | Sí | Perfil de la persona |
| PUT | `/usuarios/yo` | Sí | Cambia nombre y teléfono |

### Tiempo real (Socket.IO)

| Mensaje | Dirección | Datos |
|---|---|---|
| `evento.unirse` / `evento.salir` | Web a API | id del evento |
| `asiento.cambio` | API a web | `{ eventoId, asientos: [{ id, estado, vencenEn }] }` |

## Patrones de diseño

| Patrón | Dónde | Para qué |
|---|---|---|
| MVC | Controladores, servicios con Prisma y páginas de la web | Separar la vista, el control y los datos |
| State | `asientos/estados-asiento.ts`, `asientos/contexto-asiento.ts` | Cada estado del asiento decide qué acciones se permiten |
| Strategy | `pagos/estrategias/`, `pagos/procesador-pagos.service.ts` | Cada método de pago es una clase intercambiable |
| Observer | `tiempo-real/` | Al cambiar un asiento se avisa al mapa en vivo y al reporte de ventas |

## Reglas de negocio

- Un asiento apartado se guarda por 10 minutos. Si no se paga, vuelve a estar disponible.
- Máximo 6 boletos por persona en cada evento.
- Precio final: precio de la zona más 8 % de cargo por servicio, 13 % de IVA,
  6 % de impuesto de espectáculos y 5 % de impuesto municipal.
- Dos personas no pueden quedarse con el mismo asiento.

## Equipo

- Deilyn: API y base de datos.
- Alexa: página web, diseño y accesibilidad.