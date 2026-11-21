import type { Metadata } from 'next';
import RutaPrivada from '@/components/RutaPrivada';

export const metadata: Metadata = { title: 'Mis compras · QuéPlan' };

export default function MisCompras() {
  return (
    <RutaPrivada>
      <div className="contenedor" style={{ paddingTop: 40 }}>
        <h1>Mis compras</h1>
        <p>El historial de compras aún no está disponible.</p>
      </div>
    </RutaPrivada>
  );
}
