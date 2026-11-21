import Link from 'next/link';
import type { Seccion } from '@/lib/legal';
import './paginaLegal.css';

interface Props {
  etiqueta: string;
  titulo: string;
  intro: string;
  actualizado: string;
  secciones: Seccion[];
  otra: { texto: string; href: string };
}

export default function PaginaLegal({ etiqueta, titulo, intro, actualizado, secciones, otra }: Props) {
  return (
    <div className="contenedor legal-pagina">
      <p className="legal-etiqueta">{etiqueta}</p>
      <h1>{titulo}</h1>
      <p className="legal-intro">{intro}</p>
      <p className="legal-fecha">Última actualización: {actualizado}</p>
      <div className="legal-rejilla">
        <nav aria-label="Contenido de esta página" className="legal-indice">
          <p>CONTENIDO</p>
          <ol>
            {secciones.map((s, i) => (
              <li key={s.id}><a href={`#${s.id}`}>{i + 1}. {s.titulo}</a></li>
            ))}
          </ol>
        </nav>

        <article className="legal-contenido">
          {secciones.map((s, i) => (
            <section key={s.id} id={s.id} aria-labelledby={`h-${s.id}`}>
              <h2 id={`h-${s.id}`}>{i + 1}. {s.titulo}</h2>
              {s.parrafos?.map((p) => <p key={p}>{p}</p>)}
              {s.lista && <ul>{s.lista.map((item) => <li key={item}>{item}</li>)}</ul>}
              {s.enlace && <p><Link href={s.enlace.href} className="legal-enlace">{s.enlace.texto}</Link></p>}
            </section>
          ))}
          <p className="legal-otra">
            También puedes leer: <Link href={otra.href} className="legal-enlace">{otra.texto}</Link>
          </p>
        </article>
      </div>
    </div>
  );
}
