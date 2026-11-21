import Link from 'next/link';

export default function NoEncontrada() {
  return (
    <div className="contenedor no-encontrada">
      <p className="no-encontrada-codigo">Error 404</p>
      <h1>No encontramos esta página</h1>
      <p>Puede que el enlace esté mal escrito o que el evento ya no esté disponible.</p>
      <Link href="/" className="btn btn-primario">Volver al inicio</Link>
    </div>
  );
}
