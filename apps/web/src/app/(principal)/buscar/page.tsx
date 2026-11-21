import Link from 'next/link';
import { Suspense } from 'react';
import type { Metadata } from 'next';
import EventCard from '@/components/EventCard';
import FiltrosEventos from '@/components/FiltrosEventos';
import OrdenSelect from '@/components/OrdenSelect';
import { CATEGORIAS, ORDENES, PROVINCIAS } from '@/lib/catalogo';
import type { Orden } from '@/lib/catalogo';
import { obtenerEventos, ordenar } from '@/lib/eventos';
import type { EventoResumen, Filtros } from '@/lib/eventos';
import './buscar.css';

export const metadata: Metadata = { title: 'Búsqueda de eventos · QuéPlan' };

type Params = Record<string, string | string[] | undefined>;
const uno = (v: string | string[] | undefined) => (Array.isArray(v) ? v[0] : v) ?? '';

function fechaValida(fecha: string): boolean {
  return /^\d{4}-\d{2}-\d{2}$/.test(fecha)
    && !Number.isNaN(Date.parse(`${fecha}T00:00:00Z`))
    && new Date(`${fecha}T00:00:00Z`).toISOString().slice(0, 10) === fecha;
}

function leerFiltros(p: Params): { filtros: Filtros; orden: Orden } {
  const fecha = uno(p.fecha);
  const fechaHasta = uno(p.fechaHasta);
  return {
    filtros: {
      q: uno(p.q).trim().slice(0, 80) || undefined,
      categoria: CATEGORIAS.find((c) => c === uno(p.categoria)),
      provincia: PROVINCIAS.find((provincia) => provincia === uno(p.provincia)),
      fecha: fechaValida(fecha) ? fecha : undefined,
      fechaHasta: fechaValida(fechaHasta) ? fechaHasta : undefined,
    },
    orden: ORDENES.find((o) => o.valor === uno(p.orden))?.valor ?? 'fecha',
  };
}

async function Resultados({ searchParams }: { searchParams: Promise<Params> }) {
  const { filtros, orden } = leerFiltros(await searchParams);
  if (!filtros.q) {
    return (
      <>
        <h1>Búsqueda de eventos</h1>
        <p>Escribe un evento, artista o lugar en el buscador del encabezado.</p>
        <Link href="/#prox" className="btn btn-borde">Ver próximos eventos</Link>
      </>
    );
  }
  const errorRango = !!(filtros.fecha && filtros.fechaHasta && filtros.fecha > filtros.fechaHasta);
  let eventos: EventoResumen[] = [];
  if (!errorRango) {
    try {
      eventos = ordenar(await obtenerEventos(filtros), orden);
    } catch (error) {
      console.error('No se pudieron cargar los resultados de búsqueda.', error);
      return <p role="alert">{filtros.categoria === 'Humor' ? 'La categoría Humor aún no está disponible en el API.' : 'No pudimos cargar los eventos. Inténtalo de nuevo más tarde.'}</p>;
    }
  }
  const cantidad = eventos.length;
  const titulo = `Resultados para “${filtros.q}”`;

  return (
    <>
      <nav aria-label="Ruta" className="ruta">
        <Link href="/">Inicio</Link> › <strong>Búsqueda</strong>
      </nav>
      <h1>{titulo}</h1>
      <p className="buscar-intro">Todos los precios son finales, con impuestos incluidos.</p>
      <div className="buscar-rejilla">
        <FiltrosEventos filtros={filtros} orden={orden} errorRango={errorRango} />
        {errorRango ? (
          <p role="alert" className="filtros-error">La fecha final debe ser igual o posterior a la fecha inicial.</p>
        ) : (
        <section aria-labelledby="resultados">
          <div className="resultados-barra">
            <h2 id="resultados" role="status">
              {cantidad} {cantidad === 1 ? 'evento encontrado' : 'eventos encontrados'}
            </h2>
            <Suspense fallback={null}><OrdenSelect valor={orden} /></Suspense>
          </div>
          {cantidad > 0 ? (
            <ul className="resultados-lista">
              {eventos.map((e, i) => <li key={e.id}><EventCard evento={e} indice={i} /></li>)}
            </ul>
          ) : (
            <div className="sin-resultados">
              <h3>No encontramos eventos con esos datos</h3>
              <p>Prueba con otra palabra, cambia los filtros o mira todos los próximos eventos.</p>
              <Link href="/#prox" className="btn btn-primario">Ver todos los eventos</Link>
            </div>
          )}
        </section>
        )}
      </div>
    </>
  );
}

export default function Buscar({ searchParams }: { searchParams: Promise<Params> }) {
  return (
    <div className="contenedor buscar-pagina">
      <Suspense fallback={<p role="status">Cargando eventos…</p>}>
        <Resultados searchParams={searchParams} />
      </Suspense>
    </div>
  );
}
