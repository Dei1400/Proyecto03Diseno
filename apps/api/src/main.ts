import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { FiltroErrores } from './comun/filtro-errores.filter';
import { origenesPermitidos } from './comun/origenes-permitidos';
async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Solo la web (FRONTEND_URL) puede llamar al API
  app.enableCors({ origin: origenesPermitidos() });

  // Valida los datos que llegan (DTO) y quita los campos que no se esperan
  app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));

  // Todas las respuestas de error con la forma { mensaje }
  app.useGlobalFilters(new FiltroErrores());

  await app.listen(process.env.PORT ?? 3000);
}
void bootstrap();