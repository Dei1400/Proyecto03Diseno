import Header from '@/components/Header';
import Footer from '@/components/Footer';
import PanelAccesibilidad from '@/components/PanelAccesibilidad';

export default function LayoutPrincipal({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Header />
      <main id="contenido">{children}</main>
      <Footer />
      <PanelAccesibilidad />
    </>
  );
}
