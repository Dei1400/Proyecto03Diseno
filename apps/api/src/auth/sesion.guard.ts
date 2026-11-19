import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import type { Request } from 'express';
import type { DatosToken } from './auth.service';

//  queda guardado en la petición después de revisar el token
export interface UsuarioSesion {
  id: number;
  rol: DatosToken['rol'];
}

export type PeticionConSesion = Request & { usuario?: UsuarioSesion };

@Injectable()
export class SesionGuard implements CanActivate {
  constructor(private readonly jwt: JwtService) {}

  async canActivate(contexto: ExecutionContext): Promise<boolean> {
    const peticion = contexto.switchToHttp().getRequest<PeticionConSesion>();
    const token = this.leerToken(peticion);

    if (!token) {
      throw new UnauthorizedException('Tienes que iniciar sesión');
    }

    try {
      const datos = await this.jwt.verifyAsync<DatosToken>(token);
      peticion.usuario = { id: datos.sub, rol: datos.rol };
      return true;
    } catch {
      throw new UnauthorizedException(
        'Tu sesión venció, inicia sesión de nuevo',
      );
    }
  }

  // El token llega en el encabezado
  private leerToken(peticion: Request): string | undefined {
    const [tipo, token] = peticion.headers.authorization?.split(' ') ?? [];
    return tipo === 'Bearer' ? token : undefined;
  }
}