import { TypeOrmModuleOptions } from '@nestjs/typeorm';

export const getCatalogDatabaseConfig = (): TypeOrmModuleOptions => ({
  type: 'postgres',
  host: process.env.CATALOG_DB_HOST || 'localhost',
  port: parseInt(process.env.CATALOG_DB_PORT || '5433', 10),
  username: process.env.CATALOG_DB_USERNAME || 'postgres',
  password: process.env.CATALOG_DB_PASSWORD || 'password',
  database: process.env.CATALOG_DB_NAME || 'catalog_db',
  entities: [__dirname + '/../../**/*.entity{.ts,.js}'],
  synchronize: process.env.NODE_ENV === 'development',
  logging: process.env.NODE_ENV === 'development',
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
});