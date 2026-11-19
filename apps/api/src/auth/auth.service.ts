import {
  ConflictException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Rol, Usuario } from '@prisma/client';
import * as bcrypt from 'bcryptjs';
import { PrismaService } from '../prisma/prisma.service';
import { LoginDto } from './dto/login.dto';
import { RegistroDto } from './dto/registro.dto';

// Cuántas vueltas usa bcrypt para proteger la contraseña
const RONDAS_HASH = 10;

// Lo que va guardado dentro del token
export interface DatosToken {
  sub: number; // id del usuario
  rol: Rol;
}

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwt: JwtService,
  ) {}

  // RF-05: crear una cuenta nueva 
  async registrar(datos: RegistroDto) {
    const correo = this.normalizarCorreo(datos.correo);

    const existe = await this.prisma.usuario.findUnique({ where: { correo } });
    if (existe) {
      throw new ConflictException('Ese correo ya está registrado');
    }

    const usuario = await this.prisma.usuario.create({
      data: {
        nombre: datos.nombre.trim(),
        correo,
        cedula: datos.cedula,
        telefono: datos.telefono,
        contrasenaHash: await bcrypt.hash(datos.contrasena, RONDAS_HASH),
      },
    });

    return this.crearSesion(usuario);
  }

  // RF-06
  async iniciarSesion(datos: LoginDto) {
    const usuario = await this.prisma.usuario.findUnique({
      where: { correo: this.normalizarCorreo(datos.correo) },
    });

    const contrasenaCorrecta =
      usuario !== null &&
      (await bcrypt.compare(datos.contrasena, usuario.contrasenaHash));

    // Mismo mensaje si el correo no existe o si la contraseña está mal
    if (!usuario || !contrasenaCorrecta) {
      throw new UnauthorizedException('Correo o contraseña incorrectos');
    }

    return this.crearSesion(usuario);
  }

  // Entrega el token y los datos públicos del usuario (nunca la contraseña)
  private async crearSesion(usuario: Usuario) {
    const datosToken: DatosToken = { sub: usuario.id, rol: usuario.rol };

    return {
      token: await this.jwt.signAsync(datosToken),
      usuario: {
        id: usuario.id,
        nombre: usuario.nombre,
        correo: usuario.correo,
        cedula: usuario.cedula,
        telefono: usuario.telefono,
        rol: usuario.rol,
      },
    };
  }

  // para evitar repetidos, o campos con espacios o mayúsculas.
  private normalizarCorreo(correo: string): string {
    return correo.trim().toLowerCase();
  }
}