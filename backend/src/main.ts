import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import 'dotenv/config';
import { createLogger } from './logger/logger.factory';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    bufferLogs: true,
  });

  app.useLogger(createLogger());
  app.setGlobalPrefix('api/afisha');
  app.enableCors();
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
    }),
  );
  await app.listen(3000);
}
bootstrap();
