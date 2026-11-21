import { Injectable, OnModuleInit } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import {
  ESPERA_MAXIMA_TRANSACCION_MS,
  TIEMPO_MAXIMO_TRANSACCION_MS,
} from './prisma.constants';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit {
  constructor() {
    // Todas las transacciones del API usan estos tiempos
    super({
      transactionOptions: {
        maxWait: ESPERA_MAXIMA_TRANSACCION_MS,
        timeout: TIEMPO_MAXIMO_TRANSACCION_MS,
      },
    });
  }

  async onModuleInit() {
    await this.$connect();
  }
}