import { Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

const PORT = 3100;

async function bootstrap() {
  let logger = new Logger('Bootstrap')

  const app = await NestFactory.create(AppModule, {
    logger: console
  });
  await app.listen(PORT);
  logger.log(`Detective API running on port ${PORT}... `);
}
bootstrap();
