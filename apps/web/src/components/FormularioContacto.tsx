'use client';

import { FormEvent, useState } from 'react';
import { ASUNTOS } from '@/lib/contacto';

const CORREO_VALIDO = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const MAX = 1000;
type Campo = 'nombre' | 'correo' | 'asunto' | 'mensaje';
type Errores = Partial<Record<Campo, string>>;
const ORDEN: Campo[] = ['nombre', 'correo', 'asunto', 'mensaje'];

export default function FormularioContacto() {
  const [valores, setValores] = useState({ nombre: '', correo: '', asunto: '', mensaje: '' });
  const [errores, setErrores] = useState<Errores>({});
  const [errorEnvio, setErrorEnvio] = useState(false);

  const cambiar = (campo: Campo) => (e: { target: { value: string } }) =>
    setValores((v) => ({ ...v, [campo]: e.target.value }));

  function validar(): Errores {
    const e: Errores = {};
    if (valores.nombre.trim().length < 3) e.nombre = 'Escribe tu nombre.';
    if (!valores.correo.trim()) e.correo = 'Escribe tu correo electrónico.';
    else if (!CORREO_VALIDO.test(valores.correo.trim())) e.correo = 'Escribe un correo válido, por ejemplo nombre@correo.com.';
    if (!valores.asunto) e.asunto = 'Elige un asunto.';
    if (valores.mensaje.trim().length < 10) e.mensaje = 'Cuéntanos tu consulta con al menos 10 caracteres.';
    return e;
  }

  function enviar(ev: FormEvent) {
    ev.preventDefault();
    setErrorEnvio(false);
    const nuevos = validar();
    setErrores(nuevos);
    const primero = ORDEN.find((c) => nuevos[c]);
    if (primero) return document.getElementById(primero)?.focus();

    setErrorEnvio(true);
  }

  const error = (campo: Campo) => errores[campo] && (
    <p id={`${campo}-error`} className="cto-error"><span aria-hidden="true">⚠</span> {errores[campo]}</p>
  );
  const describe = (campo: Campo) => (errores[campo] ? `${campo}-error` : undefined);

  return (
    <form onSubmit={enviar} noValidate className="cto-form" aria-labelledby="titulo-form">
      <h2 id="titulo-form">Envíanos tu consulta</h2>
      <p className="cto-pista">El envío de consultas aún no está disponible.</p>
      {errorEnvio && <p role="alert" className="cto-error">No se envió tu consulta porque el servicio de contacto aún no está disponible.</p>}

      <div className="cto-campo">
        <label htmlFor="nombre">Nombre</label>
        <input id="nombre" value={valores.nombre} onChange={cambiar('nombre')} autoComplete="name" aria-invalid={!!errores.nombre} aria-describedby={describe('nombre')} />
        {error('nombre')}
      </div>

      <div className="cto-campo">
        <label htmlFor="correo">Correo electrónico</label>
        <input id="correo" type="email" inputMode="email" value={valores.correo} onChange={cambiar('correo')} autoComplete="email" aria-invalid={!!errores.correo} aria-describedby={describe('correo')} />
        {error('correo')}
      </div>

      <div className="cto-campo">
        <label htmlFor="asunto">Asunto</label>
        <select id="asunto" value={valores.asunto} onChange={cambiar('asunto')} aria-invalid={!!errores.asunto} aria-describedby={describe('asunto')}>
          <option value="">Elige un asunto</option>
          {ASUNTOS.map((a) => <option key={a} value={a}>{a}</option>)}
        </select>
        {error('asunto')}
      </div>

      <div className="cto-campo">
        <label htmlFor="mensaje">Mensaje</label>
        <textarea id="mensaje" rows={6} maxLength={MAX} value={valores.mensaje} onChange={cambiar('mensaje')} aria-invalid={!!errores.mensaje} aria-describedby={`mensaje-pista${errores.mensaje ? ' mensaje-error' : ''}`} />
        <p id="mensaje-pista" className="cto-pista">{valores.mensaje.length} de {MAX} caracteres</p>
        {error('mensaje')}
      </div>

      <button type="submit" className="btn btn-primario">Enviar consulta</button>
    </form>
  );
}
