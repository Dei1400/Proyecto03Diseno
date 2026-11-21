import Link from 'next/link';
import { Suspense } from 'react';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import PanelCompra from '@/components/PanelCompra';
import { obtenerEvento } from '@/lib/evento-detalle';
import { fechaLarga, hora } from '@/lib/format';
import './detalle.css';

type Props = { params: Promise<{ id: string }> };

async function cargar(params: Props['params']) {
  const { id } = await params;
  if (!/^[1-9]\d*$/.test(id)) return null;
  const numero = Number(id);
  return Number.isSafeInteger(numero) ? obtenerEvento(numero) : null;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const evento = await cargar(params);
  return { title: evento ? `${evento.nombre} · QuéPlan` : 'Evento no encontrado · QuéPlan' };
}

async function ContenidoDetalle({ params }: Props) {
  const evento = await cargar(params);
  if (!evento) notFound();

  const mapa = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${evento.lugar}, ${evento.provincia}, Costa Rica`)}`;

  return (
    <div className="contenedor detalle-pagina">
      <nav aria-label="Ruta" className="detalle-ruta">
        <Link href="/">Inicio</Link> › <Link href="/#prox">Próximos eventos</Link> › <strong>{evento.nombre}</strong>
      </nav>
      <div className="detalle-rejilla">
        <div className="detalle-principal">
          {evento.imagen ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={evento.imagen} alt={`Imagen de ${evento.nombre}`} className="detalle-imagen" />
          ) : (
            <div aria-hidden="true" className="detalle-imagen detalle-imagen-vacia">Imagen del evento</div>
          )}
          <p className="detalle-categoria">{evento.categoria}</p>
          <h1>{evento.nombre}</h1>
          <dl className="datos">
            <div><dt>Fecha y hora</dt><dd>{fechaLarga(evento.fechaHora)} · {hora(evento.fechaHora)}</dd></div>
            <div><dt>Lugar</dt><dd>{evento.lugar}, {evento.provincia}</dd></div>
            <div><dt>Clasificación de edad</dt><dd>{evento.clasificacionEdad}</dd></div>
          </dl>
          {!evento.esEjemplo && (
            <section aria-labelledby="acerca">
              <h2 id="acerca">Acerca del evento</h2>
              <p className="texto-largo">{evento.descripcion}</p>
            </section>
          )}
          <section aria-labelledby="ubicacion">
            <h2 id="ubicacion">Ubicación</h2>
            <p>
              {evento.lugar}, {evento.provincia} ·{' '}
              <a href={mapa} target="_blank" rel="noopener noreferrer" className="detalle-enlace">
                Ver en Google Maps<span className="solo-lector"> (se abre en otra pestaña)</span>
              </a>
            </p>
          </section>
          <section aria-labelledby="politicas">
            <h2 id="politicas">Políticas</h2>
            <ul className="politicas">
              <li>Máximo 6 boletos por persona en cada evento.</li>
              <li>Presenta el código QR de tu boleto en la entrada.</li>
              <li>Las reglas de reembolso están en los <Link href="/terminos" className="detalle-enlace">Términos y condiciones</Link>.</li>
            </ul>
          </section>
        </div>
        <PanelCompra key={evento.id} eventoId={evento.id} zonas={evento.zonas} />
      </div>
    </div>
  );
}

export default function DetalleEvento({ params }: Props) {
  return (
    <Suspense fallback={<p className="contenedor" role="status">Cargando evento…</p>}>
      <ContenidoDetalle params={params} />
    </Suspense>
  );
}
