import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { RegistroDto } from './dto/registro.dto';

// Controlador, recibe los datos y llama a AuthService
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  // POST /auth/registro
  @Post('registro')
  registrar(@Body() datos: RegistroDto) {
    return this.authService.registrar(datos);
  }

  // POST /auth/login
  @Post('login')
  @HttpCode(HttpStatus.OK) // iniciar sesión no crea nada, por eso responde 200
  iniciarSesion(@Body() datos: LoginDto) {
    return this.authService.iniciarSesion(datos);
  }
}