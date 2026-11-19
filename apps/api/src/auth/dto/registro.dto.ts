import { IsEmail, IsString, Matches, MaxLength, MinLength } from 'class-validator';

// Datos para crear una cuenta (RF-05)
export class RegistroDto {
  @IsString()
  @MinLength(2, { message: 'El nombre es muy corto' })
  @MaxLength(100)
  nombre!: string;

  @IsEmail({}, { message: 'El correo no es válido' })
  correo!: string;

  // Cédula física 
  @Matches(/^(\d-\d{4}-\d{4}|\d-\d{3}-\d{6}|\d{11,12})$/, {
    message: 'La cédula no es válida',
  })
  cedula!: string;

  @Matches(/^\d{8}$/, { message: 'El teléfono debe tener 8 dígitos' })
  telefono!: string;

  @MinLength(8, { message: 'La contraseña debe tener al menos 8 caracteres' })
  @MaxLength(72, { message: 'La contraseña es muy larga' })
  contrasena!: string;
}