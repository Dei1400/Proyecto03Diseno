import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { SesionGuard } from './sesion.guard';

// Cuánto dura una sesión antes de pedir iniciar sesión de nuevo (1 día)
const DURACION_SESION_SEGUNDOS = 24 * 60 * 60;

@Module({
  imports: [
    JwtModule.registerAsync({
      global: true, // así SesionGuard se puede usar en cualquier módulo
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        secret: config.getOrThrow<string>('JWT_SECRET'),
        signOptions: { expiresIn: DURACION_SESION_SEGUNDOS },
      }),
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, SesionGuard],
  exports: [SesionGuard],
})
export class AuthModule {}