import { Controller, Get, Param, UseGuards } from '@nestjs/common';
import { SesionGuard, type UsuarioSesion } from '../auth/sesion.guard';
import { UsuarioActual } from '../auth/usuario-actual.decorator';
import { ID_NUMERICO } from '../comun/id-numerico.pipe';
import { BoletosService } from './boletos.service';

@Controller('boletos')
@UseGuards(SesionGuard)
export class BoletosController {
  constructor(private readonly boletosService: BoletosService) {}

  // GET /boletos
  @Get()
  misBoletos(@UsuarioActual() usuario: UsuarioSesion) {
    return this.boletosService.misBoletos(usuario.id);
  }

  // GET /boletos/:id
  @Get(':id')
  detalle(
    @UsuarioActual() usuario: UsuarioSesion,
    @Param('id', ID_NUMERICO) id: number,
  ) {
    return this.boletosService.detalle(usuario.id, id);
  }
}