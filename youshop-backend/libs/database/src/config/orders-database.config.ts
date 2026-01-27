import { TypeOrmModuleOptions } from '@nestjs/typeorm';

export const getOrdersDatabaseConfig = (): TypeOrmModuleOptions => ({
  type: 'postgres',
  host: process.env.ORDERS_DB_HOST || 'localhost',
  port: parseInt(process.env.ORDERS_DB_PORT || '5435', 10),
  username: process.env.ORDERS_DB_USERNAME || 'postgres',
  password: process.env.ORDERS_DB_PASSWORD || 'password',
  database: process.env.ORDERS_DB_NAME || 'orders_db',
  entities: [__dirname + '/../**/*.entity{.ts,.js}'],
  synchronize: process.env.NODE_ENV === 'development',
  logging: process.env.NODE_ENV === 'development',
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
  autoLoadEntities: true,
});