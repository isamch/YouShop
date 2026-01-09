import { NestFactory } from '@nestjs/core';
import { ApiGatewayModule } from './api-gateway.module';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(ApiGatewayModule);
  
  app.setGlobalPrefix('api');
  
  // Enable CORS
  app.enableCors({
    origin: process.env.CORS_ORIGIN || '*',
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    credentials: true,
  });
  
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  // Swagger setup
  const config = new DocumentBuilder()
    .setTitle('YouShop API Gateway')
    .setDescription('Unified API Gateway for YouShop E-commerce Platform')
    .setVersion('1.0')
    .addBearerAuth()
    .addServer('http://localhost:3000', 'Development')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document);

  const port = process.env.API_GATEWAY_PORT || 3000;
  await app.listen(port);
  
  console.log(`API Gateway is running on: http://localhost:${port}/api`);
  console.log(`Swagger docs available at: http://localhost:${port}/api/docs`);
  console.log('\n🚀 YouShop E-commerce Platform is ready!');
  console.log('\n📋 Available Services:');
  console.log('   • Auth Service: http://localhost:3001/api');
  console.log('   • Catalog Service: http://localhost:3002/api');
  console.log('   • Inventory Service: http://localhost:3003/api');
  console.log('   • Orders Service: http://localhost:3004/api');
}
bootstrap();
