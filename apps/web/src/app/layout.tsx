import type { Metadata } from 'next';
import { Inter, Space_Grotesk } from 'next/font/google';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import './globals.css';

const titulo = Space_Grotesk({ subsets: ['latin'], weight: ['500', '700'], variable: '--fuente-titulo' });
const texto = Inter({ subsets: ['latin'], weight: ['400', '600'], variable: '--fuente-texto' });

export const metadata: Metadata = {
  title: 'QuéPlan · Entradas para conciertos y espectáculos en Costa Rica',
  description: 'Elige tus asientos, paga y recibe tu boleto con código QR.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es" className={`${titulo.variable} ${texto.variable}`}>
      <body>
        <a href="#contenido" className="saltar">Saltar al contenido</a>
        <Header />
        <main id="contenido">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
