import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
const app = await NestFactory.create(AppModule, { cors: true });
  // Adiciona prefixo global para todas as rotas
  app.setGlobalPrefix('api');
  app.enableCors();
  // Swagger
  const config = new DocumentBuilder()
    .setTitle('DExpress')
    .setDescription('Plataforma online que conecta famílias a profissionais domésticos qualificados em Luanda')
    .setVersion('1.0')
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document);

  // Ativa a validação automática nos DTOs
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // Remove campos que não estão no DTO
      forbidNonWhitelisted: true, // Lança erro se um campo extra for enviado
      transform: true, // Converte os tipos automaticamente (ex: string para Date)
    }),
  );
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
