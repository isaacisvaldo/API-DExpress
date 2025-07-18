import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Habilitar CORS para todas as origens (com suporte a cookies/autenticação)
  app.enableCors({
    origin: (origin, callback) => {
      callback(null, origin || '*'); // Aceita qualquer origem
    },
    credentials: true, // Necessário para autenticação/cookies
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    allowedHeaders: '*',
  });

  // Configuração do Swagger
  const config = new DocumentBuilder()
    .setTitle('DExpress')
    .setDescription('Plataforma online que conecta famílias a profissionais domésticos qualificados em Luanda')
    .setVersion('1.0')
    .addBearerAuth() // Suporte a JWT
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document); // Documentação: http://localhost:3000/api/docs

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
