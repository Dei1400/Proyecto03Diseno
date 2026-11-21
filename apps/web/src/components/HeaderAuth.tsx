'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import BotonAccesibilidad from '@/components/BotonAccesibilidad';

export default function HeaderAuth() {
  const esRegistro = usePathname() === '/crear-cuenta';

  return (
    <header className="encabezado">
      <div className="contenedor encabezado-fila" style={{ justifyContent: 'space-between' }}>
        <Link href="/" className="logo" aria-label="QuéPlan, volver al inicio">Qué<span>Plan</span></Link>
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <BotonAccesibilidad />
          <span style={{ fontSize: 14, fontWeight: 500 }}>
            {esRegistro ? '¿Ya tienes una cuenta?' : '¿Primera vez en QuéPlan?'}
          </span>
          <Link href={esRegistro ? '/iniciar-sesion' : '/crear-cuenta'} className="btn btn-borde">
            {esRegistro ? 'Iniciar sesión' : 'Registrarse'}
          </Link>
        </div>
      </div>
    </header>
  );
}
