'use client';

import { useMemo, useSyncExternalStore } from 'react';
import { obtenerSesionGuardada, suscribirSesion } from '@/lib/sesion';
import type { Usuario } from '@/lib/sesion';

function leerUsuario(sesion: string | null | undefined): Usuario | null {
  if (!sesion) return null;
  try {
    const datos: unknown = JSON.parse(sesion);
    if (typeof datos !== 'object' || datos === null || !('usuario' in datos)) return null;
    const usuario = datos.usuario;
    if (typeof usuario !== 'object' || usuario === null) return null;
    if (!('id' in usuario) || typeof usuario.id !== 'number'
      || !('nombre' in usuario) || typeof usuario.nombre !== 'string'
      || !('correo' in usuario) || typeof usuario.correo !== 'string'
      || !('cedula' in usuario) || typeof usuario.cedula !== 'string'
      || !('telefono' in usuario) || typeof usuario.telefono !== 'string'
      || !('rol' in usuario) || (usuario.rol !== 'COMPRADOR' && usuario.rol !== 'PRODUCTORA')) return null;
    return {
      id: usuario.id, nombre: usuario.nombre, correo: usuario.correo,
      cedula: usuario.cedula, telefono: usuario.telefono, rol: usuario.rol,
    };
  } catch (error) {
    console.error('No se pudieron leer los datos de la cuenta.', error);
    return null;
  }
}

export default function PerfilCuenta() {
  const sesion = useSyncExternalStore<string | null | undefined>(suscribirSesion, obtenerSesionGuardada, () => undefined);
  const usuario = useMemo(() => leerUsuario(sesion), [sesion]);

  return (
    <div className="contenedor cuenta-pagina">
      <h1>Mi cuenta</h1>
      <p className="cuenta-intro">Consulta tus datos personales.</p>
      {sesion === undefined ? <p role="status">Cargando tus datos…</p> : !usuario ? (
        <p role="alert" className="cuenta-error">No se pudieron leer los datos de tu cuenta. Cierra sesión e inicia de nuevo.</p>
      ) : (
        <section className="cuenta-caja" aria-labelledby="datos-personales">
          <h2 id="datos-personales">Datos personales</h2>
          <dl className="cuenta-datos">
            <div><dt>Nombre completo</dt><dd>{usuario.nombre}</dd></div>
            <div><dt>Correo electrónico</dt><dd>{usuario.correo}</dd></div>
            <div><dt>Cédula</dt><dd>{usuario.cedula}</dd></div>
            <div><dt>Teléfono</dt><dd>{usuario.telefono}</dd></div>
          </dl>
          <button type="button" className="btn btn-primario" disabled>Editar perfil</button>
          <p>La edición del perfil no está disponible en el API actualmente.</p>
        </section>
      )}
    </div>
  );
}
