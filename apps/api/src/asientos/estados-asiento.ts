import { ConflictException, ForbiddenException } from '@nestjs/common';
import { EstadoAsiento } from '@prisma/client';
import type { ContextoAsiento } from './contexto-asiento';

/**
 * Cada estado del asiento es una clase con las mismas operaciones. Cada clase decide qué se puede hacer desde su estado, así el resto del código no tiene que preguntar con if/switch en qué estado está
 */
export interface EstadoDelAsiento {
  readonly nombre: EstadoAsiento;
  retener(asiento: ContextoAsiento, usuarioId: number, hasta: Date): void;
  liberar(asiento: ContextoAsiento, usuarioId: number): void;
  vender(asiento: ContextoAsiento, usuarioId: number): void;
  bloquear(asiento: ContextoAsiento): void;
}

export class Disponible implements EstadoDelAsiento {
  readonly nombre = EstadoAsiento.DISPONIBLE;

  retener(asiento: ContextoAsiento, usuarioId: number, hasta: Date) {
    asiento.cambiarEstado(new Retenido(), usuarioId, hasta);
  }

  liberar() {
    // Ya está libre
  }

  vender() {
    throw new ConflictException('Este asiento ya no está apartado: se acabó el tiempo. Elige tus asientos de nuevo.');
  }

  bloquear(asiento: ContextoAsiento) {
    asiento.cambiarEstado(new Bloqueado());
  }
}

export class Retenido implements EstadoDelAsiento {
  readonly nombre = EstadoAsiento.RETENIDO;

  retener(asiento: ContextoAsiento, usuarioId: number) {
    if (asiento.retenidoPorId !== usuarioId) {
      throw new ConflictException('Este asiento ya está apartado por otra persona');
    }
    // Si ya es suyo, se queda igual
  }

  liberar(asiento: ContextoAsiento, usuarioId: number) {
    if (asiento.retenidoPorId !== usuarioId) {
      throw new ForbiddenException('No puedes liberar un asiento que apartó otra persona');
    }
    asiento.cambiarEstado(new Disponible());
  }

  vender(asiento: ContextoAsiento, usuarioId: number) {
    if (asiento.retenidoPorId !== usuarioId) {
      throw new ConflictException('Este asiento está apartado por otra persona');
    }
    asiento.cambiarEstado(new Vendido());
  }

  bloquear() {
    throw new ConflictException('No se puede bloquear un asiento que alguien apartó');
  }
}

export class Vendido implements EstadoDelAsiento {
  readonly nombre = EstadoAsiento.VENDIDO;

  retener() {
    throw new ConflictException('Este asiento ya fue vendido');
  }

  liberar() {
    throw new ConflictException('Un asiento vendido no se puede liberar');
  }

  vender() {
    throw new ConflictException('Este asiento ya fue vendido');
  }

  bloquear() {
    throw new ConflictException('Un asiento vendido no se puede bloquear');
  }
}

export class Bloqueado implements EstadoDelAsiento {
  readonly nombre = EstadoAsiento.BLOQUEADO;

  retener() {
    throw new ConflictException('Este asiento no está a la venta');
  }

  liberar() {
    throw new ConflictException('Este asiento no está a la venta');
  }

  vender() {
    throw new ConflictException('Este asiento no está a la venta');
  }

  bloquear() {
    // bloqueado
  }
}