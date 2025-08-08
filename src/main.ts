 import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ValidationPipe } from '@nestjs/common';
import * as cookieParser from 'cookie-parser';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Prefixo global
  app.setGlobalPrefix('api');
  // Middleware para cookies
  app.use(cookieParser());
  // CORS com suporte a cookies
   app.enableCors({
    origin: process.env.FRONTEND_URL || 'http://localhost:5173', // <- coloque sua URL do frontend aqui
    credentials: true,
  })
  // Swagger config
  const config = new DocumentBuilder()
    .setTitle('DExpress')
    .setDescription('Plataforma online que conecta famílias a profissionais domésticos qualificados em Luanda')
    .setVersion('1.0')
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document);
  // Validação global
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );
await app.listen(process.env.PORT ?? 3000);
}
bootstrap();