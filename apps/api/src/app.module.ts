import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { SaludController } from './salud/salud.controller';

@Module({
  imports: [PrismaModule],
  controllers: [AppController, SaludController],
  providers: [AppService],
})
export class AppModule {}