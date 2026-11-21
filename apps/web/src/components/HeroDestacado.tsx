import Link from 'next/link';
import type { EventoResumen } from '@/lib/eventos';
import { colones, fechaLarga, hora } from '@/lib/format';
import './heroDestacado.css';

function Icono({ children }: { children: React.ReactNode }) {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
      {children}
    </svg>
  );
}

export default function HeroDestacado({ evento }: { evento: EventoResumen }) {
  return (
    <article className="destacado" aria-labelledby="destacado-titulo">
      {evento.imagen ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={evento.imagen} alt="" className="destacado-imagen" />
      ) : (
        <div className="destacado-imagen destacado-imagen-vacia" aria-hidden="true">Imagen del evento</div>
      )}

      <div className="destacado-cuerpo">
        <div>
          <p className="destacado-categoria">{evento.categoria}</p>
          <h2 id="destacado-titulo">{evento.nombre}</h2>
        </div>

        <ul className="destacado-datos">
          <li>
            <Icono><rect x="3" y="5" width="18" height="16" rx="2" /><path d="M3 10h18M8 3v4M16 3v4" /></Icono>
            <span>{fechaLarga(evento.fechaHora)} · {hora(evento.fechaHora)}</span>
          </li>
          <li>
            <Icono><path d="M12 21s7-6.2 7-12a7 7 0 1 0-14 0c0 5.8 7 12 7 12z" /><circle cx="12" cy="9" r="2.5" /></Icono>
            <span>{evento.lugar}, {evento.provincia}</span>
          </li>
        </ul>

        <div className="destacado-compra">
          <div>
            {evento.precioDesde === null ? (
              <span>Precio no disponible</span>
            ) : (
              <>
                <span>Desde</span>
                <strong>{colones(evento.precioDesde)}</strong>
                <small>precio final con impuestos</small>
              </>
            )}
          </div>
          <Link href={`/eventos/${evento.id}`} className="btn destacado-boton" aria-label={`Comprar entradas de ${evento.nombre}`}>
            Comprar entradas
          </Link>
        </div>
      </div>
    </article>
  );
}
