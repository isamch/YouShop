import { TypeOrmModuleOptions } from '@nestjs/typeorm';

export const getInventoryDatabaseConfig = (): TypeOrmModuleOptions => ({
  type: 'postgres',
  host: process.env.INVENTORY_DB_HOST || 'localhost',
  port: parseInt(process.env.INVENTORY_DB_PORT || '5434', 10),
  username: process.env.INVENTORY_DB_USERNAME || 'postgres',
  password: process.env.INVENTORY_DB_PASSWORD || 'password',
  database: process.env.INVENTORY_DB_NAME || 'inventory_db',
  entities: [__dirname + '/../**/*.entity{.ts,.js}'],
  synchronize: false,
  logging: process.env.NODE_ENV === 'development',
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
  autoLoadEntities: true,
});