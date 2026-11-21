'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { obtenerBoleto } from '@/lib/boletos';
import type { BoletoApi } from '@/lib/boletos';
import { fechaLarga, hora } from '@/lib/format';

export default function DetalleBoleto({ id }: { id: number }) {
  const [boleto, setBoleto] = useState<BoletoApi | null>(null);
  const [error, setError] = useState('');
  const [intento, setIntento] = useState(0);

  useEffect(() => {
    let activo = true;
    obtenerBoleto(id).then(
      (datos) => { if (activo) setBoleto(datos); },
      (err: unknown) => { if (activo) setError(err instanceof Error ? err.message : 'No se pudo cargar el boleto.'); },
    );
    return () => { activo = false; };
  }, [id, intento]);

  return (
    <div className="contenedor boletos-pagina">
      <Link href="/mis-boletos">← Mis boletos</Link>
      {error ? (
        <div role="alert" className="boletos-error">
          {error} <button type="button" className="btn btn-borde" onClick={() => { setError(''); setIntento((i) => i + 1); }}>Intentar de nuevo</button>
        </div>
      ) : !boleto ? <p role="status">Cargando boleto…</p> : (
        <section className="boletos-vacio">
          <h1>{boleto.evento.nombre}</h1>
          <p>{fechaLarga(boleto.evento.fechaHora)} · {hora(boleto.evento.fechaHora)}</p>
          <p>{boleto.evento.lugar}, {boleto.evento.provincia}</p>
          <p>{boleto.descripcion}</p>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={boleto.qr} alt={`Código QR del boleto ${boleto.codigo}`} width={240} height={240} />
          <p>Código: {boleto.codigo}</p>
        </section>
      )}
    </div>
  );
}
