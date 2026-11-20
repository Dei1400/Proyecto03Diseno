import type { Metadata } from 'next';
import ListaBoletos from '@/components/ListaBoletos';
import RutaPrivada from '@/components/RutaPrivada';
import './boletos.css';

export const metadata: Metadata = { title: 'Mis boletos · QuéPlan' };

export default function MisBoletos() {
    //return (
    //<RutaPrivada>
     // <div className="contenedor boletos-pagina">
       // <h1>Mis boletos</h1>
      //  <ListaBoletos />
      //</div>
    //</RutaPrivada>
  const vistaPrevia = process.env.NODE_ENV === 'development';
  const contenido = (
    <div className="contenedor boletos-pagina">
      <h1>Mis boletos</h1>
      {vistaPrevia && <p className="boletos-resumen">Vista previa: los boletos mostrados son de ejemplo.</p>}
      <ListaBoletos vistaPrevia={vistaPrevia} />
    </div>
  );

  return vistaPrevia ? contenido : <RutaPrivada>{contenido}</RutaPrivada>;
}
