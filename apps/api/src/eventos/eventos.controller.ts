import {
  BadRequestException,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Query,
} from '@nestjs/common';
import { FiltrosEventosDto } from './dto/filtros-eventos.dto';
import { EventosService } from './eventos.service';

const ID_NUMERICO = new ParseIntPipe({
  exceptionFactory: () => new BadRequestException('El id debe ser un número'),
});

// La lógica de negocio está en EventosService
@Controller('eventos')
export class EventosController {
  constructor(private readonly eventosService: EventosService) {}

  // GET
  @Get()
  listar(@Query() filtros: FiltrosEventosDto) {
    return this.eventosService.listar(filtros);
  }

  // GET /eventos/:id
  @Get(':id')
  detalle(@Param('id', ID_NUMERICO) id: number) {
    return this.eventosService.detalle(id);
  }

  // GET /eventos/:id/asientos
  @Get(':id/asientos')
  asientos(@Param('id', ID_NUMERICO) id: number) {
    return this.eventosService.asientos(id);
  }
}