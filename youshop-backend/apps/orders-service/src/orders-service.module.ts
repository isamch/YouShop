import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { getOrdersDatabaseConfig } from '@youshop/database';
import { OrdersModule } from './modules/orders/orders.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    TypeOrmModule.forRootAsync({
      useFactory: getOrdersDatabaseConfig,
    }),
    OrdersModule,
  ],
  controllers: [],
  providers: [],
})
export class OrdersServiceModule {}
