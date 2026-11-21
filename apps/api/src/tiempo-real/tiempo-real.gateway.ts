import { JwtService } from '@nestjs/jwt';
import {
  ConnectedSocket,
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Rol } from '@prisma/client';
import type { Server, Socket } from 'socket.io';
import type { DatosToken } from '../auth/auth.service';
import { origenesPermitidos } from '../comun/origenes-permitidos';
import { SALA_PRODUCTORA, salaDeEvento } from './tiempo-real.constants';

// Servidor de sockets
@WebSocketGateway({ cors: { origin: origenesPermitidos() } })
export class TiempoRealGateway {
  @WebSocketServer()
  private servidor: Server;

  constructor(private readonly jwt: JwtService) {}

  // La página de un evento entra a su sala para ver el mapa en vivo
  @SubscribeMessage('evento.unirse')
  async unirseAEvento(@ConnectedSocket() cliente: Socket, @MessageBody() eventoId: number) {
    await cliente.join(salaDeEvento(Number(eventoId)));
    return { unido: true };
  }

  // Al salir de la página del evento
  @SubscribeMessage('evento.salir')
  async salirDeEvento(@ConnectedSocket() cliente: Socket, @MessageBody() eventoId: number) {
    await cliente.leave(salaDeEvento(Number(eventoId)));
    return { unido: false };
  }

  // Solo la productora ve las ventas
  @SubscribeMessage('ventas.unirse')
  async unirseAVentas(@ConnectedSocket() cliente: Socket, @MessageBody() token: string) {
    try {
      const datos = await this.jwt.verifyAsync<DatosToken>(token);
      if (datos.rol !== Rol.PRODUCTORA) {
        return { unido: false };
      }
      await cliente.join(SALA_PRODUCTORA);
      return { unido: true };
    } catch {
      return { unido: false };
    }
  }

  // Envía un aviso a todos los que están en una sala
  enviar(sala: string, aviso: string, datos: unknown) {
    this.servidor.to(sala).emit(aviso, datos);
  }
}