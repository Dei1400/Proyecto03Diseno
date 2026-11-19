import { Injectable, NotFoundException } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { CalculadoraPrecioService } from './calculadora-precio.service';
import { FiltrosEventosDto } from './dto/filtros-eventos.dto';

// Costa Rica usa UTC-6 todo el año
const ZONA_HORARIA_COSTA_RICA = '-06:00';
const UN_DIA_EN_MS = 24 * 60 * 60 * 1000;

@Injectable()
export class EventosService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly calculadora: CalculadoraPrecioService,
  ) {}

  // RF-01, RF-02 y RF-03
  async listar(filtros: FiltrosEventosDto) {
    const where: Prisma.EventoWhereInput = {
      fechaHora: { gte: new Date() }, // solo eventos que todavía no pasan
      categoria: filtros.categoria,
      provincia: filtros.provincia,
    };

    if (filtros.q) {
      where.OR = [
        { nombre: { contains: filtros.q, mode: 'insensitive' } },
        { artista: { contains: filtros.q, mode: 'insensitive' } },
        { lugar: { contains: filtros.q, mode: 'insensitive' } },
      ];
    }

    if (filtros.fecha) {
      const inicio = new Date(
        `${filtros.fecha}T00:00:00${ZONA_HORARIA_COSTA_RICA}`,
      );
      const fin = new Date(inicio.getTime() + UN_DIA_EN_MS);
      where.fechaHora = { gte: inicio, lt: fin };
    }

    // Trae los eventos
    const eventos = await this.prisma.evento.findMany({
      where,
      include: { zonas: { select: { precio: true } } },
      orderBy: { fechaHora: 'asc' },
    });

    return eventos.map(({ zonas, ...evento }) => ({
      ...evento,
      precioDesde: this.precioDesde(zonas.map((zona) => zona.precio)),
    }));
  }

  // RF-04: detalle con el precio final y el desglose de cada zona
  async detalle(id: number) {
    const evento = await this.prisma.evento.findUnique({
      where: { id },
      include: { zonas: { orderBy: { precio: 'desc' } } },
    });

    if (!evento) {
      throw new NotFoundException('El evento no existe');
    }

    return {
      ...evento,
      zonas: evento.zonas.map((zona) => {
        const desglose = this.calculadora.calcular(zona.precio);
        return {
          id: zona.id,
          nombre: zona.nombre,
          precioFinal: desglose.total,
          desglose,
        };
      }),
    };
  }

  // RF-11: asientos de cada zona con su estado
  async asientos(eventoId: number) {
    await this.verificarQueExiste(eventoId);

    const zonas = await this.prisma.zona.findMany({
      where: { eventoId },
      orderBy: { precio: 'desc' },
      include: {
        asientos: {
          select: { id: true, fila: true, numero: true, estado: true },
          orderBy: [{ fila: 'asc' }, { numero: 'asc' }],
        },
      },
    });

    return zonas.map((zona) => ({
      id: zona.id,
      nombre: zona.nombre,
      precioFinal: this.calculadora.calcular(zona.precio).total,
      asientos: zona.asientos,
    }));
  }

  private async verificarQueExiste(id: number) {
    const cantidad = await this.prisma.evento.count({ where: { id } });
    if (cantidad === 0) {
      throw new NotFoundException('El evento no existe');
    }
  }

  // Precio final de la zona más barata
  private precioDesde(precios: number[]): number | null {
    if (precios.length === 0) {
      return null;
    }
    return this.calculadora.calcular(Math.min(...precios)).total;
  }
}