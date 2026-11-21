'use client';

import Link from 'next/link';
import { useSyncExternalStore } from 'react';
import { cerrarSesion, obtenerToken, suscribirSesion } from '@/lib/sesion';

export default function AccionesSesion() {
  const token = useSyncExternalStore<string | null | undefined>(suscribirSesion, obtenerToken, () => undefined);

  function salir() {
    cerrarSesion();
    window.location.replace('/');
  }

  return (
    <div className="encabezado-cuenta">
      {token ? (
        <details className="menu-perfil">
          <summary className="boton-perfil">
            <svg aria-hidden="true" viewBox="0 0 24 24" fill="none">
              <circle cx="12" cy="8" r="3.5" />
              <path d="M5.5 20a6.5 6.5 0 0 1 13 0" />
            </svg>
            <span>Mi perfil</span>
          </summary>
          <nav className="menu-perfil-opciones" aria-label="Opciones de perfil">
            <Link href="/mi-cuenta">Mi cuenta</Link>
            <Link href="/mis-compras">Mis compras</Link>
            <Link href="/mis-boletos">Mis boletos</Link>
            <button type="button" onClick={salir}>Cerrar sesión</button>
          </nav>
        </details>
      ) : token === null ? (
        <Link href="/iniciar-sesion" className="btn btn-borde">Iniciar sesión</Link>
      ) : null}
    </div>
  );
}
