import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { getAuthDatabaseConfig } from '@youshop/database';
import { AuthModule } from './modules/auth/auth.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    TypeOrmModule.forRootAsync({
      useFactory: getAuthDatabaseConfig,
    }),
    AuthModule,
  ],
  controllers: [],
  providers: [],
})
export class AuthServiceModule {}
