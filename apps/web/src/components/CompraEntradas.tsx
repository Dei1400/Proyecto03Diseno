'use client';

import Link from 'next/link';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { ErrorApi } from '@/lib/api';
import { consultarAsientos, crearOrden, liberarAsientos, pagarOrden, retenerAsientos } from '@/lib/compra';
import type { Asiento, OrdenCreada, PagoCompletado } from '@/lib/compra';
import type { EventoDetalle, Zona } from '@/lib/evento-detalle';
import { colones } from '@/lib/format';
import { obtenerSesionGuardada } from '@/lib/sesion';

type Retencion = { ids: number[]; vence: string };
const LIMITE = 6;

function usuarioId(): number {
  const sesion = obtenerSesionGuardada();
  if (!sesion) throw new Error('Debes iniciar sesión para continuar.');
  const datos: unknown = JSON.parse(sesion);
  if (typeof datos !== 'object' || datos === null || !('usuario' in datos)
    || typeof datos.usuario !== 'object' || datos.usuario === null
    || !('id' in datos.usuario) || typeof datos.usuario.id !== 'number') {
    throw new Error('No se pudo leer tu sesión. Inicia sesión de nuevo.');
  }
  return datos.usuario.id;
}

export default function CompraEntradas({ evento, zona, fechaEvento }: { evento: EventoDetalle; zona: Zona; fechaEvento: string }) {
  const [asientos, setAsientos] = useState<Asiento[] | null>(null);
  const [seleccion, setSeleccion] = useState<number[]>([]);
  const [retencion, setRetencion] = useState<Retencion | null>(null);
  const [orden, setOrden] = useState<OrdenCreada | null>(null);
  const [resultado, setResultado] = useState<PagoCompletado | null>(null);
  const [metodo, setMetodo] = useState<'TARJETA' | 'CUOTAS'>('TARJETA');
  const [cuotas, setCuotas] = useState(3);
  const [rechazar, setRechazar] = useState(false);
  const [ahora, setAhora] = useState(() => Date.now());
  const [procesando, setProcesando] = useState(false);
  const [pagoIncierto, setPagoIncierto] = useState(false);
  const [error, setError] = useState('');
  const [intento, setIntento] = useState(0);

  const cargar = useCallback(async () => {
    const zonas = await consultarAsientos(evento.id);
    const encontrada = zonas.find((z) => z.id === zona.id);
    if (!encontrada) throw new Error('Esta zona ya no está disponible.');
    return encontrada.asientos;
  }, [evento.id, zona.id]);

  useEffect(() => {
    let activo = true;
    cargar().then((datos) => {
      if (!activo) return;
      const id = usuarioId();
      const propios = datos.filter((a) => a.estado === 'RETENIDO' && a.retenidoPorId === id && a.retenidoHasta);
      setAsientos(datos);
      if (propios.length) {
        const vence = propios.reduce((min, a) => a.retenidoHasta && a.retenidoHasta < min ? a.retenidoHasta : min, propios[0].retenidoHasta!);
        const ids = propios.map((a) => a.id);
        setSeleccion(ids);
        setRetencion({ ids, vence });
      } else {
        setSeleccion([]);
        setRetencion(null);
      }
    }).catch((err: unknown) => { if (activo) setError(err instanceof Error ? err.message : 'No se pudieron cargar los asientos.'); });
    return () => { activo = false; };
  }, [cargar, intento]);

  useEffect(() => {
    const timer = setInterval(() => setAhora(Date.now()), 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    if (retencion || resultado || procesando) return;
    let activo = true;
    const timer = setInterval(() => {
      cargar().then((datos) => {
        if (!activo) return;
        setAsientos(datos);
        const disponibles = seleccion.filter((id) => datos.some((a) => a.id === id && a.estado === 'DISPONIBLE'));
        if (disponibles.length !== seleccion.length) {
          setSeleccion(disponibles);
          setError('Algunos asientos seleccionados ya no están disponibles. Elige otros.');
        }
      }).catch((err: unknown) => { if (activo) setError(err instanceof Error ? err.message : 'No se pudo actualizar la disponibilidad.'); });
    }, 15000);
    return () => { activo = false; clearInterval(timer); };
  }, [cargar, retencion, resultado, procesando, seleccion]);

  const filas = useMemo(() => {
    const agrupadas = new Map<string, Asiento[]>();
    for (const asiento of asientos ?? []) agrupadas.set(asiento.fila, [...(agrupadas.get(asiento.fila) ?? []), asiento]);
    return [...agrupadas.entries()];
  }, [asientos]);
  const segundos = retencion ? Math.max(0, Math.ceil((new Date(retencion.vence).getTime() - ahora) / 1000)) : 0;
  const vencida = !!retencion && segundos === 0;

  function seleccionar(asiento: Asiento) {
    if (procesando || retencion || asiento.estado !== 'DISPONIBLE') return;
    setError('');
    setSeleccion((actual) => actual.includes(asiento.id) ? actual.filter((id) => id !== asiento.id) : actual.length < LIMITE ? [...actual, asiento.id] : actual);
    if (seleccion.length >= LIMITE && !seleccion.includes(asiento.id)) setError('Puedes seleccionar hasta 6 asientos.');
  }

  async function apartar() {
    setProcesando(true);
    setError('');
    try {
      const reserva = await retenerAsientos(evento.id, seleccion);
      if (!reserva.vencenEn) throw new Error('El servidor no indicó cuándo vence la reserva. Actualiza la disponibilidad.');
      setRetencion({ ids: reserva.asientos.map((a) => a.id), vence: reserva.vencenEn });
      setAhora(Date.now());
    } catch (err) {
      setError(`${err instanceof Error ? err.message : 'No se pudieron apartar los asientos.'} Actualiza la disponibilidad para comprobar su estado.`);
    } finally { setProcesando(false); }
  }

  async function continuar() {
    if (!retencion || vencida) return;
    setProcesando(true);
    setError('');
    try { setOrden(await crearOrden(evento.id, retencion.ids)); }
    catch (err) { setError(err instanceof Error ? err.message : 'No se pudo crear la orden.'); }
    finally { setProcesando(false); }
  }

  async function liberar() {
    if (!retencion) return;
    setProcesando(true);
    setError('');
    try {
      await liberarAsientos(evento.id, retencion.ids);
      setOrden(null);
      setRetencion(null);
      setIntento((i) => i + 1);
    } catch (err) { setError(err instanceof Error ? err.message : 'No se pudieron liberar los asientos.'); }
    finally { setProcesando(false); }
  }

  async function pagar() {
    if (!orden || vencida) return;
    setProcesando(true);
    setError('');
    try { setResultado(await pagarOrden(orden.orden.id, metodo, rechazar, cuotas)); }
    catch (err) {
      if (!(err instanceof ErrorApi) || err.estado >= 500) setPagoIncierto(true);
      setError(err instanceof Error ? err.message : 'No se pudo confirmar el pago.');
    } finally { setProcesando(false); }
  }

  return (
    <div className="contenedor demo-pagina">
      <nav aria-label="Ruta" className="demo-ruta">
        <Link href="/">Inicio</Link> › <Link href={`/eventos/${evento.id}`}>{evento.nombre}</Link> › <strong>Entradas</strong>
      </nav>
      <h1>{resultado ? 'Compra registrada' : orden ? 'Revisa tu compra' : 'Elige tus asientos'}</h1>
      <p className="demo-intro">{evento.nombre} · {fechaEvento} · {zona.nombre}</p>
      {resultado ? (
        <section className="demo-caja demo-final">
          <h2>Pago simulado aprobado</h2>
          <p>No se cobró dinero real. La orden #{resultado.orden.id} y {resultado.boletos} boleto(s) se registraron en el sistema.</p>
          {resultado.pago.cuotas && <p>{resultado.pago.cuotas.cantidad} cuotas de {colones(resultado.pago.cuotas.montoPorCuota)}.</p>}
          <Link href="/mis-boletos" className="btn btn-primario">Ver mis boletos</Link>
        </section>
      ) : (
        <div className="demo-rejilla">
          <section className="demo-caja">
            {orden ? (
              <>
                <h2>Pago simulado</h2>
                <p>No se cobra dinero real. No ingreses datos de tarjetas reales: selecciona un resultado de prueba.</p>
                <fieldset className="demo-metodos">
                  <legend>Método de pago</legend>
                  <label><input type="radio" name="metodo" checked={metodo === 'TARJETA'} onChange={() => setMetodo('TARJETA')} /> Tarjeta</label>
                  <label><input type="radio" name="metodo" checked={metodo === 'CUOTAS'} onChange={() => setMetodo('CUOTAS')} /> Cuotas</label>
                </fieldset>
                {metodo === 'CUOTAS' && <label>Cuotas: <select value={cuotas} onChange={(e) => setCuotas(Number(e.target.value))}><option value={3}>3</option><option value={6}>6</option><option value={12}>12</option></select></label>}
                <fieldset className="demo-metodos">
                  <legend>Resultado de prueba</legend>
                  <label><input type="radio" name="resultado" checked={!rechazar} onChange={() => setRechazar(false)} /> Aprobar</label>
                  <label><input type="radio" name="resultado" checked={rechazar} onChange={() => setRechazar(true)} /> Rechazar</label>
                </fieldset>
              </>
            ) : (
              <>
                <h2>Mapa de asientos</h2>
                <p>Selecciona hasta 6 asientos disponibles. La disponibilidad se actualiza cada 15 segundos.</p>
                <div className="demo-escenario">Escenario</div>
                {!asientos ? <p role="status">Cargando asientos…</p> : filas.length === 0 ? <p>No hay asientos en esta zona.</p> : (
                  <div className="demo-mapa" aria-label="Asientos">
                    {filas.map(([fila, lista]) => (
                      <div className="demo-fila" key={fila}>
                        <span className="demo-fila-nombre" aria-hidden="true">{fila}</span>
                        {lista.map((asiento) => {
                          const elegido = seleccion.includes(asiento.id);
                          return <button key={asiento.id} type="button" disabled={procesando || !!retencion || asiento.estado !== 'DISPONIBLE'} aria-pressed={elegido} aria-label={`Fila ${fila}, asiento ${asiento.numero}, ${elegido ? 'seleccionado' : asiento.estado.toLowerCase()}`} className={`demo-asiento${elegido ? ' demo-asiento-elegido' : ''}`} onClick={() => seleccionar(asiento)}>{asiento.numero}</button>;
                        })}
                      </div>
                    ))}
                  </div>
                )}
                {!retencion && <button type="button" className="btn btn-borde" disabled={procesando} onClick={() => { setError(''); setAsientos(null); setIntento((i) => i + 1); }}>Actualizar disponibilidad</button>}
              </>
            )}
            {error && <p className="demo-error" role="alert">{error}</p>}
            {pagoIncierto && <p role="alert">No se pudo confirmar el resultado. Revisa <Link href="/mis-compras">Mis compras</Link> antes de intentar nuevamente.</p>}
          </section>
          <aside className="demo-caja demo-resumen">
            <h2>Resumen</h2>
            <p><strong>Zona:</strong> {zona.nombre}</p>
            <p><strong>Asientos:</strong> {asientos?.filter((a) => seleccion.includes(a.id)).map((a) => `${a.fila}${a.numero}`).join(', ') || 'Ninguno seleccionado'}</p>
            {retencion && <p role="status">{vencida ? 'La reserva venció.' : `Reserva vigente: ${Math.floor(segundos / 60)}:${String(segundos % 60).padStart(2, '0')}`}</p>}
            {orden ? (
              <dl className="demo-desglose">
                <dt>Subtotal</dt><dd>{colones(orden.desglose.subtotal)}</dd>
                <dt>IVA</dt><dd>{colones(orden.desglose.iva)}</dd>
                <dt>Impuesto de espectáculos</dt><dd>{colones(orden.desglose.impuestoEspectaculos)}</dd>
                <dt>Impuesto municipal</dt><dd>{colones(orden.desglose.impuestoMunicipal)}</dd>
                <dt>Cargo por servicio</dt><dd>{colones(orden.desglose.cargoServicio)}</dd>
                <dt>Total</dt><dd>{colones(orden.desglose.total)}</dd>
              </dl>
            ) : <p className="demo-total">Total: {colones(zona.precioFinal * seleccion.length)}</p>}
            {!retencion ? <button type="button" className="btn btn-primario" disabled={!seleccion.length || procesando} onClick={apartar}>Apartar asientos</button> : !orden ? <button type="button" className="btn btn-primario" disabled={vencida || procesando} onClick={continuar}>Continuar al pago</button> : <button type="button" className="btn btn-primario" disabled={vencida || procesando || pagoIncierto} onClick={pagar}>Confirmar pago simulado</button>}
            {retencion && !pagoIncierto && <button type="button" className="btn btn-borde" disabled={procesando} onClick={liberar}>Liberar asientos</button>}
            {vencida && <button type="button" className="btn btn-borde" onClick={() => { setOrden(null); setError(''); setIntento((i) => i + 1); }}>Elegir de nuevo</button>}
          </aside>
        </div>
      )}
    </div>
  );
}
