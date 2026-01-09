import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { getInventoryDatabaseConfig } from '@youshop/database';
import { SkuModule } from './modules/sku/sku.module';
import { StockModule } from './modules/stock/stock.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    TypeOrmModule.forRootAsync({
      useFactory: getInventoryDatabaseConfig,
    }),
    SkuModule,
    StockModule,
  ],
  controllers: [],
  providers: [],
})
export class InventoryServiceModule {}
