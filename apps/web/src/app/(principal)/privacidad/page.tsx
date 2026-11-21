import type { Metadata } from 'next';
import PaginaLegal from '@/components/PaginaLegal';
import { ACTUALIZADO, PRIVACIDAD } from '@/lib/legal';

export const metadata: Metadata = { title: 'Política de privacidad · QuéPlan' };

export default function Privacidad() {
  return (
    <PaginaLegal
      etiqueta="Información legal"
      titulo="Política de privacidad"
      intro="Te explicamos qué datos personales usamos, para qué y cuáles son tus derechos."
      actualizado={ACTUALIZADO}
      secciones={PRIVACIDAD}
      otra={{ texto: 'Términos y condiciones', href: '/terminos' }}
    />
  );
}
