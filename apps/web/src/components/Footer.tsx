import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="pie">
      <div className="contenedor pie-fila">
        <span>© 2026 QuéPlan · Costa Rica</span>
        <nav aria-label="Información">
          <Link href="/ayuda">Ayuda</Link>
          <Link href="/contacto">Contacto</Link>
          <Link href="/terminos">Términos y condiciones</Link>
          <Link href="/privacidad">Política de privacidad</Link>
        </nav>
      </div>
    </footer>
  );
}
