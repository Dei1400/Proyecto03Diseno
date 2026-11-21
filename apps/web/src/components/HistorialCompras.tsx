'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { api } from '@/lib/api';
import { colones, fechaLarga, hora } from '@/lib/format';

interface Orden {
  id: number;
  estado: 'PENDIENTE' | 'PAGADA' | 'CANCELADA';
  total: number;
  creadaEn: string;
  evento: { id: number; nombre: string; fechaHora: string; lugar: string };
  _count: { boletos: number };
}

const ESTADOS: Record<Orden['estado'], string> = {
  PENDIENTE: 'Pendiente',
  PAGADA: 'Pagada',
  CANCELADA: 'Cancelada',
};

export default function HistorialCompras() {
  const [ordenes, setOrdenes] = useState<Orden[] | null>(null);
  const [error, setError] = useState('');
  const [intento, setIntento] = useState(0);

  useEffect(() => {
    let activo = true;
    api<Orden[]>('/ordenes', { metodo: 'GET', autenticado: true }).then(
      (datos) => { if (activo) setOrdenes(datos); },
      (err: unknown) => { if (activo) setError(err instanceof Error ? err.message : 'No se pudo cargar el historial.'); },
    );
    return () => { activo = false; };
  }, [intento]);

  if (error) return <div role="alert">{error} <button type="button" className="btn btn-borde" onClick={() => { setError(''); setIntento((i) => i + 1); }}>Intentar de nuevo</button></div>;
  if (!ordenes) return <p role="status">Cargando tus compras…</p>;
  if (!ordenes.length) return <p>Todavía no tienes órdenes. <Link href="/">Ver eventos</Link></p>;

  return (
    <ul className="grupo-lista">
      {ordenes.map((orden) => (
        <li className="tarjeta-boleto" key={orden.id}>
          <div className="boleto-info">
            <h2>{orden.evento.nombre}</h2>
            <span>Orden #{orden.id} · {ESTADOS[orden.estado]}</span>
            <span>{fechaLarga(orden.evento.fechaHora)} · {hora(orden.evento.fechaHora)} · {orden.evento.lugar}</span>
            <span>Creada el {fechaLarga(orden.creadaEn)} · {colones(orden.total)}</span>
            {orden.estado === 'PAGADA' && <Link href="/mis-boletos" className="btn btn-borde">Ver mis boletos ({orden._count.boletos})</Link>}
            {orden.estado === 'PENDIENTE' && <span>La reserva de asientos vence; vuelve al evento para seleccionar asientos si ya expiró.</span>}
          </div>
        </li>
      ))}
    </ul>
  );
}
