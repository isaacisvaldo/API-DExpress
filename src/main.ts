 import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ValidationPipe } from '@nestjs/common';
import * as cookieParser from 'cookie-parser';
import { FrontendUrlService } from './module/shared/config/frontend-url/frontend-url.service';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
 
    const uerls = app.get(FrontendUrlService);

  // Prefixo global
  app.setGlobalPrefix('api');
  // Middleware para cookies
  app.use(cookieParser());
  const fixedDomain = process.env.ADMIN_DOMAIN ; 
  app.enableCors({
    origin: async (origin, callback) => {
      if (!origin) return callback(null, true);

      try {
        const allowedDomainsFromDB = await uerls.getAllDomains();
        const allowedDomains = [...allowedDomainsFromDB, fixedDomain];

        if (allowedDomains.includes(origin)) {
          return callback(null, true);
        }
        return callback(new Error('Not allowed by CORS'), false);
      } catch (err) {
        console.error('Erro ao validar CORS:', err);
        return callback(new Error('Erro interno no CORS'), false);
      }
    },
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
await app.listen(process.env.PORT ?? 3000);
}
bootstrap();