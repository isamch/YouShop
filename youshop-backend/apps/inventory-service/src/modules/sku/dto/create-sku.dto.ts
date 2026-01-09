import { IsString, IsNumber, IsOptional, IsBoolean, IsArray, IsUUID, IsObject } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';

export class CreateSkuDto {
  @ApiProperty({ example: 'IPH15PRO-256-BLK' })
  @IsString()
  code: string;

  @ApiProperty({ example: 'uuid-product-id' })
  @IsUUID()
  productId: string;

  @ApiProperty({ example: 'iPhone 15 Pro 256GB Black' })
  @IsString()
  name: string;

  @ApiPropertyOptional({ example: 'iPhone 15 Pro with 256GB storage in Black' })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({ example: 1199.99 })
  @IsNumber()
  @Type(() => Number)
  price: number;

  @ApiPropertyOptional({ example: 1299.99 })
  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  compareAtPrice?: number;

  @ApiPropertyOptional({ example: '1234567890123' })
  @IsOptional()
  @IsString()
  barcode?: string;

  @ApiPropertyOptional({ example: 0.206 })
  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  weight?: number;

  @ApiPropertyOptional({ example: '15.1 x 7.1 x 0.8 cm' })
  @IsOptional()
  @IsString()
  dimensions?: string;

  @ApiPropertyOptional({ example: ['image1.jpg', 'image2.jpg'] })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  images?: string[];

  @ApiPropertyOptional({ 
    example: { color: 'Black', storage: '256GB', model: 'Pro' }
  })
  @IsOptional()
  @IsObject()
  attributes?: Record<string, any>;

  @ApiPropertyOptional({ example: true })
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;

  @ApiPropertyOptional({ example: true })
  @IsOptional()
  @IsBoolean()
  trackQuantity?: boolean;

  @ApiPropertyOptional({ example: false })
  @IsOptional()
  @IsBoolean()
  allowBackorder?: boolean;
}