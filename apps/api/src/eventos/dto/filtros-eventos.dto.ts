import { Categoria, Provincia } from '@prisma/client';
import {
  IsEnum,
  IsOptional,
  IsString,
  Matches,
  MaxLength,
} from 'class-validator';

// (RF-02 y RF-03)
export class FiltrosEventosDto {
  @IsOptional()
  @IsString()
  @MaxLength(100)
  q?: string;

  @IsOptional()
  @IsEnum(Categoria, { message: 'La categoría no es válida' })
  categoria?: Categoria;

  @IsOptional()
  @IsEnum(Provincia, { message: 'La provincia no es válida' })
  provincia?: Provincia;

  @IsOptional()
  @Matches(/^\d{4}-\d{2}-\d{2}$/, {
    message: 'La fecha debe tener el formato aaaa-mm-dd',
  })
  fecha?: string;
}