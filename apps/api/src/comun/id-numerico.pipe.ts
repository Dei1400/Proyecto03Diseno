import { BadRequestException, ParseIntPipe } from '@nestjs/common';

export const ID_NUMERICO = new ParseIntPipe({
  exceptionFactory: () => new BadRequestException('El id debe ser un número'),
});