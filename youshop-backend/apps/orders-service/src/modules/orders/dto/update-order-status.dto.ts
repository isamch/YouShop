import { IsEnum, IsOptional, IsString, IsUUID } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { OrderStatus } from '../entities/order.entity';

export class UpdateOrderStatusDto {
  @ApiProperty({ 
    example: OrderStatus.CONFIRMED,
    enum: OrderStatus 
  })
  @IsEnum(OrderStatus)
  status: OrderStatus;

  @ApiPropertyOptional({ example: 'Customer confirmed payment' })
  @IsOptional()
  @IsString()
  reason?: string;

  @ApiPropertyOptional({ example: 'Additional notes about status change' })
  @IsOptional()
  @IsString()
  notes?: string;

  @ApiProperty({ example: 'uuid-user-id' })
  @IsUUID()
  changedBy: string;
}

export class CancelOrderDto {
  @ApiProperty({ example: 'Customer requested cancellation' })
  @IsString()
  reason: string;

  @ApiPropertyOptional({ example: 'Customer changed mind' })
  @IsOptional()
  @IsString()
  notes?: string;

  @ApiProperty({ example: 'uuid-user-id' })
  @IsUUID()
  cancelledBy: string;
}

export class ShipOrderDto {
  @ApiProperty({ example: 'TRK123456789' })
  @IsString()
  trackingNumber: string;

  @ApiPropertyOptional({ example: 'Shipped via FedEx' })
  @IsOptional()
  @IsString()
  notes?: string;

  @ApiProperty({ example: 'uuid-user-id' })
  @IsUUID()
  shippedBy: string;
}