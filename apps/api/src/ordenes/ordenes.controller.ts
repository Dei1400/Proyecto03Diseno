import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  UseGuards,
} from '@nestjs/common';
import { SesionGuard, type UsuarioSesion } from '../auth/sesion.guard';
import { UsuarioActual } from '../auth/usuario-actual.decorator';
import { ID_NUMERICO } from '../comun/id-numerico.pipe';
import { CrearOrdenDto } from './dto/crear-orden.dto';
import { PagarOrdenDto } from './dto/pagar-orden.dto';
import { OrdenesService } from './ordenes.service';

//  todas sus rutas piden iniciar sesión
@Controller('ordenes')
@UseGuards(SesionGuard)
export class OrdenesController {
  constructor(private readonly ordenesService: OrdenesService) {}

  // POST /ordenes
  @Post()
  crear(@UsuarioActual() usuario: UsuarioSesion, @Body() datos: CrearOrdenDto) {
    return this.ordenesService.crear(usuario.id, datos);
  }

  // POST /ordenes/:id/pagar
  @Post(':id/pagar')
  @HttpCode(HttpStatus.OK)
  pagar(
    @UsuarioActual() usuario: UsuarioSesion,
    @Param('id', ID_NUMERICO) id: number,
    @Body() datos: PagarOrdenDto,
  ) {
    return this.ordenesService.pagar(usuario.id, id, datos);
  }

  // GET /ordenes
  @Get()
  historial(@UsuarioActual() usuario: UsuarioSesion) {
    return this.ordenesService.historial(usuario.id);
  }
}