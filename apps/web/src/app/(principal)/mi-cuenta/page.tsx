import type { Metadata } from 'next';
import PerfilCuenta from '@/components/PerfilCuenta';
import RutaPrivada from '@/components/RutaPrivada';
import './cuenta.css';

export const metadata: Metadata = { title: 'Mi cuenta · QuéPlan' };

export default function MiCuenta() {
  return <RutaPrivada><PerfilCuenta /></RutaPrivada>;
}
