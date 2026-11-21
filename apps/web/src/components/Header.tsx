import Link from 'next/link';
import { CATEGORIAS } from '@/lib/catalogo';

export { CATEGORIAS } from '@/lib/catalogo';

export default function Header() {
  return (
    <header className="encabezado">
      <div className="contenedor encabezado-fila">
        <Link href="/" className="logo" aria-label="QuéPlan, inicio">Qué<span>Plan</span></Link>
        <form role="search" action="/buscar" className="buscador">
          <label htmlFor="q" className="solo-lector">Buscar eventos, artistas o lugares</label>
          <input id="q" name="q" type="search" placeholder="Busca un evento, artista o lugar" />
          <button type="submit" className="btn btn-primario">Buscar</button>
        </form>
        <Link href="/mis-boletos" className="chip" style={{ border: 0 }}>Mis boletos</Link>
        <Link href="/iniciar-sesion" className="btn btn-borde">Iniciar sesión</Link>
      </div>
      <nav aria-label="Categorías" className="contenedor categorias">
        {CATEGORIAS.map((c) => (
          <Link key={c} href={`/?categoria=${encodeURIComponent(c)}#prox`} className="chip">{c}</Link>
        ))}
      </nav>
    </header>
  );
}
