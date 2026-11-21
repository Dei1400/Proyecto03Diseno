import Link from 'next/link';
import { EventoResumen } from '@/lib/eventos';
import { colones, fecha } from '@/lib/format';

const COLORES = [
  { fondo: 'var(--verde)', texto: '#fff' },
  { fondo: 'var(--acento)', texto: 'var(--tinta)' },
  { fondo: 'var(--tinta)', texto: '#fff' },
  { fondo: 'var(--violeta)', texto: '#fff' },
];

export default function EventCard({ evento, indice }: { evento: EventoResumen; indice: number }) {
  const color = COLORES[indice % COLORES.length];
  return (
    <article className="tarjeta">
      <div className="tarjeta-imagen" aria-hidden="true" style={{ background: color.fondo, color: color.texto }}>
        Imagen del evento
      </div>
      <div className="tarjeta-cuerpo">
        <span style={{ font: '600 13px var(--fuente-texto)', color: 'var(--primario)' }}>{evento.categoria}</span>
        <h3 style={{ fontSize: 20 }}>{evento.nombre}</h3>
        <p style={{ margin: 0, fontSize: 14, color: 'var(--tinta-suave)' }}>
          {fecha(evento.fechaHora)} · {evento.provincia}
        </p>
        <p style={{ margin: '8px 0 14px', fontWeight: 600 }}>
          {evento.precioDesde === null ? 'Precio no disponible' : <>Desde {colones(evento.precioDesde)} <span style={{ fontWeight: 400, color: 'var(--tinta-suave)' }}>precio final</span></>}
        </p>
        <Link href={`/eventos/${evento.id}`} className="btn btn-borde" aria-label={`Ver entradas de ${evento.nombre}`}>
          Ver entradas
        </Link>
      </div>
    </article>
  );
}
