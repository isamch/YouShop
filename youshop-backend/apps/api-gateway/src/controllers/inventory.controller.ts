import { Controller, Post, Get, Patch, Delete, Body, Param, Query, Headers } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { SimpleHttpService } from '../services/http.service';

@ApiTags('inventory')
@Controller('inventory')
export class InventoryController {
  constructor(private readonly httpService: SimpleHttpService) {}

  // SKU endpoints
  @Post('sku')
  @ApiOperation({ summary: 'Create SKU' })
  async createSku(@Body() createSkuDto: any, @Headers('authorization') auth: string) {
    return this.httpService.post('inventory-service/sku', createSkuDto, { authorization: auth });
  }

  @Get('sku')
  @ApiOperation({ summary: 'Get all SKUs' })
  async getAllSkus(@Query() query: any, @Headers('authorization') auth: string) {
    const queryString = new URLSearchParams(query).toString();
    return this.httpService.get(`inventory-service/sku?${queryString}`, { authorization: auth });
  }

  @Get('sku/:id')
  @ApiOperation({ summary: 'Get SKU by ID' })
  async getSku(@Param('id') id: string, @Headers('authorization') auth: string) {
    return this.httpService.get(`inventory-service/sku/${id}`, { authorization: auth });
  }

  @Patch('sku/:id')
  @ApiOperation({ summary: 'Update SKU' })
  async updateSku(@Param('id') id: string, @Body() updateSkuDto: any, @Headers('authorization') auth: string) {
    return this.httpService.patch(`inventory-service/sku/${id}`, updateSkuDto, { authorization: auth });
  }

  @Delete('sku/:id')
  @ApiOperation({ summary: 'Delete SKU' })
  async deleteSku(@Param('id') id: string, @Headers('authorization') auth: string) {
    return this.httpService.delete(`inventory-service/sku/${id}`, { authorization: auth });
  }

  // Stock endpoints
  @Get('stock')
  @ApiOperation({ summary: 'Get stock levels' })
  async getStock(@Query() query: any, @Headers('authorization') auth: string) {
    const queryString = new URLSearchParams(query).toString();
    return this.httpService.get(`inventory-service/stock?${queryString}`, { authorization: auth });
  }

  @Get('stock/:skuId')
  @ApiOperation({ summary: 'Get stock by SKU ID' })
  async getStockBySku(@Param('skuId') skuId: string, @Headers('authorization') auth: string) {
    return this.httpService.get(`inventory-service/stock/${skuId}`, { authorization: auth });
  }

  @Patch('stock/:skuId')
  @ApiOperation({ summary: 'Update stock level' })
  async updateStock(@Param('skuId') skuId: string, @Body() stockDto: any, @Headers('authorization') auth: string) {
    return this.httpService.patch(`inventory-service/stock/${skuId}`, stockDto, { authorization: auth });
  }

  @Post('stock/reserve')
  @ApiOperation({ summary: 'Reserve stock' })
  async reserveStock(@Body() reserveDto: any, @Headers('authorization') auth: string) {
    return this.httpService.post('inventory-service/stock/reserve', reserveDto, { authorization: auth });
  }

  @Post('stock/release')
  @ApiOperation({ summary: 'Release stock reservation' })
  async releaseStock(@Body() releaseDto: any, @Headers('authorization') auth: string) {
    return this.httpService.post('inventory-service/stock/release', releaseDto, { authorization: auth });
  }
}