'use client';

import { useEffect } from 'react';

export default function ErrorPrincipal({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => { console.error('No se pudo cargar la página.', error); }, [error]);
  return (
    <div className="contenedor seccion" role="alert">
      <h1>No pudimos cargar los datos</h1>
      <p>Comprueba que el servidor esté disponible e inténtalo de nuevo.</p>
      <button type="button" className="btn btn-borde" onClick={reset}>Intentar de nuevo</button>
    </div>
  );
}
