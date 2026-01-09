import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { HttpClientService } from './services/http-client.service';
import { AuthProxyController } from './controllers/auth-proxy.controller';
import { CatalogProxyController } from './controllers/catalog-proxy.controller';
import { InventoryProxyController } from './controllers/inventory-proxy.controller';
import { OrdersProxyController } from './controllers/orders-proxy.controller';
import { HealthController } from './controllers/health.controller';

@Module({
  imports: [
    HttpModule.register({
      timeout: 10000,
      maxRedirects: 5,
    }),
  ],
  controllers: [
    AuthProxyController,
    CatalogProxyController,
    InventoryProxyController,
    OrdersProxyController,
    HealthController,
  ],
  providers: [HttpClientService],
  exports: [HttpClientService],
})
export class ProxyModule {}