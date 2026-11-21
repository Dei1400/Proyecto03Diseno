import type { Metadata } from 'next';
import PaginaLegal from '@/components/PaginaLegal';
import { ACTUALIZADO, TERMINOS } from '@/lib/legal';

export const metadata: Metadata = { title: 'Términos y condiciones · QuéPlan' };

export default function Terminos() {
  return (
    <PaginaLegal
      etiqueta="Información legal"
      titulo="Términos y condiciones"
      intro="Estas son las reglas para usar QuéPlan, comprar entradas y pedir reembolsos."
      actualizado={ACTUALIZADO}
      secciones={TERMINOS}
      otra={{ texto: 'Política de privacidad', href: '/privacidad' }}
    />
  );
}
