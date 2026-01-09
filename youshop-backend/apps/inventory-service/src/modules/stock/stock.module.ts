import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { StockService } from './services/stock.service';
import { StockController } from './controllers/stock.controller';
import { Stock, StockMovement } from './entities/stock.entity';
import { StockReservation } from './entities/stock-reservation.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Stock, StockMovement, StockReservation])],
  controllers: [StockController],
  providers: [StockService],
  exports: [StockService],
})
export class StockModule {}