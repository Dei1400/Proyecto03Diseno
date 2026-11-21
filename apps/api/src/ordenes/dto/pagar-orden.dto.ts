import { MetodoPago } from '@prisma/client';
import { IsEnum, IsIn, Matches, ValidateIf } from 'class-validator';
import { CUOTAS_PERMITIDAS } from '../../pagos/pagos.constants';

export class PagarOrdenDto {
  @IsEnum(MetodoPago, { message: 'Elige pagar de contado o en cuotas' })
  metodo!: MetodoPago;

  // Contado y cuotas se pagan con tarjeta debe tener 16 números 
  @Matches(/^\d{16}$/, { message: 'El número de tarjeta debe tener 16 números' })
  numeroTarjeta!: string;

  // Solo al pagar en cuotas
  @ValidateIf((datos: PagarOrdenDto) => datos.metodo === MetodoPago.CUOTAS)
  @IsIn(CUOTAS_PERMITIDAS, {
    message: `Elige ${CUOTAS_PERMITIDAS.join(', ')} cuotas`,
  })
  cuotas?: number;
}