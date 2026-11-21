import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import type { Response } from 'express';

// Todas las respuestas de error del API tienen la misma forma: { mensaje }
@Catch()
export class FiltroErrores implements ExceptionFilter {
  private readonly logger = new Logger(FiltroErrores.name);

  catch(error: unknown, host: ArgumentsHost) {
    const respuesta = host.switchToHttp().getResponse<Response>();

    if (error instanceof HttpException) {
      respuesta
        .status(error.getStatus())
        .json({ mensaje: this.mensajeDe(error) });
      return;
    }

    this.logger.error(error);
    respuesta
      .status(HttpStatus.INTERNAL_SERVER_ERROR)
      .json({ mensaje: 'Ocurrió un error inesperado' });
  }

  // Los errores de validación traen una lista de mensajes
  private mensajeDe(error: HttpException): string {
    const cuerpo = error.getResponse();
    if (typeof cuerpo === 'object' && cuerpo !== null && 'message' in cuerpo) {
      const mensaje = (cuerpo as { message: string | string[] }).message;
      return Array.isArray(mensaje) ? mensaje.join('. ') : mensaje;
    }
    return error.message;
  }
}