import Header from '@/components/Header';
import Footer from '@/components/Footer';
import NoEncontrada from '@/components/NoEncontrada';

export default function NotFound() {
  return (
    <>
      <Header />
      <main id="contenido"><NoEncontrada /></main>
      <Footer />
    </>
  );
}
