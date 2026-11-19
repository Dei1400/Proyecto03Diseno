# Proyecto03Diseno

## Estructura MVC

```text
apps/
  api/                     API con NestJS (puerto 3000)
    src/
      *.controller.ts      Controladores HTTP
      *.service.ts         Servicios / lógica de negocio
  web/                     Vista con Next.js (puerto 3001)
    src/
      app/
        layout.tsx         Diseño raíz (Header, Footer)
        page.tsx           Página de inicio
        globals.css        Estilos globales
      components/
        Header.tsx         Componente de encabezado
        Footer.tsx         Componente de pie
        EventCard.tsx      Tarjeta de evento reutilizable
      lib/
        format.ts          Funciones de formato (₡, fechas)
        eventos.ts         Datos de ejemplo + obtenerEventos()
```

### Patrón MVC

- **Modelo:** Datos y reglas de negocio → `apps/api/src` (aún por completar con BD)
- **Vista:** Interfaz de usuario → `apps/web/src/app` y `src/components`
- **Controlador:** Endpoints HTTP → `apps/api/src/*.controller.ts`

### Notas importantes

1. **Datos de ejemplo en desarrollo:** `apps/web/src/lib/eventos.ts` contiene eventos de ejemplo. 
   Si defines `NEXT_PUBLIC_API_URL=http://localhost:3000`, la vista llamará a `GET /eventos` en el API.
   
2. **Rutas disponibles en la vista:**
   - `/` → Página de inicio (evento destacado, categorías, próximos eventos)
   - Próximas: `/eventos`, `/categorias`, `/eventos/:id`, etc.

3. **Rutas disponibles en el API:**
   - `GET /` → Mensaje de bienvenida
   - Próximas: `GET /eventos`, `POST /eventos`, etc.

## Ejecutar en desarrollo

Requiere **Node.js 20.9+** y npm. Abre **dos terminales** de PowerShell desde la raíz:

**Terminal 1 — API de NestJS:**
```powershell
cd apps\api
npm install
npm run start:dev
```
→ http://localhost:3000

**Terminal 2 — Interfaz de Next.js:**
```powershell
cd apps\web
npm install
npm run dev
```
→ http://localhost:3001

## Compilar para producción

```powershell
# API
cd apps\api
npm run build
npm run start:prod

# Web (Next.js)
cd apps\web
npm run build
npm run start
```

## Próximos pasos

1. Implementar modelo de datos en `apps/api/src` (entidades, DTOs, servicios de BD)
2. Agregar rutas de API (`GET /eventos`, `POST /evento`, etc.)
3. Crear páginas adicionales en `apps/web` (listado de eventos, detalle de evento, etc.)
4. Configurar autenticación y autorización
5. Agregar tests (Jest para API, Vitest/Jest para Web)
6. Despliegue (Vercel para Web, Render/Railway/AWS para API)

