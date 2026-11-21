import {
  ArrayMaxSize,
  ArrayNotEmpty,
  ArrayUnique,
  IsArray,
  IsInt,
  Min,
} from 'class-validator';
import { MAXIMO_BOLETOS_POR_EVENTO } from '../asientos.constants';

// Asientos que la persona quiere apartar o liberar
export class SeleccionAsientosDto {
  @IsInt({ message: 'El evento no es válido' })
  @Min(1, { message: 'El evento no es válido' })
  eventoId!: number;

  @IsArray({ message: 'Elige al menos un asiento' })
  @ArrayNotEmpty({ message: 'Elige al menos un asiento' })
  @ArrayMaxSize(MAXIMO_BOLETOS_POR_EVENTO, {
    message: `Puedes elegir como máximo ${MAXIMO_BOLETOS_POR_EVENTO} asientos`,
  })
  @ArrayUnique({ message: 'Hay asientos repetidos' })
  @IsInt({ each: true, message: 'Los asientos no son válidos' })
  asientoIds!: number[];
}