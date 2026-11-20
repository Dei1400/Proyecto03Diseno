import Link from 'next/link';
import type { Metadata } from 'next';
import { INDICE, PASOS, SECCIONES } from '@/lib/ayuda';
import './ayuda.css';

export const metadata: Metadata = {
  title: 'Ayuda: cómo comprar · QuéPlan',
  description: 'Aprende a comprar tus entradas en cinco pasos y resuelve tus dudas sobre pagos, boletos y reembolsos.',
};

export default function Ayuda() {
  return (
    <div className="contenedor ayuda-pagina">
      <p className="ayuda-etiqueta">Centro de ayuda</p>
      <h1>Cómo comprar tus entradas</h1>
      <p className="ayuda-intro">
        Comprar en QuéPlan toma cinco pasos. Aquí te explicamos cada uno y respondemos las dudas más comunes.
      </p>

      <div className="ayuda-rejilla">
        <nav aria-label="En esta página" className="ayuda-indice">
          <p>EN ESTA PÁGINA</p>
          {INDICE.map((i) => <a key={i.id} href={`#${i.id}`}>{i.texto}</a>)}
        </nav>

        <div className="ayuda-contenido">
          <section id="pasos" aria-labelledby="h-pasos">
            <h2 id="h-pasos">Compra en 5 pasos</h2>
            <ol className="pasos">
              {PASOS.map((p, i) => (
                <li key={p.titulo} className="paso">
                  <span className="paso-numero" aria-hidden="true">{i + 1}</span>
                  <div>
                    <h3><span className="solo-lector">Paso {i + 1}: </span>{p.titulo}</h3>
                    <p>{p.texto}</p>
                  </div>
                </li>
              ))}
            </ol>
          </section>

          {SECCIONES.map((s) => (
            <section key={s.id} id={s.id} aria-labelledby={`h-${s.id}`} className="ayuda-seccion">
              <h2 id={`h-${s.id}`}>{s.titulo}</h2>
              {s.preguntas.map((q) => (
                <details key={q.pregunta} className="faq">
                  <summary>{q.pregunta}</summary>
                  <p>
                    {q.respuesta}
                    {q.enlace && <> <Link href={q.enlace.href} className="ayuda-enlace">{q.enlace.texto}</Link></>}
                  </p>
                </details>
              ))}
            </section>
          ))}

          <section id="contacto" aria-labelledby="h-contacto" className="ayuda-contacto">
            <div>
              <h2 id="h-contacto">¿Necesitas más ayuda?</h2>
              <p>Escríbenos y te respondemos lo antes posible.</p>
            </div>
            <Link href="/contacto" className="btn ayuda-contacto-btn">Ir a Contacto</Link>
          </section>
        </div>
      </div>
    </div>
  );
}
