import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { SwaggerModule } from '@nestjs/swagger';
import { swaggerConfig, swaggerTheme } from './config/swagger';
import { ENV } from './config/env';
import { ConfigFileService } from './services/config-file.service';
import { Logger } from '@nestjs/common';

async function bootstrap() {
  const logger = new Logger('APP');

  // create NEST app
  const app = await NestFactory.create(AppModule, {
    bufferLogs: true,
    logger: logger,
  });

  const cfg = await ConfigFileService.load();

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
  await app.listen(ENV.PORT);
  logger.log(`Application is running on: ${await app.getUrl()}`);
}

bootstrap();
