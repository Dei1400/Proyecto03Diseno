import type { EstadoAsiento } from '@prisma/client';

export interface CambioDeAsientos {
  eventoId: number;
  asientos: { id: number; estado: EstadoAsiento; vencenEn: Date | null }[];
}

// Patrón Observer. aqui todo el que quiera enterarse de los cambios implementa esta interfaz
export interface Observador {
  actualizar(cambio: CambioDeAsientos): void | Promise<void>;
}