'use client';

import Link from 'next/link';
import { useEffect, useMemo, useState } from 'react';
import TarjetaBoleto from '@/components/TarjetaBoleto';
import { agruparPorEvento, obtenerBoletos } from '@/lib/boletos';
import type { BoletoApi } from '@/lib/boletos';
import { fechaLarga } from '@/lib/format';

type Pestana = 'proximos' | 'pasados';

export default function ListaBoletos() {
  const [boletos, setBoletos] = useState<BoletoApi[] | null>(null);
  const [error, setError] = useState('');
  const [pestana, setPestana] = useState<Pestana>('proximos');
  const [intento, setIntento] = useState(0);

  useEffect(() => {
    let activo = true;
    obtenerBoletos().then(
      (datos) => { if (activo) setBoletos(datos); },
      (err: unknown) => { if (activo) setError(err instanceof Error ? err.message : 'No pudimos cargar tus boletos.'); },
    );
    return () => { activo = false; };
  }, [intento]);

  const grupos = useMemo(() => boletos ? agruparPorEvento(boletos) : [], [boletos]);
  const proximos = grupos.filter((g) => !g.pasado);
  const pasados = grupos.filter((g) => g.pasado);
  const visibles = pestana === 'proximos' ? proximos : pasados;
  const total = boletos?.length ?? 0;

  if (error) {
    return (
      <div role="alert" className="boletos-error">
        <span aria-hidden="true">⚠</span> {error}{' '}
        <button type="button" className="btn btn-borde" onClick={() => { setError(''); setIntento((i) => i + 1); }} style={{ marginLeft: 8 }}>
          Intentar de nuevo
        </button>
      </div>
    );
  }
  if (!boletos) return <p role="status" className="estado-carga">Cargando tus boletos…</p>;

  if (total === 0) {
    return (
      <div className="boletos-vacio">
        <h2>Todavía no tienes boletos</h2>
        <p>Cuando compres entradas, aparecerán aquí con su código QR.</p>
        <Link href="/" className="btn btn-primario">Ver próximos eventos</Link>
      </div>
    );
  }

  return (
    <>
      <p className="boletos-resumen">
        {total} {total === 1 ? 'boleto' : 'boletos'} para {grupos.length} {grupos.length === 1 ? 'evento' : 'eventos'}.
        Muestra el código QR en la entrada.
      </p>
      <div role="group" aria-label="Filtrar boletos" className="pestanas">
        <button type="button" className="pestana" aria-pressed={pestana === 'proximos'} onClick={() => setPestana('proximos')}>
          Próximos ({proximos.length})
        </button>
        <button type="button" className="pestana" aria-pressed={pestana === 'pasados'} onClick={() => setPestana('pasados')}>
          Pasados ({pasados.length})
        </button>
      </div>
      {visibles.length === 0 && (
        <p className="boletos-resumen" role="status">
          {pestana === 'proximos' ? 'No tienes boletos para eventos próximos.' : 'Aún no tienes boletos de eventos pasados.'}
        </p>
      )}
      {visibles.map(({ evento, boletos: lista, pasado }) => (
        <section key={evento.id} aria-labelledby={`evento-${evento.id}`} className="grupo-evento">
          <div className="grupo-cabecera">
            <div aria-hidden="true" className="grupo-miniatura" />
            <div className="grupo-texto">
              <h2 id={`evento-${evento.id}`}>{evento.nombre}</h2>
              <p>{fechaLarga(evento.fechaHora)} · {evento.lugar}, {evento.provincia}</p>
            </div>
            <span className="grupo-cantidad">{lista.length} {lista.length === 1 ? 'boleto' : 'boletos'}</span>
          </div>
          <ul className="grupo-lista">
            {lista.map((b) => <TarjetaBoleto key={b.id} boleto={b} nombreEvento={evento.nombre} pasado={pasado} />)}
          </ul>
        </section>
      ))}
    </>
  );
}
