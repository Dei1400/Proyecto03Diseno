'use client';

import Link from 'next/link';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { api } from '@/lib/api';
import { guardarSesion, type Usuario } from '@/lib/sesion';

export default function IniciarSesion() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [contrasena, setContrasena] = useState('');
  const [error, setError] = useState('');
  const [cargando, setCargando] = useState(false);

  // Envía el correo y la contraseña al API y guarda la sesión (token)
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setCargando(true);
        try {
      const { token, usuario } = await api<{ token: string; usuario: Usuario }>(
        '/auth/login',
        { metodo: 'POST', cuerpo: { correo: email.trim(), contrasena } },
      );
      guardarSesion(token, usuario);
      setContrasena(''); // no deja la contraseña escrita en la pantalla
      router.push('/');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'No pudimos iniciar sesión.');
    } finally {
      setCargando(false); // el botón vuelve a la normalidad, salga bien o mal
    }
  };

  return (
    <section className="contenedor" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: 'calc(100vh - 300px)', paddingTop: 60, paddingBottom: 60 }}>
      <div style={{ width: '100%', maxWidth: 400 }}>
        <div style={{ marginBottom: 40 }}>
          <h1 style={{ fontSize: 32, marginBottom: 12, textAlign: 'center' }}>Iniciar sesión</h1>
          <p style={{ fontSize: 14, color: '#666', textAlign: 'center', margin: 0 }}>
            Accede a tu cuenta para comprar entradas
          </p>
        </div>

        {error && (
          <p role="alert" className="alerta-error" style={{ marginBottom: 16 }}>
            <span aria-hidden="true">⚠</span> {error}
          </p>
        )}

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            <label htmlFor="email" style={{ fontWeight: 600, fontSize: 14 }}>Correo electrónico</label>
            <input
              id="email"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="tu@correo.com"
              style={{
                padding: '12px 16px',
                borderRadius: 8,
                border: '1px solid var(--borde)',
                fontSize: 14,
                fontFamily: 'var(--fuente-texto)',
              }}
            />
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            <label htmlFor="contrasena" style={{ fontWeight: 600, fontSize: 14 }}>Contraseña</label>
            <input
              id="contrasena"
              type="password"
              required
              value={contrasena}
              onChange={(e) => setContrasena(e.target.value)}
              placeholder="••••••••"
              style={{
                padding: '12px 16px',
                borderRadius: 8,
                border: '1px solid var(--borde)',
                fontSize: 14,
                fontFamily: 'var(--fuente-texto)',
              }}
            />
          </div>

          <button type="submit" className="btn btn-primario" disabled={cargando} style={{ width: '100%', marginTop: 12 }}>
            {cargando ? 'Entrando…' : 'Iniciar sesión'}
          </button>
        </form>

        <div style={{ marginTop: 32, textAlign: 'center', borderTop: '1px solid var(--borde)', paddingTop: 24 }}>
          <p style={{ margin: 0, fontSize: 14 }}>
            ¿No tienes cuenta?{' '}
            <Link href="/crear-cuenta" style={{ color: 'var(--primario)', fontWeight: 600, textDecoration: 'none' }}>
              Registrarse
            </Link>
          </p>
        </div>

        <div style={{ marginTop: 24, textAlign: 'center' }}>
          <Link href="/" style={{ color: 'var(--primario)', fontWeight: 500, textDecoration: 'none', fontSize: 14 }}>
            ← Volver al inicio
          </Link>
        </div>
      </div>
    </section>
  );
}