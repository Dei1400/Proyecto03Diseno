import { Injectable, OnModuleInit } from '@nestjs/common';
import { PublicadorDeEventos } from '../publicador-de-eventos.service';
import { AVISO_ASIENTOS, salaDeEvento } from '../tiempo-real.constants';
import { TiempoRealGateway } from '../tiempo-real.gateway';
import type { CambioDeAsientos, Observador } from './observador';

// este observer avisa a quienes ven el mapa del evento qué asientos cambiaron
@Injectable()
export class MapaTiempoReal implements Observador, OnModuleInit {
  constructor(
    private readonly publicador: PublicadorDeEventos,
    private readonly gateway: TiempoRealGateway,
  ) {}

  // Se suscribe al publicador cuando arranca el API
  onModuleInit() {
    this.publicador.suscribir(this);
  }

  actualizar(cambio: CambioDeAsientos) {
    this.gateway.enviar(salaDeEvento(cambio.eventoId), AVISO_ASIENTOS, cambio);
  }
}