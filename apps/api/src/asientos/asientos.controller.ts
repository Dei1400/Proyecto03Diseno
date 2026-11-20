import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  UseGuards,
} from '@nestjs/common';
import { SesionGuard, type UsuarioSesion } from '../auth/sesion.guard';
import { UsuarioActual } from '../auth/usuario-actual.decorator';
import { AsientosService } from './asientos.service';
import { SeleccionAsientosDto } from './dto/seleccion-asientos.dto';

// todas sus rutas piden iniciar sesión
@Controller('asientos')
@UseGuards(SesionGuard)
export class AsientosController {
  constructor(private readonly asientosService: AsientosService) {}

  // POST /asientos/retener
  @Post('retener')
  @HttpCode(HttpStatus.OK)
  retener(
    @UsuarioActual() usuario: UsuarioSesion,
    @Body() datos: SeleccionAsientosDto,
  ) {
    return this.asientosService.retener(usuario.id, datos);
  }

  // POST /asientos/liberar
  @Post('liberar')
  @HttpCode(HttpStatus.OK)
  liberar(
    @UsuarioActual() usuario: UsuarioSesion,
    @Body() datos: SeleccionAsientosDto,
  ) {
    return this.asientosService.liberar(usuario.id, datos);
  }
}