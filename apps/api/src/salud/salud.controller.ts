import { Controller, Get } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Controller('salud')
export class SaludController {
  constructor(private readonly prisma: PrismaService) {}

  @Get()
  async revisar() {
    await this.prisma.$queryRaw`SELECT 1`;
    return { estado: 'ok', baseDeDatos: 'conectada' };
  }
}