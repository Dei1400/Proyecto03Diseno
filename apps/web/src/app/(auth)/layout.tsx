import { Suspense } from 'react';
import HeaderAuth from '@/components/HeaderAuth';
import Footer from '@/components/Footer';
import './formularios.css';

export default function LayoutAuth({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Suspense fallback={<header className="encabezado" />}>
        <HeaderAuth />
      </Suspense>
      <main id="contenido">{children}</main>
      <Footer />
    </>
  );
}
