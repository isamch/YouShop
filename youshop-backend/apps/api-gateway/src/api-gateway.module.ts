import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { HttpModule } from '@nestjs/axios';
import { AuthController } from './controllers/auth.controller';
import { OrdersController } from './controllers/orders.controller';
import { CatalogController } from './controllers/catalog.controller';
import { InventoryController } from './controllers/inventory.controller';
import { PaymentsController } from './controllers/payments.controller';
import { SimpleHttpService } from './services/http.service';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    HttpModule,
  ],
  controllers: [
    AuthController,
    OrdersController,
    CatalogController,
    InventoryController,
    PaymentsController,
  ],
  providers: [SimpleHttpService],
})
export class ApiGatewayModule {}
