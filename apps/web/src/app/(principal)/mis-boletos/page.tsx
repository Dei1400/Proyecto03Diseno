import type { Metadata } from 'next';
import ListaBoletos from '@/components/ListaBoletos';
import RutaPrivada from '@/components/RutaPrivada';
import './boletos.css';

export const metadata: Metadata = { title: 'Mis boletos · QuéPlan' };

export default function MisBoletos() {
  return (
    <RutaPrivada>
      <div className="contenedor boletos-pagina">
        <h1>Mis boletos</h1>
        <ListaBoletos />
      </div>
    </RutaPrivada>
  );
}
