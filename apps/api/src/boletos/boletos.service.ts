import { Injectable, NotFoundException } from '@nestjs/common';
import { EstadoOrden, Prisma } from '@prisma/client';
import * as QRCode from 'qrcode';
import { PrismaService } from '../prisma/prisma.service';

// su asiento, la zona y el evento
const DATOS_BOLETO = {
  id: true,
  codigo: true,
  asiento: {
    select: {
      fila: true,
      numero: true,
      zona: {
        select: {
          nombre: true,
          evento: {
            select: { id: true, nombre: true, fechaHora: true, lugar: true, provincia: true },
          },
        },
      },
    },
  },
} satisfies Prisma.BoletoSelect;

type BoletoConDatos = Prisma.BoletoGetPayload<{ select: typeof DATOS_BOLETO }>;

@Injectable()
export class BoletosService {
  constructor(private readonly prisma: PrismaService) {}

  // los boletos de la persona (solo de órdenes pagadas)
  async misBoletos(usuarioId: number) {
    const boletos = await this.prisma.boleto.findMany({
      where: { orden: { usuarioId, estado: EstadoOrden.PAGADA } },
      select: DATOS_BOLETO,
      orderBy: { id: 'asc' },
    });
    return Promise.all(boletos.map((boleto) => this.paraMostrar(boleto)));
  }

  //  un boleto con su QR 
  async detalle(usuarioId: number, boletoId: number) {
    const boleto = await this.prisma.boleto.findFirst({
      where: { id: boletoId, orden: { usuarioId, estado: EstadoOrden.PAGADA } },
      select: DATOS_BOLETO,
    });
    if (!boleto) {
      throw new NotFoundException('El boleto no existe');
    }
    return this.paraMostrar(boleto);
  }

  // Forma que usa la página: { id, descripcion, qr, evento }
  private async paraMostrar(boleto: BoletoConDatos) {
    const { fila, numero, zona } = boleto.asiento;
    return {
      id: boleto.id,
      codigo: boleto.codigo,
      descripcion: `${zona.nombre} · Fila ${fila} · Asiento ${numero}`,
      qr: await QRCode.toDataURL(boleto.codigo),
      evento: zona.evento,
    };
  }
}