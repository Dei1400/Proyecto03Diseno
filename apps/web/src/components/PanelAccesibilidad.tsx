'use client';

import { startTransition, useEffect, useRef, useState } from 'react';
import { EVENTO_ABRIR_ACCESIBILIDAD, IconoAccesibilidad } from './BotonAccesibilidad';

type Tema = 'claro' | 'oscuro' | 'dispositivo';
type TamanoTexto = 'normal' | 'grande' | 'muy-grande';

interface PreferenciasAccesibilidad {
  tema: Tema;
  tamanoTexto: TamanoTexto;
  invertirColores: boolean;
  altoContraste: boolean;
  subrayarEnlaces: boolean;
  reducirMovimiento: boolean;
}

const CLAVE = 'queplan:accesibilidad';
const PREDETERMINADO: PreferenciasAccesibilidad = {
  tema: 'claro',
  tamanoTexto: 'normal',
  invertirColores: false,
  altoContraste: false,
  subrayarEnlaces: false,
  reducirMovimiento: false,
};

function preferenciasValidas(valor: unknown): valor is PreferenciasAccesibilidad {
  if (typeof valor !== 'object' || valor === null) return false;
  const datos = valor as Record<string, unknown>;
  return (datos.tema === 'claro' || datos.tema === 'oscuro' || datos.tema === 'dispositivo')
    && (datos.tamanoTexto === 'normal' || datos.tamanoTexto === 'grande' || datos.tamanoTexto === 'muy-grande')
    && typeof datos.invertirColores === 'boolean'
    && typeof datos.altoContraste === 'boolean'
    && typeof datos.subrayarEnlaces === 'boolean'
    && typeof datos.reducirMovimiento === 'boolean';
}

function aplicarPreferencias(preferencias: PreferenciasAccesibilidad) {
  const raiz = document.documentElement;
  raiz.dataset.accesibilidadTema = preferencias.tema;
  const sistemaOscuro = window.matchMedia('(prefers-color-scheme: dark)').matches;
  raiz.dataset.accesibilidadPaleta = preferencias.tema === 'oscuro'
    || (preferencias.tema === 'dispositivo' && sistemaOscuro) ? 'oscuro' : 'claro';
  raiz.dataset.accesibilidadTexto = preferencias.tamanoTexto;
  raiz.dataset.accesibilidadInvertir = String(preferencias.invertirColores);
  raiz.dataset.accesibilidadContraste = String(preferencias.altoContraste);
  raiz.dataset.accesibilidadEnlaces = String(preferencias.subrayarEnlaces);
  raiz.dataset.accesibilidadMovimiento = String(preferencias.reducirMovimiento);
}

export default function PanelAccesibilidad() {
  const [abierto, setAbierto] = useState(false);
  const [preferencias, setPreferencias] = useState(PREDETERMINADO);
  const [cargado, setCargado] = useState(false);
  const botonFlotante = useRef<HTMLButtonElement>(null);
  const botonCerrar = useRef<HTMLButtonElement>(null);
  const origen = useRef<HTMLElement | null>(null);
  const devolverFoco = useRef(false);

  useEffect(() => {
    let guardadas: PreferenciasAccesibilidad | null = null;
    try {
      const guardado = localStorage.getItem(CLAVE);
      if (guardado) {
        const datos: unknown = JSON.parse(guardado);
        if (preferenciasValidas(datos)) guardadas = datos;
      }
    } catch (error) {
      console.error('No se pudieron cargar las preferencias de accesibilidad.', error);
    }
    startTransition(() => {
      if (guardadas) setPreferencias(guardadas);
      setCargado(true);
    });
  }, []);

  useEffect(() => {
    if (!cargado) return;
    aplicarPreferencias(preferencias);
    try {
      localStorage.setItem(CLAVE, JSON.stringify(preferencias));
    } catch (error) {
      console.error('No se pudieron guardar las preferencias de accesibilidad.', error);
    }
  }, [cargado, preferencias]);

  useEffect(() => {
    if (!cargado || preferencias.tema !== 'dispositivo') return;
    const consulta = window.matchMedia('(prefers-color-scheme: dark)');
    const actualizarTema = () => {
      document.documentElement.dataset.accesibilidadPaleta = consulta.matches ? 'oscuro' : 'claro';
    };
    consulta.addEventListener('change', actualizarTema);
    return () => consulta.removeEventListener('change', actualizarTema);
  }, [cargado, preferencias.tema]);

  useEffect(() => {
    function escuchar(evento: Event) {
      const disparador = (evento as CustomEvent<HTMLElement>).detail;
      origen.current = disparador instanceof HTMLElement ? disparador : botonFlotante.current;
      setAbierto(true);
    }

    window.addEventListener(EVENTO_ABRIR_ACCESIBILIDAD, escuchar);
    return () => window.removeEventListener(EVENTO_ABRIR_ACCESIBILIDAD, escuchar);
  }, []);

  useEffect(() => {
    if (abierto) {
      botonCerrar.current?.focus();
      return;
    }
    if (devolverFoco.current) {
      origen.current?.focus();
      devolverFoco.current = false;
    }
  }, [abierto]);

  useEffect(() => {
    if (!abierto) return;
    function cerrarConEscape(evento: KeyboardEvent) {
      if (evento.key === 'Escape') {
        devolverFoco.current = true;
        setAbierto(false);
      }
    }
    window.addEventListener('keydown', cerrarConEscape);
    return () => window.removeEventListener('keydown', cerrarConEscape);
  }, [abierto]);

  function cerrar() {
    devolverFoco.current = true;
    setAbierto(false);
  }

  function cambiar<K extends keyof PreferenciasAccesibilidad>(
    clave: K,
    valor: PreferenciasAccesibilidad[K],
  ) {
    setPreferencias((actuales) => ({ ...actuales, [clave]: valor }));
  }

  function restablecer() {
    setPreferencias(PREDETERMINADO);
  }

  return (
    <>
      <button
        ref={botonFlotante}
        type="button"
        className="accesibilidad-flotante"
        aria-label="Abrir opciones de accesibilidad"
        aria-haspopup="dialog"
        aria-expanded={abierto}
        onClick={(evento) => {
          origen.current = evento.currentTarget;
          setAbierto(true);
        }}
      >
        <IconoAccesibilidad />
      </button>

      {abierto && (
        <section
          className="panel-accesibilidad"
          role="dialog"
          aria-modal="false"
          aria-labelledby="titulo-accesibilidad"
        >
          <header className="panel-accesibilidad-cabecera">
            <h2 id="titulo-accesibilidad">Accesibilidad</h2>
            <button ref={botonCerrar} type="button" className="accesibilidad-cerrar" onClick={cerrar}>Cerrar</button>
          </header>

          <div className="panel-accesibilidad-contenido">
            <fieldset className="opciones-accesibilidad">
              <legend>Tema</legend>
              <div className="opciones-accesibilidad-botones">
                {([
                  ['claro', 'Claro'],
                  ['oscuro', 'Oscuro'],
                  ['dispositivo', 'Según mi dispositivo'],
                ] as const).map(([valor, texto]) => (
                  <button
                    key={valor}
                    type="button"
                    aria-pressed={preferencias.tema === valor}
                    className={preferencias.tema === valor ? 'opcion-accesibilidad opcion-accesibilidad-activa' : 'opcion-accesibilidad'}
                    onClick={() => cambiar('tema', valor)}
                  >{texto}</button>
                ))}
              </div>
            </fieldset>

            <fieldset className="opciones-accesibilidad">
              <legend>Tamaño del texto</legend>
              <div className="opciones-accesibilidad-botones">
                {([
                  ['normal', 'Normal'],
                  ['grande', 'Grande'],
                  ['muy-grande', 'Muy grande'],
                ] as const).map(([valor, texto]) => (
                  <button
                    key={valor}
                    type="button"
                    aria-pressed={preferencias.tamanoTexto === valor}
                    className={preferencias.tamanoTexto === valor ? 'opcion-accesibilidad opcion-accesibilidad-activa' : 'opcion-accesibilidad'}
                    onClick={() => cambiar('tamanoTexto', valor)}
                  >{texto}</button>
                ))}
              </div>
            </fieldset>

            <label className="alternar-accesibilidad">
              <span>Invertir colores</span>
              <input type="checkbox" checked={preferencias.invertirColores} onChange={(e) => cambiar('invertirColores', e.target.checked)} />
            </label>
            <label className="alternar-accesibilidad">
              <span>Alto contraste</span>
              <input type="checkbox" checked={preferencias.altoContraste} onChange={(e) => cambiar('altoContraste', e.target.checked)} />
            </label>
            <label className="alternar-accesibilidad">
              <span>Subrayar todos los enlaces</span>
              <input type="checkbox" checked={preferencias.subrayarEnlaces} onChange={(e) => cambiar('subrayarEnlaces', e.target.checked)} />
            </label>
            <label className="alternar-accesibilidad">
              <span>Reducir movimiento</span>
              <input type="checkbox" checked={preferencias.reducirMovimiento} onChange={(e) => cambiar('reducirMovimiento', e.target.checked)} />
            </label>

            <button type="button" className="accesibilidad-restablecer" onClick={restablecer}>Restablecer todo</button>
          </div>
        </section>
      )}
    </>
  );
}
