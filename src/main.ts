import { NestFactory } from '@nestjs/core';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './modules/app.module';
import { ConfigService } from '@nestjs/config';
import { SecurityHeadersMiddleware } from './middleware/security-headers.middleware';
import { logger } from './common/logger/logger.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger: logger,
  });

  // Security Headers
  const securityMiddleware = new SecurityHeadersMiddleware();
  app.use(securityMiddleware.use.bind(securityMiddleware));
  app.getHttpAdapter().getInstance().disable('x-powered-by');

  // Enable automatic validation
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      forbidNonWhitelisted: true,
    }),
  );

  const configService = app.get(ConfigService);

  // Swagger Setup
  const config = new DocumentBuilder()
    .setTitle(configService.get<string>('app.name') ?? 'Default App Name')
    .setDescription('The API description')
    .setVersion('1.0')
    .addTag('courses')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  // Server Setup
  const port = configService.get<number>('app.port', 3000);
  await app.listen(port);
  logger.log(`Application is running on: ${await app.getUrl()}`);
}

bootstrap();
