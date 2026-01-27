import { Controller, Post, Get, Patch, Delete, Body, Param, Query, Headers } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { SimpleHttpService } from '../services/http.service';

@ApiTags('catalog')
@Controller('catalog')
export class CatalogController {
  constructor(private readonly httpService: SimpleHttpService) {}

  // Products endpoints
  @Post('products')
  @ApiOperation({ summary: 'Create product' })
  async createProduct(@Body() createProductDto: any, @Headers('authorization') auth: string) {
    return this.httpService.post('catalog-service/products', createProductDto, { authorization: auth });
  }

  @Get('products')
  @ApiOperation({ summary: 'Get all products' })
  async getAllProducts(@Query() query: any) {
    const queryString = new URLSearchParams(query).toString();
    return this.httpService.get(`catalog-service/products?${queryString}`);
  }

  @Get('products/:id')
  @ApiOperation({ summary: 'Get product by ID' })
  async getProduct(@Param('id') id: string) {
    return this.httpService.get(`catalog-service/products/${id}`);
  }

  @Patch('products/:id')
  @ApiOperation({ summary: 'Update product' })
  async updateProduct(@Param('id') id: string, @Body() updateProductDto: any, @Headers('authorization') auth: string) {
    return this.httpService.patch(`catalog-service/products/${id}`, updateProductDto, { authorization: auth });
  }

  @Delete('products/:id')
  @ApiOperation({ summary: 'Delete product' })
  async deleteProduct(@Param('id') id: string, @Headers('authorization') auth: string) {
    return this.httpService.delete(`catalog-service/products/${id}`, { authorization: auth });
  }

  // Categories endpoints
  @Post('categories')
  @ApiOperation({ summary: 'Create category' })
  async createCategory(@Body() createCategoryDto: any, @Headers('authorization') auth: string) {
    return this.httpService.post('catalog-service/categories', createCategoryDto, { authorization: auth });
  }

  @Get('categories')
  @ApiOperation({ summary: 'Get all categories' })
  async getAllCategories() {
    return this.httpService.get('catalog-service/categories');
  }

  @Get('categories/:id')
  @ApiOperation({ summary: 'Get category by ID' })
  async getCategory(@Param('id') id: string) {
    return this.httpService.get(`catalog-service/categories/${id}`);
  }

  @Patch('categories/:id')
  @ApiOperation({ summary: 'Update category' })
  async updateCategory(@Param('id') id: string, @Body() updateCategoryDto: any, @Headers('authorization') auth: string) {
    return this.httpService.patch(`catalog-service/categories/${id}`, updateCategoryDto, { authorization: auth });
  }

  @Delete('categories/:id')
  @ApiOperation({ summary: 'Delete category' })
  async deleteCategory(@Param('id') id: string, @Headers('authorization') auth: string) {
    return this.httpService.delete(`catalog-service/categories/${id}`, { authorization: auth });
  }
}