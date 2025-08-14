// src/main.ts
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ValidationPipe } from '@nestjs/common';
import * as cookieParser from 'cookie-parser';
import { FrontendUrlService } from './module/shared/config/frontend-url/frontend-url.service';
import { RateLimitExceptionFilter } from './common/filters/rate-limit-exception.filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const uerls = app.get(FrontendUrlService);

  // Prefixo global
  app.setGlobalPrefix('api');
  // Middleware para cookies
  app.use(cookieParser());

  let allowedDomains: string[] = [];
  try {
    const allowedDomainsFromDB = await uerls.getAllDomains();
    allowedDomains = allowedDomainsFromDB.filter(Boolean); 
  } catch (err) {
    console.error('Erro ao carregar domínios do banco de dados para CORS:', err);
    allowedDomains = ['http://localhost:4200', 'http://localhost:5173'];
  }

  console.log('Domínios CORS permitidos:', allowedDomains);

  app.enableCors({
    origin: allowedDomains, 
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    
    credentials: true,
  });

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
   app.useGlobalFilters(new RateLimitExceptionFilter());

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();