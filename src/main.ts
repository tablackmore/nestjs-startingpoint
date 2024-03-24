import { NestFactory } from '@nestjs/core';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './modules/app.module';
import { ConfigService } from '@nestjs/config';
import { SecurityHeadersMiddleware } from '././middleware/security-headers.middleware';
import { logger } from './common/logger/logger.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger: logger,
  });

  // Security Headers
  app.use(new SecurityHeadersMiddleware().use);
  app.getHttpAdapter().getInstance().disable('x-powered-by');

  // Enable automatic validation
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // Strip away non-whitelisted properties
      transform: true, // Automatically transform payloads to be objects typed according to their DTO classes
      forbidNonWhitelisted: true, // Throw errors if non-whitelisted values are provided
      transformOptions: {
        enableImplicitConversion: true, // Automatically convert primitive types
      },
    }),
  );

  const configService = app.get(ConfigService);

  // Swagger Setup
  const config = new DocumentBuilder()
    .setTitle(configService.get<string>('app.name') ?? 'Default App Name')
    .setDescription('The API description')
    .setVersion('1.0')
    .addTag('example')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  // Server Setup
  const port = configService.get<number>('app.port', 3000);
  await app.listen(port);
  logger.log(`Application is running on: ${await app.getUrl()}`);
}

bootstrap();
