'use client';

import Link from 'next/link';

export default function HeaderAuth() {
  return (
    <header className="encabezado">
      <div className="contenedor encabezado-fila" style={{ justifyContent: 'space-between' }}>
        <Link href="/" className="logo" aria-label="QuéPlan, volver al inicio">Qué<span>Plan</span></Link>
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <span style={{ fontSize: 14, fontWeight: 500 }}>¿Primera vez en QuéPlan?</span>
          <Link href="/(auth)/crear-cuenta" className="btn btn-borde">Registrarse</Link>
        </div>
      </div>
    </header>
  );
}
