import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  app.useGlobalPipes(new ValidationPipe({
    whitelist: true,
    forbidNonWhitelisted: true,
    transform: true,
  }));

  app.enableCors({
    origin: '*'
  });

  const config = new DocumentBuilder()
    .setTitle('NestJS Financial Alerts API')
    .setDescription('API documentation for financial alerts system with comprehensive schema')
    .setVersion('1.0')
    .addTag('Health', 'System health endpoints')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  
  // Setup interactive Swagger UI
  SwaggerModule.setup('api/docs', app, document);
  
  // Add JSON endpoint for OpenAPI specification
  app.getHttpAdapter().get('/api/docs-json', (req, res) => {
    res.setHeader('Content-Type', 'application/json');
    res.send(document);
  });

  const port = process.env.PORT || 3000;
  const host = process.env.HOST || '0.0.0.0';
  
  await app.listen(port, host);
  console.log(`Application is running on: http://${host}:${port}`);
  console.log(`Swagger docs available at: http://${host}:${port}/api/docs`);
  console.log(`Swagger JSON available at: http://${host}:${port}/api/docs-json`);
}

bootstrap();
