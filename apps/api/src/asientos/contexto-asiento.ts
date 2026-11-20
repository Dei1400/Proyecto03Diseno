import { EstadoAsiento } from '@prisma/client';
import {
  Bloqueado,
  Disponible,
  Retenido,
  Vendido,
  type EstadoDelAsiento,
} from './estados-asiento';

// Datos del asiento tal como vienen de la base de datos
export interface DatosAsiento {
  id: number;
  estado: EstadoAsiento;
  retenidoPorId: number | null;
  retenidoHasta: Date | null;
}

// Traduce el estado guardado en la base de datos a su clase
const CLASE_DE_ESTADO: Record<EstadoAsiento, () => EstadoDelAsiento> = {
  DISPONIBLE: () => new Disponible(),
  RETENIDO: () => new Retenido(),
  VENDIDO: () => new Vendido(),
  BLOQUEADO: () => new Bloqueado(),
};

/**
 * Guarda su estado actual y le pasa cada acción a la clase de ese estado.
 */
export class ContextoAsiento {
  readonly id: number;
  private estado: EstadoDelAsiento;
  private _retenidoPorId: number | null;
  private _retenidoHasta: Date | null;

  constructor(datos: DatosAsiento, ahora: Date = new Date()) {
    this.id = datos.id;
    this.estado = CLASE_DE_ESTADO[datos.estado]();
    this._retenidoPorId = datos.retenidoPorId;
    this._retenidoHasta = datos.retenidoHasta;

    // si la retención ya venció, el asiento vuelve a estar disponible
    if (this.retencionVencida(ahora)) {
      this.cambiarEstado(new Disponible());
    }
  }

  get estadoActual(): EstadoAsiento {
    return this.estado.nombre;
  }

  get retenidoPorId(): number | null {
    return this._retenidoPorId;
  }

  get retenidoHasta(): Date | null {
    return this._retenidoHasta;
  }

  // Cada acción se la pasa al estado actual
  retener(usuarioId: number, hasta: Date) {
    this.estado.retener(this, usuarioId, hasta);
  }

  liberar(usuarioId: number) {
    this.estado.liberar(this, usuarioId);
  }

  vender(usuarioId: number) {
    this.estado.vender(this, usuarioId);
  }

  bloquear() {
    this.estado.bloquear(this);
  }

  // Solo lo usan las clases de estado para pasar de un estado a otro
  cambiarEstado(
    nuevo: EstadoDelAsiento,
    retenidoPorId: number | null = null,
    retenidoHasta: Date | null = null,
  ) {
    this.estado = nuevo;
    this._retenidoPorId = retenidoPorId;
    this._retenidoHasta = retenidoHasta;
  }

  // Lo que se guarda en la base de datos después de una acción
  datosParaGuardar() {
    return {
      estado: this.estado.nombre,
      retenidoPorId: this._retenidoPorId,
      retenidoHasta: this._retenidoHasta,
    };
  }

  private retencionVencida(ahora: Date): boolean {
    return (
      this.estado.nombre === EstadoAsiento.RETENIDO &&
      (this._retenidoHasta === null || this._retenidoHasta <= ahora)
    );
  }
}