import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { json } from 'express';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { NestExpressApplication } from '@nestjs/platform-express';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule, {
    logger: ['log', 'warn', 'error'],
  });

  app.enableCors({
    origin: ['http://localhost:3001', 'http://localhost:3002'],
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'x-api-key'],
  });

  app.enableShutdownHooks();
  app.use(json({ limit: '10mb' }));

  const port = process.env.PORT ? Number(process.env.PORT) : 3000;
  await app.listen(port);
  // eslint-disable-next-line no-undef
  console.log(`API running on port ${port}`);

  const config = new DocumentBuilder()
    .setTitle('AuthGuard API')
    .setDescription('Comprehensive authentication and authorization service')
    .setVersion('1.0')
    .addBearerAuth()
    .addApiKey(
      {
        type: 'apiKey',
        name: 'x-api-key',
        in: 'header',
        description:
          'API key for SDK integration. Get your API key from the dashboard.',
      },
      'api-key',
    )
    .addTag('Authentication', 'User authentication and session management')
    .addTag('API Keys', 'Developer API key management for SDK integration')
    .addTag('Sessions', 'User session management and tracking')
    .addTag('Users', 'User profile and account management')
    .build();

  const document = SwaggerModule.createDocument(app, config);

  SwaggerModule.setup('api/swagger', app, document);
}
bootstrap();
