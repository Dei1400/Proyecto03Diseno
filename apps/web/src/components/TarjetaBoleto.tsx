import Link from 'next/link';
import type { BoletoVista } from '@/lib/boletos';

interface Props { boleto: BoletoVista; nombreEvento: string; pasado: boolean; vistaPrevia?: boolean }

export default function TarjetaBoleto({ boleto, nombreEvento, pasado, vistaPrevia = false }: Props) {
  return (
    <li className="tarjeta-boleto">
      {boleto.qr ? (
        <img src={boleto.qr} alt="" className="qr-mini" />
      ) : (
        <div className="qr-mini qr-vacio" aria-hidden="true">QR</div>
      )}
      <div className="boleto-info">
        <span className={pasado ? 'insignia insignia-gris' : 'insignia insignia-ok'}>
          <span aria-hidden="true">{pasado ? '◷' : '✓'}</span> {pasado ? 'Evento finalizado' : 'Válido'}
        </span>
        <strong className="boleto-asiento">{boleto.descripcion}</strong>
        {vistaPrevia ? <span className="btn btn-borde">Ver boleto</span> : <Link
          href={`/mis-boletos/${boleto.id}`}
          className="btn btn-borde"
          aria-label={`Ver boleto de ${nombreEvento}, ${boleto.descripcion}`}
        >
          Ver boleto
        </Link>}
      </div>
    </li>
  );
}
