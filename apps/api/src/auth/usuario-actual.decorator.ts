import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import type { PeticionConSesion, UsuarioSesion } from './sesion.guard';

/**
 * Entrega a los controladores el usuario que inició sesión
 */
export const UsuarioActual = createParamDecorator(
  (_datos: unknown, contexto: ExecutionContext): UsuarioSesion =>
    contexto.switchToHttp().getRequest<PeticionConSesion>().usuario as UsuarioSesion,
);