import { Suspense } from 'react';
import HeaderAuth from '@/components/HeaderAuth';
import Footer from '@/components/Footer';
import PanelAccesibilidad from '@/components/PanelAccesibilidad';
import './formularios.css';

export default function LayoutAuth({ children }: { children: React.ReactNode }) {
  return (
    <>
      <div className="contenido-sitio">
        <Suspense fallback={<header className="encabezado" />}>
          <HeaderAuth />
        </Suspense>
        <main id="contenido">{children}</main>
        <Footer />
      </div>
      <PanelAccesibilidad />
    </>
  );
}
