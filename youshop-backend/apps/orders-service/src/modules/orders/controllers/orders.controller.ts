import { Controller, Get, Post, Body, Patch, Param, Query } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiQuery } from '@nestjs/swagger';
import { OrdersService, OrderFilters, PaginationOptions } from '../services/orders.service';
import { CreateOrderDto } from '../dto/create-order.dto';
import { UpdateOrderStatusDto, CancelOrderDto, ShipOrderDto } from '../dto/update-order-status.dto';
import { OrderStatus, PaymentStatus } from '../entities/order.entity';

@ApiTags('orders')
@Controller('orders')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) { }

  @Post()
  @ApiOperation({ summary: 'Create a new order' })
  @ApiResponse({ status: 201, description: 'Order created successfully' })
  create(@Body() createOrderDto: CreateOrderDto) {
    return this.ordersService.create(createOrderDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all orders with filters and pagination' })
  @ApiResponse({ status: 200, description: 'Orders retrieved successfully' })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  @ApiQuery({ name: 'userId', required: false, type: String })
  @ApiQuery({ name: 'status', required: false, enum: OrderStatus })
  @ApiQuery({ name: 'paymentStatus', required: false, enum: PaymentStatus })
  @ApiQuery({ name: 'dateFrom', required: false, type: Date })
  @ApiQuery({ name: 'dateTo', required: false, type: Date })
  findAll(
    @Query('page') page?: string,
    @Query('limit') limit?: string,
    @Query('userId') userId?: string,
    @Query('status') status?: OrderStatus,
    @Query('paymentStatus') paymentStatus?: PaymentStatus,
    @Query('dateFrom') dateFrom?: Date,
    @Query('dateTo') dateTo?: Date,
  ) {
    const filters: OrderFilters = {
      userId,
      status,
      paymentStatus,
      dateFrom,
      dateTo,
    };
    const pagination: PaginationOptions = {
      page: page ? Number(page) : undefined,
      limit: limit ? Number(limit) : undefined
    };

    return this.ordersService.findAll(filters, pagination);
  }

  @Get('number/:orderNumber')
  @ApiOperation({ summary: 'Get order by order number' })
  @ApiResponse({ status: 200, description: 'Order retrieved successfully' })
  @ApiResponse({ status: 404, description: 'Order not found' })
  findByOrderNumber(@Param('orderNumber') orderNumber: string) {
    return this.ordersService.findByOrderNumber(orderNumber);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get order by ID' })
  @ApiResponse({ status: 200, description: 'Order retrieved successfully' })
  @ApiResponse({ status: 404, description: 'Order not found' })
  findOne(@Param('id') id: string) {
    return this.ordersService.findOne(id);
  }

  @Get(':id/history')
  @ApiOperation({ summary: 'Get order status history' })
  @ApiResponse({ status: 200, description: 'Order history retrieved successfully' })
  getOrderHistory(@Param('id') id: string) {
    return this.ordersService.getOrderHistory(id);
  }

  @Patch(':id/status')
  @ApiOperation({ summary: 'Update order status' })
  @ApiResponse({ status: 200, description: 'Order status updated successfully' })
  @ApiResponse({ status: 400, description: 'Invalid status transition' })
  @ApiResponse({ status: 404, description: 'Order not found' })
  updateStatus(@Param('id') id: string, @Body() updateStatusDto: UpdateOrderStatusDto) {
    return this.ordersService.updateStatus(id, updateStatusDto);
  }

  @Patch(':id/cancel')
  @ApiOperation({ summary: 'Cancel order' })
  @ApiResponse({ status: 200, description: 'Order cancelled successfully' })
  @ApiResponse({ status: 400, description: 'Cannot cancel order' })
  @ApiResponse({ status: 404, description: 'Order not found' })
  cancelOrder(@Param('id') id: string, @Body() cancelOrderDto: CancelOrderDto) {
    return this.ordersService.cancelOrder(id, cancelOrderDto);
  }

  @Patch(':id/ship')
  @ApiOperation({ summary: 'Ship order' })
  @ApiResponse({ status: 200, description: 'Order shipped successfully' })
  @ApiResponse({ status: 400, description: 'Cannot ship order' })
  @ApiResponse({ status: 404, description: 'Order not found' })
  shipOrder(@Param('id') id: string, @Body() shipOrderDto: ShipOrderDto) {
    return this.ordersService.shipOrder(id, shipOrderDto);
  }
}