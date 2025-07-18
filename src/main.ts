import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Middleware para garantir que CORS funcione em QUALQUER rota e bypass do Render/Cloudflare
app.enableCors({
  origin: '*', // ou '*' para testes
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
})

  // Swagger
  const config = new DocumentBuilder()
    .setTitle('DExpress')
    .setDescription(
      'Plataforma online que conecta famílias a profissionais domésticos qualificados em Luanda'
    )
    .setVersion('1.0')
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document);

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
