import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { json } from 'express';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger: ['log', 'warn', 'error'],
  });
  app.enableShutdownHooks();
  app.use(json({ limit: '10mb' }));
  const port = process.env.PORT ? Number(process.env.PORT) : 3000;
  await app.listen(port);
  // eslint-disable-next-line no-undef
  console.log(`API running on port ${port}`);

  const config = new DocumentBuilder()
    .setTitle('DevGuard API')
    .setDescription('API documentation for the DevGuard Authentication Service')
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

  SwaggerModule.setup('api/docs', app, document);
}
bootstrap();
