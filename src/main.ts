import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  // Abilitar o cors
  app.enableCors();
    // Configuração da documentação
  const config = new DocumentBuilder()
    .setTitle('DExpress')
    .setDescription('Plataforma online que conecte famílias a profissionais domésticos qualificados em Luanda')
    .setVersion('1.0')
    .addBearerAuth() // Se estiver usando JWT
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document); // http://localhost:3000/api/docs


  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
