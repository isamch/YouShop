import { Controller, Get, Post, Body, Param, Query } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiQuery } from '@nestjs/swagger';
import { StockService } from '../services/stock.service';
import { CreateStockDto, ReserveStockDto, ReleaseStockDto, AdjustStockDto } from '../dto/stock.dto';

@ApiTags('stock')
@Controller('stock')
export class StockController {
  constructor(private readonly stockService: StockService) { }

  @Post()
  @ApiOperation({ summary: 'Create stock for SKU' })
  @ApiResponse({ status: 201, description: 'Stock created successfully' })
  createStock(@Body() createStockDto: CreateStockDto) {
    return this.stockService.createStock(createStockDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all stock items' })
  @ApiResponse({ status: 200, description: 'Stock items retrieved successfully' })
  @ApiQuery({ name: 'skuId', required: false, type: String })
  findAll(@Query('skuId') skuId?: string) {
    if (skuId) {
      return this.stockService.findBySkuId(skuId);
    }
    // Return all stock items (you may want to add pagination here)
    return this.stockService.getLowStockItems(999999); // Temporary: returns all items
  }

  @Post('reserve')
  @ApiOperation({ summary: 'Reserve stock for order' })
  @ApiResponse({ status: 201, description: 'Stock reserved successfully' })
  reserveStock(@Body() reserveStockDto: ReserveStockDto) {
    return this.stockService.reserveStock(reserveStockDto);
  }

  @Post('release')
  @ApiOperation({ summary: 'Release reserved stock' })
  @ApiResponse({ status: 200, description: 'Stock released successfully' })
  releaseStock(@Body() releaseStockDto: ReleaseStockDto) {
    return this.stockService.releaseStock(releaseStockDto);
  }

  @Post('adjust')
  @ApiOperation({ summary: 'Adjust stock quantity' })
  @ApiResponse({ status: 200, description: 'Stock adjusted successfully' })
  adjustStock(@Body() adjustStockDto: AdjustStockDto) {
    return this.stockService.adjustStock(adjustStockDto);
  }

  @Get('sku/:skuId')
  @ApiOperation({ summary: 'Get stock by SKU ID' })
  @ApiResponse({ status: 200, description: 'Stock retrieved successfully' })
  findBySkuId(@Param('skuId') skuId: string) {
    return this.stockService.findBySkuId(skuId);
  }

  @Get('low-stock')
  @ApiOperation({ summary: 'Get low stock items' })
  @ApiResponse({ status: 200, description: 'Low stock items retrieved successfully' })
  @ApiQuery({ name: 'threshold', required: false, type: Number })
  getLowStockItems(@Query('threshold') threshold?: number) {
    return this.stockService.getLowStockItems(threshold);
  }

  @Get('movements/:stockId')
  @ApiOperation({ summary: 'Get stock movements history' })
  @ApiResponse({ status: 200, description: 'Stock movements retrieved successfully' })
  getStockMovements(@Param('stockId') stockId: string) {
    return this.stockService.getStockMovements(stockId);
  }
}