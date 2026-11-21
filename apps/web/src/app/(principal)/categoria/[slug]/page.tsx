import { Suspense } from 'react';
import { notFound, redirect } from 'next/navigation';
import { CATEGORIAS, limpiarTexto } from '@/lib/catalogo';

async function RedirigirCategoria({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const categoria = CATEGORIAS.find((c) => limpiarTexto(c) === limpiarTexto(slug));
  if (!categoria) notFound();
  return redirect(`/?categoria=${encodeURIComponent(categoria)}#prox`);
}

export default function Categoria({ params }: { params: Promise<{ slug: string }> }) {
  return (
    <Suspense fallback={<p className="contenedor" role="status">Cargando categoría…</p>}>
      <RedirigirCategoria params={params} />
    </Suspense>
  );
}
