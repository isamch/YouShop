import { IsString, IsNumber, IsOptional, IsUUID } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';

export class CreateStockDto {
  @ApiProperty({ example: 'uuid-sku-id' })
  @IsUUID()
  skuId: string;

  @ApiProperty({ example: 100 })
  @IsNumber()
  @Type(() => Number)
  quantity: number;
}

export class UpdateStockDto {
  @ApiPropertyOptional({ example: 150 })
  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  availableQuantity?: number;
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
}

export class ReleaseStockDto {
  @ApiProperty({ example: 'uuid-sku-id' })
  @IsUUID()
  skuId: string;

  @ApiProperty({ example: 2 })
  @IsNumber()
  @Type(() => Number)
  quantity: number;
}

export class AdjustStockDto {
  @ApiProperty({ example: 'uuid-sku-id' })
  @IsUUID()
  skuId: string;

  @ApiProperty({ example: 10 })
  @IsNumber()
  @Type(() => Number)
  quantity: number;

  @ApiPropertyOptional({ example: 'Stock count adjustment' })
  @IsOptional()
  @IsString()
  reason?: string;
}