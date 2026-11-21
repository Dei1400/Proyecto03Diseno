import Link from 'next/link';
import { Suspense } from 'react';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import CompraEntradas from '@/components/CompraEntradas';
import RutaPrivada from '@/components/RutaPrivada';
import { obtenerEvento } from '@/lib/evento-detalle';
import { fechaLarga, hora } from '@/lib/format';
import './entradas.css';

export const metadata: Metadata = { title: 'Selección de entradas · QuéPlan' };

type Props = {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ zona?: string | string[] }>;
};

async function ContenidoEntradas({ params, searchParams }: Props) {
  const { id } = await params;
  if (!/^[1-9]\d*$/.test(id) || !Number.isSafeInteger(Number(id))) notFound();
  const evento = await obtenerEvento(Number(id));
  if (!evento) notFound();

  const { zona: zonaParam } = await searchParams;
  const zonaId = Array.isArray(zonaParam) ? zonaParam[0] : zonaParam;
  const zona = evento.zonas.find((z) => String(z.id) === zonaId);
  if (!zona) {
    return (
      <div className="contenedor demo-pagina">
        <h1>Selecciona una zona</h1>
        <p>La zona indicada no está disponible. Regresa al evento para elegir una.</p>
        <Link href={`/eventos/${evento.id}`} className="btn btn-borde">Volver al evento</Link>
      </div>
    );
  }

  return <RutaPrivada><CompraEntradas evento={evento} zona={zona} fechaEvento={`${fechaLarga(evento.fechaHora)} · ${hora(evento.fechaHora)}`} /></RutaPrivada>;
}

export default function Entradas(props: Props) {
  return (
    <Suspense fallback={<p className="contenedor" role="status">Cargando entradas…</p>}>
      <ContenidoEntradas {...props} />
    </Suspense>
  );
}
