import { Injectable, Logger } from '@nestjs/common';
import type { CambioDeAsientos, Observador } from './observadores/observador';

/**
 * Observer, aqui se guarda la lista de observadores y les avisa cada cambio
 */
@Injectable()
export class PublicadorDeEventos {
  private readonly observadores: Observador[] = [];
  private readonly logger = new Logger(PublicadorDeEventos.name);

  suscribir(observador: Observador) {
    this.observadores.push(observador);
  }

  // Se llama después de guardar en la base de datos
  notificar(cambio: CambioDeAsientos) {
    for (const observador of this.observadores) {
      // Si un observador falla, la compra ya quedó guardada: solo se anota el error
      void Promise.resolve()
        .then(() => observador.actualizar(cambio))
        .catch((error: unknown) =>
          this.logger.error('Un observador no pudo actualizarse', error),
        );
    }
  }
}