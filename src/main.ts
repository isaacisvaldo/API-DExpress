import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Middleware para garantir que todos os headers CORS sejam enviados
  app.use((req, res, next) => {
    const origin = req.headers.origin || '*';
    res.header('Access-Control-Allow-Origin', origin);
    res.header('Access-Control-Allow-Credentials', 'true');
    res.header('Access-Control-Allow-Methods', 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS');
    res.header(
      'Access-Control-Allow-Headers',
      req.headers['access-control-request-headers'] || '*'
    );

    if (req.method === 'OPTIONS') {
      return res.sendStatus(204); // Responde ao preflight sem bloquear
    }
    next();
  });

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

  // Inicia servidor
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
