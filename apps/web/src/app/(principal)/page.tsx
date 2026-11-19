import Link from 'next/link';
import EventCard from '@/components/EventCard';
import { CATEGORIAS } from '@/components/Header';
import { obtenerEventos } from '@/lib/eventos';
import { colones, fecha, hora } from '@/lib/format';

export default async function Inicio() {
  const eventos = await obtenerEventos();
  const destacado = eventos.find((e) => e.destacado) ?? eventos[0];
  const proximos = eventos.filter((e) => e.id !== destacado?.id);

  return (
    <>
      <section className="contenedor hero">
        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          <p style={{ margin: 0, fontWeight: 600, fontSize: 14, color: 'var(--primario)' }}>Entradas en Costa Rica</p>
          <h1>Tu próximo plan empieza aquí</h1>
          <p style={{ margin: 0 }}>
            Elige tus asientos en el mapa, paga y recibe tu boleto con código QR. El precio que ves es el precio final.
          </p>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12 }}>
            <Link href="/buscar" className="btn btn-primario">Ver próximos eventos</Link>
            <Link href="/ayuda" className="btn btn-borde">Cómo comprar</Link>
          </div>
        </div>

        {destacado && (
          <article className="destacado">
            <span className="etiqueta">Evento destacado</span>
            <h2>{destacado.nombre}</h2>
            <p style={{ margin: 0, color: '#fff', maxWidth: 'none' }}>
              {fecha(destacado.fechaHora)} · {hora(destacado.fechaHora)} · {destacado.lugar}, {destacado.provincia}
            </p>
            <p style={{ margin: 0, color: '#fff', fontWeight: 600, fontSize: 18, maxWidth: 'none' }}>
              Desde {colones(destacado.precioDesde)} · precio final con impuestos
            </p>
            <Link href={`/eventos/${destacado.id}`} className="btn" style={{ alignSelf: 'flex-start', background: '#fff', color: 'var(--tinta)', borderColor: '#fff' }}>
              Comprar entradas
            </Link>
          </article>
        )}
      </section>

      <section className="contenedor" aria-labelledby="cat">
        <h2 id="cat" style={{ fontSize: 26, marginBottom: 16 }}>Explora por categoría</h2>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12 }}>
          {CATEGORIAS.map((c) => (
            <Link key={c} href={`/categoria/${encodeURIComponent(c.toLowerCase())}`} className="chip">{c}</Link>
          ))}
        </div>
      </section>

      <section className="contenedor seccion" aria-labelledby="prox">
        <h2 id="prox">Próximos eventos</h2>
        <div className="rejilla">
          {proximos.map((e, i) => <EventCard key={e.id} evento={e} indice={i} />)}
        </div>
      </section>
    </>
  );
}
