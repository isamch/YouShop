import { Controller, Post, Get, Patch, Body, Param, Query, Headers } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { SimpleHttpService } from '../services/http.service';

@ApiTags('orders')
@Controller('orders')
export class OrdersController {
  constructor(private readonly httpService: SimpleHttpService) {}

  @Post()
  @ApiOperation({ summary: 'Create new order' })
  async createOrder(@Body() createOrderDto: any, @Headers('authorization') auth: string) {
    return this.httpService.post('orders-service/orders', createOrderDto, { authorization: auth });
  }

  @Get()
  @ApiOperation({ summary: 'Get all orders' })
  async getAllOrders(@Query() query: any, @Headers('authorization') auth: string) {
    const queryString = new URLSearchParams(query).toString();
    return this.httpService.get(`orders-service/orders?${queryString}`, { authorization: auth });
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get order by ID' })
  async getOrder(@Param('id') id: string, @Headers('authorization') auth: string) {
    return this.httpService.get(`orders-service/orders/${id}`, { authorization: auth });
  }

  @Get('number/:orderNumber')
  @ApiOperation({ summary: 'Get order by number' })
  async getOrderByNumber(@Param('orderNumber') orderNumber: string, @Headers('authorization') auth: string) {
    return this.httpService.get(`orders-service/orders/number/${orderNumber}`, { authorization: auth });
  }

  @Get(':id/history')
  @ApiOperation({ summary: 'Get order history' })
  async getOrderHistory(@Param('id') id: string, @Headers('authorization') auth: string) {
    return this.httpService.get(`orders-service/orders/${id}/history`, { authorization: auth });
  }

  @Patch(':id/status')
  @ApiOperation({ summary: 'Update order status' })
  async updateOrderStatus(@Param('id') id: string, @Body() updateStatusDto: any, @Headers('authorization') auth: string) {
    return this.httpService.patch(`orders-service/orders/${id}/status`, updateStatusDto, { authorization: auth });
  }

  @Patch(':id/cancel')
  @ApiOperation({ summary: 'Cancel order' })
  async cancelOrder(@Param('id') id: string, @Body() cancelOrderDto: any, @Headers('authorization') auth: string) {
    return this.httpService.patch(`orders-service/orders/${id}/cancel`, cancelOrderDto, { authorization: auth });
  }

  @Patch(':id/ship')
  @ApiOperation({ summary: 'Ship order' })
  async shipOrder(@Param('id') id: string, @Body() shipOrderDto: any, @Headers('authorization') auth: string) {
    return this.httpService.patch(`orders-service/orders/${id}/ship`, shipOrderDto, { authorization: auth });
  }
}