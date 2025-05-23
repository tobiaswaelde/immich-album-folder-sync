import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  // create NEST app
  const app = await NestFactory.create(AppModule, { bufferLogs: true });
}

bootstrap();
