import { NestFactory } from '@nestjs/core';
import { PaymentServiceModule } from './payment-service.module';

async function bootstrap() {
  const app = await NestFactory.create(PaymentServiceModule);
  
  app.enableCors();
  app.setGlobalPrefix('api');
  
  const port = process.env.PAYMENT_SERVICE_PORT || 3005;
  await app.listen(port);
  
  console.log(`💳 Payment Service running on port ${port}`);
}

bootstrap();