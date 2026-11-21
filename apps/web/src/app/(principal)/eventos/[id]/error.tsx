'use client';

import { useEffect } from 'react';

export default function ErrorDetalle({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => {
    console.error('No se pudo cargar el detalle del evento.', error);
  }, [error]);

  return (
    <div className="contenedor detalle-pagina" role="alert">
      <h1>No pudimos cargar el evento</h1>
      <p>Inténtalo de nuevo más tarde.</p>
      <button type="button" className="btn btn-borde" onClick={reset}>Intentar de nuevo</button>
    </div>
  );
}
