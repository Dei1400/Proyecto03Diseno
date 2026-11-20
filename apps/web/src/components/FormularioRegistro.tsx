'use client';

import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { FormEvent, useRef, useState } from 'react';
import CampoTexto from '@/components/CampoTexto';
import { api, ErrorApi } from '@/lib/api';
import { guardarSesion, Usuario } from '@/lib/sesion';

const CORREO_VALIDO = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

type Campos = 'nombre' | 'correo' | 'cedula' | 'telefono' | 'contrasena' | 'terminos';
type Errores = Partial<Record<Campos, string>>;
const ORDEN: Campos[] = ['nombre', 'correo', 'cedula', 'telefono', 'contrasena', 'terminos'];

function destinoSeguro(volver: string | null): string {
  return volver && volver.startsWith('/') && !volver.startsWith('//') ? volver : '/';
}

function formatearCedula(valor: string): string {
  const digitos = valor.replace(/\D/g, '');
  if (digitos.length === 9) return `${digitos[0]}-${digitos.slice(1, 5)}-${digitos.slice(5)}`;
  if (digitos.length === 10) return `${digitos[0]}-${digitos.slice(1, 4)}-${digitos.slice(4)}`;
  return digitos;
}

function validar(v: { nombre: string; correo: string; cedula: string; telefono: string; contrasena: string; terminos: boolean }): Errores {
  const e: Errores = {};
  if (v.nombre.trim().length < 3) e.nombre = 'Escribe tu nombre completo.';

  if (!v.correo.trim()) e.correo = 'Escribe tu correo electrónico.';
  else if (!CORREO_VALIDO.test(v.correo.trim())) e.correo = 'Escribe un correo válido, por ejemplo nombre@correo.com.';

  const cedula = v.cedula.replace(/\D/g, '');
  if (!cedula) e.cedula = 'Escribe tu número de cédula.';
  else if (cedula.length < 9 || cedula.length > 12) e.cedula = 'La cédula debe tener entre 9 y 12 números.';

  const tel = v.telefono.replace(/\D/g, '').replace(/^506/, '');
  if (!tel) e.telefono = 'Escribe tu número de teléfono.';
  else if (tel.length !== 8) e.telefono = 'El teléfono debe tener 8 números, por ejemplo 8888 8888.';

  if (!v.contrasena) e.contrasena = 'Crea una contraseña.';
  else if (v.contrasena.length < 8 || !/[A-Za-z]/.test(v.contrasena) || !/\d/.test(v.contrasena))
    e.contrasena = 'Usa al menos 8 caracteres, con letras y números.';

  if (!v.terminos) e.terminos = 'Debes aceptar los términos y la política de privacidad para continuar.';
  return e;
}

export default function FormularioRegistro() {
  const router = useRouter();
  const volver = useSearchParams().get('volver');

  const [nombre, setNombre] = useState('');
  const [correo, setCorreo] = useState('');
  const [cedula, setCedula] = useState('');
  const [telefono, setTelefono] = useState('');
  const [contrasena, setContrasena] = useState('');
  const [terminos, setTerminos] = useState(false);
  const [errores, setErrores] = useState<Errores>({});
  const [errorGeneral, setErrorGeneral] = useState('');
  const [cargando, setCargando] = useState(false);
  const refAlerta = useRef<HTMLDivElement>(null);

  async function enviar(ev: FormEvent) {
    ev.preventDefault();
    setErrorGeneral('');

    const nuevos = validar({ nombre, correo, cedula, telefono, contrasena, terminos });
    setErrores(nuevos);
    const primero = ORDEN.find((c) => nuevos[c]);
    if (primero) return document.getElementById(primero)?.focus();

    setCargando(true);
    try {
      const { token, usuario } = await api<{ token: string; usuario: Usuario }>('/auth/registro', {
        metodo: 'POST',
        cuerpo: {
          nombre: nombre.trim(),
          correo: correo.trim(),
          cedula: formatearCedula(cedula),
          telefono: telefono.replace(/\D/g, '').replace(/^506/, ''),
          contrasena,
        },
      });
      guardarSesion(token, usuario);
      router.push(destinoSeguro(volver));
    } catch (err) {
      const mensaje = err instanceof Error ? err.message : 'Ocurrió un error inesperado.';
      if (err instanceof ErrorApi && err.estado === 409) {
        // correo repetido (RF-05)
        setErrores({ correo: 'Ya existe una cuenta con este correo. Prueba iniciando sesión.' });
        document.getElementById('correo')?.focus();
      } else {
        setErrorGeneral(mensaje);
        setTimeout(() => refAlerta.current?.focus(), 0);
      }
      setCargando(false);
    }
  }

  const cantidad = Object.values(errores).filter(Boolean).length;
  const sufijo = volver ? `?volver=${encodeURIComponent(volver)}` : '';

  return (
    <form onSubmit={enviar} noValidate className="auth-form">
      {errorGeneral && (
        <div ref={refAlerta} role="alert" tabIndex={-1} className="alerta-error">
          <span aria-hidden="true">⚠</span> {errorGeneral}
        </div>
      )}
      {cantidad > 1 && (
        <p role="alert" className="alerta-error" style={{ margin: 0 }}>
          <span aria-hidden="true">⚠</span> Revisa los {cantidad} campos marcados.
        </p>
      )}

      <CampoTexto id="nombre" etiqueta="Nombre completo" valor={nombre} onCambio={setNombre} error={errores.nombre} autoComplete="name" />
      <CampoTexto id="correo" etiqueta="Correo electrónico" tipo="email" valor={correo} onCambio={setCorreo} error={errores.correo} autoComplete="email" inputMode="email" />

      <div className="fila-doble">
        <CampoTexto id="cedula" etiqueta="Cédula" valor={cedula} onCambio={setCedula} error={errores.cedula} pista="Solo números" inputMode="numeric" maxLength={14} />
        <CampoTexto id="telefono" etiqueta="Teléfono" tipo="tel" valor={telefono} onCambio={setTelefono} error={errores.telefono} pista="8 números" autoComplete="tel" inputMode="tel" maxLength={14} />
      </div>

      <CampoTexto id="contrasena" etiqueta="Contraseña" tipo="password" valor={contrasena} onCambio={setContrasena} error={errores.contrasena} pista="Mínimo 8 caracteres, con letras y números" autoComplete="new-password" />

      <div className="campo">
        <label className="casilla" htmlFor="terminos">
          <input
            id="terminos" type="checkbox" checked={terminos} onChange={(e) => setTerminos(e.target.checked)}
            aria-invalid={!!errores.terminos} aria-describedby={errores.terminos ? 'terminos-error' : undefined}
          />
          <span>
            Acepto los <Link href="/terminos" target="_blank" rel="noopener" className="enlace">términos y condiciones</Link> y la{' '}
            <Link href="/privacidad" target="_blank" rel="noopener" className="enlace">política de privacidad</Link>
            <span className="solo-lector"> (se abren en otra pestaña)</span>
          </span>
        </label>
        {errores.terminos && <p id="terminos-error" className="error-texto"><span aria-hidden="true">⚠</span> {errores.terminos}</p>}
      </div>

      <button type="submit" className="btn btn-primario" disabled={cargando} aria-busy={cargando}>
        {cargando ? 'Creando cuenta…' : 'Crear cuenta'}
      </button>

      <p className="auth-pie">
        ¿Ya tienes cuenta? <Link href={`/iniciar-sesion${sufijo}`} className="enlace">Iniciar sesión</Link>
      </p>
    </form>
  );
}
