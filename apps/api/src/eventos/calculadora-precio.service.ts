import { Injectable } from '@nestjs/common';
import {
  PORCENTAJE_CARGO_SERVICIO,
  PORCENTAJE_ESPECTACULOS,
  PORCENTAJE_IVA,
  PORCENTAJE_MUNICIPAL,
} from './precio.constants';

export interface DesglosePrecio {
  subtotal: number;
  cargoServicio: number;
  iva: number;
  impuestoEspectaculos: number;
  impuestoMunicipal: number;
  total: number;
}

/**
 * Lógica de negocio RN-04 y RN-05. La persona siempre ve el precio final, con el cargo por servicio y los impuestos incluidos.
 * Es el único lugar del API donde se calcula un precio.
 */
@Injectable()
export class CalculadoraPrecioService {
  calcular(precioZona: number, cantidad = 1): DesglosePrecio {
    const subtotal = precioZona * cantidad;
    const cargoServicio = this.aColones(subtotal * PORCENTAJE_CARGO_SERVICIO);
    const iva = this.aColones(subtotal * PORCENTAJE_IVA);
    const impuestoEspectaculos = this.aColones(
      subtotal * PORCENTAJE_ESPECTACULOS,
    );
    const impuestoMunicipal = this.aColones(subtotal * PORCENTAJE_MUNICIPAL);

    return {
      subtotal,
      cargoServicio,
      iva,
      impuestoEspectaculos,
      impuestoMunicipal,
      total:
        subtotal + cargoServicio + iva + impuestoEspectaculos + impuestoMunicipal,
    };
  }

  // Los colones se manejan sin decimales
  private aColones(monto: number): number {
    return Math.round(monto);
  }
}