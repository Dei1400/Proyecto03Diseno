'use client';

import Link from 'next/link';
import { useState } from 'react';
import { colones } from '@/lib/format';
import type { Zona } from '@/lib/evento-detalle';

export default function PanelCompra({ eventoId, zonas }: { eventoId: number; zonas: Zona[] }) {
  const [zonaId, setZonaId] = useState<number | undefined>(zonas[0]?.id);
  const zona = zonas.find((z) => z.id === zonaId);

  return (
    <aside aria-labelledby="titulo-entradas" className="panel-compra">
      <h2 id="titulo-entradas">Entradas</h2>
      <p className="panel-nota">Los precios incluyen impuestos y cargos.</p>
      {zonas.length === 0 && <p role="status">No hay zonas disponibles para este evento.</p>}
      <fieldset className="zonas">
        <legend className="solo-lector">Elige una zona</legend>
        {zonas.map((z) => (
          <label key={z.id} className={`zona${z.id === zonaId ? ' zona-sel' : ''}`}>
            <input type="radio" name="zona" value={z.id} checked={z.id === zonaId} onChange={() => setZonaId(z.id)} />
            <span className="zona-texto">
              <strong>{z.nombre}</strong>
              <span>Disponibilidad por confirmar</span>
            </span>
            <span className="zona-precio">
              <strong>{colones(z.precioFinal)}</strong>
              <span>precio final</span>
            </span>
          </label>
        ))}
      </fieldset>
      {zona && (
        <details className="desglose">
          <summary>Ver desglose del precio ({zona.nombre})</summary>
          <dl>
            <dt>Precio base</dt><dd>{colones(zona.desglose.subtotal)}</dd>
            <dt>IVA 13 %</dt><dd>{colones(zona.desglose.iva)}</dd>
            <dt>Espectáculos públicos 6 %</dt><dd>{colones(zona.desglose.impuestoEspectaculos)}</dd>
            <dt>Municipal 5 %</dt><dd>{colones(zona.desglose.impuestoMunicipal)}</dd>
            <dt>Cargo por servicio</dt><dd>{colones(zona.desglose.cargoServicio)}</dd>
            <dt className="total">Total por boleto</dt><dd className="total">{colones(zona.desglose.total)}</dd>
          </dl>
        </details>
      )}
      {zona ? (
        <Link href={`/eventos/${eventoId}/entradas?zona=${zona.id}`} className="btn btn-primario btn-grande">Comprar entradas</Link>
      ) : (
        <button type="button" className="btn btn-primario btn-grande" disabled>Comprar entradas</button>
      )}
      <p className="panel-pie">Vista de prueba: no se realizan reservas ni pagos reales.</p>
    </aside>
  );
}
