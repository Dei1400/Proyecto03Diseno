import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AsientosModule } from './asientos/asientos.module';
import { AuthModule } from './auth/auth.module';
import { EventosModule } from './eventos/eventos.module';
import { PrismaModule } from './prisma/prisma.module';
import { OrdenesModule } from './ordenes/ordenes.module';
import { SaludController } from './salud/salud.controller';
import { BoletosModule } from './boletos/boletos.module';
import { UsuariosModule } from './usuarios/usuarios.module';
import { UsuariosService } from './usuarios/usuarios.service';
import { UsuariosController } from './usuarios/usuarios.controller';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }), // lee el archivo .env
    PrismaModule,
    AuthModule,
    EventosModule,
    AsientosModule,
    BoletosModule,
    OrdenesModule,
    UsuariosModule,
  ],
  controllers: [AppController, SaludController],
  providers: [AppService],
})
export class AppModule {}