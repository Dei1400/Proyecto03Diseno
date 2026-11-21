import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { ActualizarPerfilDto } from './dto/actualizar-perfil.dto';

// Datos del usuario que se pueden mostrar 
const DATOS_PUBLICOS = {
  id: true,
  nombre: true,
  correo: true,
  cedula: true,
  telefono: true,
  rol: true,
} as const;

@Injectable()
export class UsuariosService {
  constructor(private readonly prisma: PrismaService) {}

  // Ver mi perfil
  async perfil(usuarioId: number) {
    const usuario = await this.prisma.usuario.findUnique({
      where: { id: usuarioId },
      select: DATOS_PUBLICOS,
    });
    if (!usuario) {
      throw new NotFoundException('El usuario no existe');
    }
    return usuario;
  }

  // Cambiar nombre y teléfono 
  actualizar(usuarioId: number, datos: ActualizarPerfilDto) {
    return this.prisma.usuario.update({
      where: { id: usuarioId },
      data: { nombre: datos.nombre?.trim(), telefono: datos.telefono },
      select: DATOS_PUBLICOS,
    });
  }
}