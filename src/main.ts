import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { SwaggerModule } from '@nestjs/swagger';
import { swaggerConfig, swaggerTheme } from './config/swagger';

async function bootstrap() {
  // create NEST app
  const app = await NestFactory.create(AppModule, { bufferLogs: true });

  // configuration
  app.getHttpAdapter().getInstance().disable('x-powered-by');
  app.setGlobalPrefix('/api');
  app.enableShutdownHooks();
  app.enableCors({ origin: '*' });

  // enable validation + serialization
  //TODO

  // swagger
  const document = SwaggerModule.createDocument(app, swaggerConfig);
  SwaggerModule.setup('api', app, document, {
    customCss: swaggerTheme,
  });

  // start app
  await app.listen(3001);
  console.log(`Application is running on: ${await app.getUrl()}`);
}

bootstrap();
