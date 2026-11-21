import { Body, Controller, Get, Put, UseGuards } from '@nestjs/common';
import { SesionGuard, type UsuarioSesion } from '../auth/sesion.guard';
import { UsuarioActual } from '../auth/usuario-actual.decorator';
import { ActualizarPerfilDto } from './dto/actualizar-perfil.dto';
import { UsuariosService } from './usuarios.service';

@Controller('usuarios')
@UseGuards(SesionGuard)
export class UsuariosController {
  constructor(private readonly usuariosService: UsuariosService) {}

  // GET /usuarios/yo
  @Get('yo')
  perfil(@UsuarioActual() usuario: UsuarioSesion) {
    return this.usuariosService.perfil(usuario.id);
  }

  // PUT /usuarios/yo
  @Put('yo')
  actualizar(
    @UsuarioActual() usuario: UsuarioSesion,
    @Body() datos: ActualizarPerfilDto,
  ) {
    return this.usuariosService.actualizar(usuario.id, datos);
  }
}