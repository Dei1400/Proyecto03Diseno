import Link from 'next/link';
import { Suspense } from 'react';
import EventCard from '@/components/EventCard';
import HeroDestacado from '@/components/HeroDestacado';
import { CATEGORIAS } from '@/lib/catalogo';
import { obtenerEventos } from '@/lib/eventos';

type Params = { categoria?: string | string[] };

async function ContenidoInicio({ searchParams }: { searchParams: Promise<Params> }) {
  const params = await searchParams;
  const valor = Array.isArray(params.categoria) ? params.categoria[0] : params.categoria;
  const categoria = CATEGORIAS.find((c) => c === valor);
  const eventos = await obtenerEventos({ categoria });
  const destacado = eventos.find((e) => e.destacado) ?? eventos[0];

  return (
    <>
      <section className="contenedor hero">
        <div className="hero-intro">
          <p style={{ margin: 0, fontWeight: 600, fontSize: 14, color: 'var(--primario)' }}>Entradas en Costa Rica</p>
          <h1>Tu próximo plan empieza aquí</h1>
          <p style={{ margin: 0 }}>
            Elige tus asientos en el mapa, paga y recibe tu boleto con código QR. El precio que ves es el precio final.
          </p>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12 }}>
            <Link href="#prox" className="btn btn-primario">Ver próximos eventos</Link>
            <Link href="/ayuda" className="btn btn-borde">Cómo comprar</Link>
          </div>
        </div>

        {destacado && <HeroDestacado evento={destacado} />}
      </section>

      <section className="contenedor seccion" aria-labelledby="prox">
        <h2 id="prox">{categoria ? `Próximos eventos: ${categoria}` : 'Próximos eventos'}</h2>
        {categoria && <Link href="/#prox" className="btn btn-borde" style={{ marginBottom: 16 }}>Mostrar todos los eventos</Link>}
        {eventos.length > 0 ? (
          <div className="rejilla">
            {eventos.map((e, i) => <EventCard key={e.id} evento={e} indice={i} />)}
          </div>
        ) : <p role="status">No hay eventos disponibles para esta categoría.</p>}
      </section>
    </>
  );
}

export default function Inicio({ searchParams }: { searchParams: Promise<Params> }) {
  return (
    <Suspense fallback={<p className="contenedor" role="status">Cargando eventos…</p>}>
      <ContenidoInicio searchParams={searchParams} />
    </Suspense>
  );
}
