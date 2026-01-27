import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { getCatalogDatabaseConfig } from '@youshop/database';
import { CategoriesModule } from './modules/categories/categories.module';
import { ProductsModule } from './modules/products/products.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    TypeOrmModule.forRootAsync({
      useFactory: getCatalogDatabaseConfig,
    }),
    CategoriesModule,
    ProductsModule,
  ],
  controllers: [],
  providers: [],
})
export class CatalogServiceModule { }
