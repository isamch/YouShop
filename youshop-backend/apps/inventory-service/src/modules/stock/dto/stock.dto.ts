import { IsString, IsNumber, IsOptional, IsUUID, IsEnum } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { StockMovementType } from '../entities/stock.entity';

export class CreateStockDto {
  @ApiProperty({ example: 'uuid-sku-id' })
  @IsUUID()
  skuId: string;

  @ApiProperty({ example: 'warehouse-001' })
  @IsString()
  locationId: string;

  @ApiProperty({ example: 100 })
  @IsNumber()
  @Type(() => Number)
  availableQuantity: number;

  @ApiPropertyOptional({ example: 10 })
  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  reorderPoint?: number;

  @ApiPropertyOptional({ example: 1000 })
  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  maxStock?: number;
}

export class UpdateStockDto {
  @ApiPropertyOptional({ example: 150 })
  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  availableQuantity?: number;

  @ApiPropertyOptional({ example: 15 })
  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  reorderPoint?: number;

  @ApiPropertyOptional({ example: 1500 })
  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  maxStock?: number;
}

export class ReserveStockDto {
  @ApiProperty({ example: 'uuid-sku-id' })
  @IsUUID()
  skuId: string;

  @ApiProperty({ example: 'uuid-order-id' })
  @IsUUID()
  orderId: string;

  @ApiProperty({ example: 2 })
  @IsNumber()
  @Type(() => Number)
  quantity: number;

  @ApiProperty({ example: 'uuid-user-id' })
  @IsUUID()
  reservedBy: string;

  @ApiPropertyOptional({ example: 30 })
  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  expirationMinutes?: number;
}

export class ReleaseStockDto {
  @ApiProperty({ example: 'uuid-reservation-id' })
  @IsUUID()
  reservationId: string;

  @ApiPropertyOptional({ example: 'Order cancelled' })
  @IsOptional()
  @IsString()
  reason?: string;
}

export class AdjustStockDto {
  @ApiProperty({ example: 'uuid-sku-id' })
  @IsUUID()
  skuId: string;

  @ApiProperty({ example: 'warehouse-001' })
  @IsString()
  locationId: string;

  @ApiProperty({ example: 10 })
  @IsNumber()
  @Type(() => Number)
  quantity: number;

  @ApiProperty({ 
    example: StockMovementType.ADJUSTMENT,
    enum: StockMovementType 
  })
  @IsEnum(StockMovementType)
  type: StockMovementType;

  @ApiProperty({ example: 'uuid-user-id' })
  @IsUUID()
  performedBy: string;

  @ApiPropertyOptional({ example: 'Stock count adjustment' })
  @IsOptional()
  @IsString()
  reason?: string;

  @ApiPropertyOptional({ example: 'Physical inventory count' })
  @IsOptional()
  @IsString()
  notes?: string;
}