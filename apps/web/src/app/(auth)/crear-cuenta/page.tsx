import { Suspense } from 'react';
import type { Metadata } from 'next';
import FormularioRegistro from '@/components/FormularioRegistro';

export const metadata: Metadata = { title: 'Crear cuenta · QuéPlan' };

export default function CrearCuenta() {
  return (
    <div className="contenedor auth-pagina">
      <section className="auth-caja" aria-labelledby="titulo-registro" style={{ maxWidth: 520 }}>
        <h1 id="titulo-registro">Crear cuenta</h1>
        <p className="auth-intro">Con tu cuenta compras entradas y guardas tus boletos en un solo lugar.</p>
        <Suspense fallback={null}>
          <FormularioRegistro />
        </Suspense>
      </section>
    </div>
  );
}
