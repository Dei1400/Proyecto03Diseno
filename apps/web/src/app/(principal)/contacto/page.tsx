import Link from 'next/link';
import type { Metadata } from 'next';
import FormularioContacto from '@/components/FormularioContacto';
import './contacto.css';

export const metadata: Metadata = { title: 'Contacto · QuéPlan' };

export default function Contacto() {
  return (
    <div className="contenedor cto-pagina">
      <p className="cto-etiqueta">Estamos para ayudarte</p>
      <h1>Contacto</h1>
      <p className="cto-intro">
        Quizá encuentres tu respuesta en la{' '}
        <Link href="/ayuda" className="cto-enlace">página de ayuda</Link>.
      </p>

      <div className="cto-rejilla">
        <section aria-labelledby="medios" className="cto-medios">
          <h2 id="medios" className="solo-lector">Otros medios de contacto</h2>
          <div className="cto-tarjeta">
            <h3>Correo electrónico</h3>
            <a href="mailto:queplan@gmail.com" className="cto-enlace">queplan@gmail.com</a>
          </div>
          <div className="cto-tarjeta">
            <h3>Teléfono</h3>
            <a href="tel:+50688881111" className="cto-enlace">+506 8888 1111</a>
          </div>
        </section>

        <div className="cto-formulario"><FormularioContacto /></div>
      </div>
    </div>
  );
}
