import type { Metadata } from 'next';
import RutaPrivada from '@/components/RutaPrivada';
import HistorialCompras from '@/components/HistorialCompras';
import '../mis-boletos/boletos.css';

export const metadata: Metadata = { title: 'Mis compras · QuéPlan' };

export default function MisCompras() {
  return (
    <RutaPrivada>
      <div className="contenedor" style={{ paddingTop: 40 }}>
        <h1>Mis compras</h1>
        <HistorialCompras />
      </div>
    </RutaPrivada>
  );
}
