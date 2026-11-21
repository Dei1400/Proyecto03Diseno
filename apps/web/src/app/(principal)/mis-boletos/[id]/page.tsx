import { Suspense } from 'react';
import { notFound } from 'next/navigation';
import DetalleBoleto from '@/components/DetalleBoleto';
import RutaPrivada from '@/components/RutaPrivada';
import '../boletos.css';

async function Contenido({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  if (!/^[1-9]\d*$/.test(id) || !Number.isSafeInteger(Number(id))) notFound();
  return <RutaPrivada><DetalleBoleto id={Number(id)} /></RutaPrivada>;
}

export default function PaginaBoleto({ params }: { params: Promise<{ id: string }> }) {
  return <Suspense fallback={<p className="contenedor" role="status">Cargando boleto…</p>}><Contenido params={params} /></Suspense>;
}
