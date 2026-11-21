'use client';

import Link from 'next/link';
import { useState } from 'react';
import type { EventoDetalle, Zona } from '@/lib/evento-detalle';
import { colones } from '@/lib/format';

const FILAS = ['A', 'B', 'C', 'D', 'E'];
const ASIENTOS = [1, 2, 3, 4, 5, 6, 7, 8];
const OCUPADOS = ['A3', 'B6', 'C2', 'D5', 'E7'];
const LIMITE = 6;

export default function SimuladorCompra({ evento, zona, fechaEvento }: { evento: EventoDetalle; zona: Zona; fechaEvento: string }) {
  const [asientos, setAsientos] = useState<string[]>([]);
  const [paso, setPaso] = useState<'asientos' | 'pago' | 'final'>('asientos');
  const [metodo, setMetodo] = useState('tarjeta');
  const [mensaje, setMensaje] = useState('');
  const total = zona.precioFinal * asientos.length;

  function seleccionar(asiento: string) {
    setMensaje('');
    if (asientos.includes(asiento)) {
      setAsientos(asientos.filter((actual) => actual !== asiento));
    } else if (asientos.length < LIMITE) {
      setAsientos([...asientos, asiento]);
    } else {
      setMensaje('Puedes seleccionar hasta 6 asientos.');
    }
  }

  return (
    <div className="contenedor demo-pagina">
      <nav aria-label="Ruta" className="demo-ruta">
        <Link href="/">Inicio</Link> › <Link href={`/eventos/${evento.id}`}>{evento.nombre}</Link> › <strong>Entradas</strong>
      </nav>
      <p className="demo-aviso" role="status">
        Vista de prueba: los asientos son de ejemplo. No se reserva ni se cobra nada y no se emiten boletos.
      </p>
      <h1>{paso === 'asientos' ? 'Elige tus asientos' : paso === 'pago' ? 'Revisa tu compra' : 'Simulación finalizada'}</h1>
      <p className="demo-intro">{evento.nombre} · {fechaEvento} · {zona.nombre}</p>

      {paso === 'final' ? (
        <section className="demo-caja demo-final" aria-labelledby="demo-fin">
          <h2 id="demo-fin">Esto fue una simulación</h2>
          <p>No se realizó ningún pago ni reserva, y no se generaron boletos.</p>
          <Link href={`/eventos/${evento.id}`} className="btn btn-primario">Volver al evento</Link>
        </section>
      ) : (
        <div className="demo-rejilla">
          <section className="demo-caja" aria-labelledby="demo-paso">
            {paso === 'asientos' ? (
              <>
                <h2 id="demo-paso">Mapa de asientos de ejemplo</h2>
                <p>Selecciona hasta 6 asientos en la zona {zona.nombre}.</p>
                <div className="demo-escenario">Escenario</div>
                <div className="demo-mapa" aria-label="Asientos de ejemplo">
                  {FILAS.map((fila) => (
                    <div className="demo-fila" key={fila}>
                      <span className="demo-fila-nombre" aria-hidden="true">{fila}</span>
                      {ASIENTOS.map((numero) => {
                        const asiento = `${fila}${numero}`;
                        const ocupado = OCUPADOS.includes(asiento);
                        const elegido = asientos.includes(asiento);
                        return (
                          <button key={asiento} type="button" disabled={ocupado} aria-pressed={elegido}
                            aria-label={`Fila ${fila}, asiento ${numero}${ocupado ? ', ocupado en el ejemplo' : ''}`}
                            className={`demo-asiento${elegido ? ' demo-asiento-elegido' : ''}`}
                            onClick={() => seleccionar(asiento)}>
                            {numero}
                          </button>
                        );
                      })}
                    </div>
                  ))}
                </div>
                <p className="demo-leyenda">Blanco: disponible · Morado: seleccionado · Gris: ocupado en el ejemplo</p>
                {mensaje && <p className="demo-error" role="alert">{mensaje}</p>}
              </>
            ) : (
              <>
                <h2 id="demo-paso">Método de pago de ejemplo</h2>
                <p>Elige una opción para visualizar el siguiente paso. No solicitamos datos de pago.</p>
                <fieldset className="demo-metodos">
                  <legend className="solo-lector">Método de pago</legend>
                  <label><input type="radio" name="metodo" value="tarjeta" checked={metodo === 'tarjeta'} onChange={(e) => setMetodo(e.target.value)} /> Tarjeta</label>
                  <label><input type="radio" name="metodo" value="sinpe" checked={metodo === 'sinpe'} onChange={(e) => setMetodo(e.target.value)} /> SINPE Móvil</label>
                  <label><input type="radio" name="metodo" value="cuotas" checked={metodo === 'cuotas'} onChange={(e) => setMetodo(e.target.value)} /> Cuotas</label>
                </fieldset>
                <button type="button" className="btn btn-borde" onClick={() => setPaso('asientos')}>Volver a los asientos</button>
              </>
            )}
          </section>

          <aside className="demo-caja demo-resumen" aria-labelledby="demo-resumen">
            <h2 id="demo-resumen">Resumen de ejemplo</h2>
            <p><strong>Zona:</strong> {zona.nombre}</p>
            <p><strong>Asientos:</strong> {asientos.length ? asientos.join(', ') : 'Ninguno seleccionado'}</p>
            <p><strong>Precio por entrada:</strong> {colones(zona.precioFinal)}</p>
            <p className="demo-total">Total: {colones(total)}</p>
            {paso === 'asientos' ? (
              <button type="button" className="btn btn-primario" disabled={!asientos.length} onClick={() => setPaso('pago')}>Continuar al pago</button>
            ) : (
              <button type="button" className="btn btn-primario" onClick={() => setPaso('final')}>Simular pago</button>
            )}
            <p className="demo-nota">Los importes son solo para esta demostración.</p>
          </aside>
        </div>
      )}
    </div>
  );
}
