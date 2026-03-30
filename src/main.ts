import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger } from 'nestjs-pino';
import { json } from 'express';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableCors({
    origin: '*', // tüm domainler
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    allowedHeaders: '*',
    credentials: false, // '*' ile true OLMAZ
  });

  //! Logger
  const logger = app.get(Logger);
  app.useLogger(logger);
  //! Logger -- Son

  app.use(json({ limit: '10mb' }));

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // Accept only DTO defined fields
      forbidNonWhitelisted: true, // Reject fields that are not in the DTO
      transform: true, // Transform the incoming data to the DTO type automatically
      transformOptions: {
        enableImplicitConversion: true, // Convert strings to numbers automatically
      },
    }),
  );

  /**
   * Swagger (only dev & test)
   */
  const NODE_ENV = process.env.NODE_ENV ?? 'test';
  console.log('NODE_ENV:', NODE_ENV);

  if (NODE_ENV === 'development' || NODE_ENV === 'test') {
    console.log('Swagger Çalışıyor');

    // Hide Swagger in production and test

    const config = new DocumentBuilder()
      .setTitle('Ethereum Takip Module')
      .setDescription('Ethereum Takip Module  API Dokümantasyonudur.')
      .setVersion('1.0')

      .addApiKey(
        { type: 'apiKey', name: 'x-api-key', in: 'header' },
        'x-api-key',
      )

      .addTag('Firebase Notification')
      .addTag('Log Management')
      .addTag('Transaction Management')

      .build();

    const documentFactory = () => {
      const document = SwaggerModule.createDocument(app, config);
      return document;
    };
    SwaggerModule.setup('docs', app, documentFactory);
  }

  // Swagger  --- Son

  // Start the microservice
  await app.startAllMicroservices();

  const port = process.env.PORT ?? 3001;
  await app.listen(port);

  logger.log(`Application is running on: http://localhost:${port}`, {
    id: Date.now(),
  });
  logger.log(`Swagger docs available at: http://localhost:${port}/docs`, {
    id: Date.now(),
  });
}
void bootstrap();
