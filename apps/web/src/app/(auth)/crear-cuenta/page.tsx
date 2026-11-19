'use client';

import Link from 'next/link';
import { useState } from 'react';

export default function CrearCuenta() {
  const [nombre, setNombre] = useState('');
  const [email, setEmail] = useState('');
  const [contrasena, setContrasena] = useState('');
  const [confirmar, setConfirmar] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Crear cuenta:', { nombre, email, contrasena, confirmar });
  };

  return (
    <section className="contenedor" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: 'calc(100vh - 300px)', paddingTop: 60, paddingBottom: 60 }}>
      <div style={{ width: '100%', maxWidth: 400 }}>
        <div style={{ marginBottom: 40 }}>
          <h1 style={{ fontSize: 32, marginBottom: 12, textAlign: 'center' }}>Crear cuenta</h1>
          <p style={{ fontSize: 14, color: '#666', textAlign: 'center', margin: 0 }}>
            Únete a QuéPlan y comienza a comprar entradas
          </p>
        </div>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            <label htmlFor="nombre" style={{ fontWeight: 600, fontSize: 14 }}>Nombre completo</label>
            <input
              id="nombre"
              type="text"
              required
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
              placeholder="Tu nombre"
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
              placeholder="Mínimo 8 caracteres"
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
            <label htmlFor="confirmar" style={{ fontWeight: 600, fontSize: 14 }}>Confirmar contraseña</label>
            <input
              id="confirmar"
              type="password"
              required
              value={confirmar}
              onChange={(e) => setConfirmar(e.target.value)}
              placeholder="Repite tu contraseña"
              style={{
                padding: '12px 16px',
                borderRadius: 8,
                border: '1px solid var(--borde)',
                fontSize: 14,
                fontFamily: 'var(--fuente-texto)',
              }}
            />
          </div>

          <button type="submit" className="btn btn-primario" style={{ width: '100%', marginTop: 12 }}>
            Crear cuenta
          </button>
        </form>

        <div style={{ marginTop: 32, textAlign: 'center', borderTop: '1px solid var(--borde)', paddingTop: 24 }}>
          <p style={{ margin: 0, fontSize: 14 }}>
            ¿Ya tienes cuenta?{' '}
            <Link href="/(auth)/iniciar-sesion" style={{ color: 'var(--primario)', fontWeight: 600, textDecoration: 'none' }}>
              Iniciar sesión
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
