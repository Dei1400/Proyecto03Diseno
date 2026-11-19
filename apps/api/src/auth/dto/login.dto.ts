import { IsEmail, IsString, MinLength } from 'class-validator';

// Datos para iniciar sesión (RF-06)
export class LoginDto {
  @IsEmail({}, { message: 'El correo no es válido' })
  correo!: string;

  @IsString()
  @MinLength(1, { message: 'Escribe tu contraseña' })
  contrasena!: string;
}