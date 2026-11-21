import { IsOptional, IsString, Matches, MaxLength, MinLength } from 'class-validator';

// Lo que se puede cambiar del perfil
export class ActualizarPerfilDto {
  @IsOptional()
  @IsString()
  @MinLength(2, { message: 'El nombre es muy corto' })
  @MaxLength(100)
  nombre?: string;

  @IsOptional()
  @Matches(/^\d{8}$/, { message: 'El teléfono debe tener 8 dígitos' })
  telefono?: string;
}