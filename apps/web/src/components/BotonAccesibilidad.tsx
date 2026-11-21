'use client';

import type { MouseEvent } from 'react';

export const EVENTO_ABRIR_ACCESIBILIDAD = 'queplan:abrir-accesibilidad';

export default function BotonAccesibilidad() {
  function abrir(evento: MouseEvent<HTMLButtonElement>) {
    window.dispatchEvent(new CustomEvent(EVENTO_ABRIR_ACCESIBILIDAD, { detail: evento.currentTarget }));
  }

  return (
    <button type="button" className="accesibilidad-encabezado" onClick={abrir}>
      <IconoAccesibilidad />
      <span>Accesibilidad</span>
    </button>
  );
}

export function IconoAccesibilidad() {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" fill="none">
      <circle cx="12" cy="4.5" r="2" />
      <path d="M4.5 8.5c2.4 1.1 4.9 1.6 7.5 1.6s5.1-.5 7.5-1.6M12 10v4m0 0-4 5m4-5 4 5m-4-5 4-2" />
    </svg>
  );
}
