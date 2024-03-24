import { NestFactory } from '@nestjs/core';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './modules/app.module';
import { ConfigService } from '@nestjs/config';
import { SecurityHeadersMiddleware } from '././middleware/security-headers.middleware';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  // Security Headers
  app.use(new SecurityHeadersMiddleware().use);
  app.getHttpAdapter().getInstance().disable('x-powered-by');

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
  console.log(`Application is running on: ${await app.getUrl()}`);
}

bootstrap();
