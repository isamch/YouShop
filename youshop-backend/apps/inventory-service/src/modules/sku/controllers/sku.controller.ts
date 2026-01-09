import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiQuery } from '@nestjs/swagger';
import { SkuService } from '../services/sku.service';
import { CreateSkuDto } from '../dto/create-sku.dto';
import { UpdateSkuDto } from '../dto/update-sku.dto';

@ApiTags('sku')
@Controller('sku')
export class SkuController {
  constructor(private readonly skuService: SkuService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new SKU' })
  @ApiResponse({ status: 201, description: 'SKU created successfully' })
  create(@Body() createSkuDto: CreateSkuDto) {
    return this.skuService.create(createSkuDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all SKUs' })
  @ApiResponse({ status: 200, description: 'SKUs retrieved successfully' })
  findAll() {
    return this.skuService.findAll();
  }

  @Get('product/:productId')
  @ApiOperation({ summary: 'Get SKUs by product ID' })
  @ApiResponse({ status: 200, description: 'SKUs retrieved successfully' })
  findByProductId(@Param('productId') productId: string) {
    return this.skuService.findByProductId(productId);
  }

  @Get('low-stock')
  @ApiOperation({ summary: 'Get low stock SKUs' })
  @ApiResponse({ status: 200, description: 'Low stock SKUs retrieved successfully' })
  @ApiQuery({ name: 'threshold', required: false, type: Number })
  getLowStockSkus(@Query('threshold') threshold?: number) {
    return this.skuService.getLowStockSkus(threshold);
  }

  @Get('code/:code')
  @ApiOperation({ summary: 'Get SKU by code' })
  @ApiResponse({ status: 200, description: 'SKU retrieved successfully' })
  @ApiResponse({ status: 404, description: 'SKU not found' })
  findByCode(@Param('code') code: string) {
    return this.skuService.findByCode(code);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get SKU by ID' })
  @ApiResponse({ status: 200, description: 'SKU retrieved successfully' })
  @ApiResponse({ status: 404, description: 'SKU not found' })
  findOne(@Param('id') id: string) {
    return this.skuService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update SKU' })
  @ApiResponse({ status: 200, description: 'SKU updated successfully' })
  @ApiResponse({ status: 404, description: 'SKU not found' })
  update(@Param('id') id: string, @Body() updateSkuDto: UpdateSkuDto) {
    return this.skuService.update(id, updateSkuDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete SKU (soft delete)' })
  @ApiResponse({ status: 200, description: 'SKU deleted successfully' })
  @ApiResponse({ status: 404, description: 'SKU not found' })
  remove(@Param('id') id: string) {
    return this.skuService.remove(id);
  }
}