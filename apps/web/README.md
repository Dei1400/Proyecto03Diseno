# Vista con Next.js

Este proyecto contiene la interfaz de la aplicación. La página inicial está en
`src/app/page.tsx`; agrega nuevas rutas mediante carpetas dentro de `src/app`.
Por ejemplo, `src/app/usuarios/page.tsx` corresponde a `/usuarios`.

Desde esta carpeta, instala las dependencias con `npm install` y ejecuta
`npm run dev`. Abre http://localhost:3001. Para compilar y ejecutar en
producción, usa `npm run build` y después `npm run start`.

Consulta el README de la raíz para ver la relación con el API de NestJS y el
patrón MVC.
