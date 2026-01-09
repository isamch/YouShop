import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource } from 'typeorm';
import { Order, OrderStatus, PaymentStatus } from '../entities/order.entity';
import { OrderItem } from '../entities/order-item.entity';
import { OrderStatusHistory } from '../entities/order-status-history.entity';
import { CreateOrderDto } from '../dto/create-order.dto';
import { UpdateOrderStatusDto, CancelOrderDto, ShipOrderDto } from '../dto/update-order-status.dto';
import { PAGINATION } from '@youshop/shared';

export interface OrderFilters {
  userId?: string;
  status?: OrderStatus;
  paymentStatus?: PaymentStatus;
  dateFrom?: Date;
  dateTo?: Date;
}

export interface PaginationOptions {
  page?: number;
  limit?: number;
}

@Injectable()
export class OrdersService {
  constructor(
    @InjectRepository(Order)
    private ordersRepository: Repository<Order>,
    @InjectRepository(OrderItem)
    private orderItemsRepository: Repository<OrderItem>,
    @InjectRepository(OrderStatusHistory)
    private statusHistoryRepository: Repository<OrderStatusHistory>,
    private dataSource: DataSource,
  ) {}

  async create(createOrderDto: CreateOrderDto): Promise<Order> {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      // Generate order number
      const orderNumber = await this.generateOrderNumber();

      // Calculate totals
      const subtotal = createOrderDto.items.reduce(
        (sum, item) => sum + (item.unitPrice * item.quantity), 0
      );
      
      // TODO: Calculate tax and shipping based on business rules
      const taxAmount = subtotal * 0.1; // 10% tax
      const shippingAmount = subtotal > 100 ? 0 : 10; // Free shipping over $100
      const discountAmount = 0; // TODO: Apply coupon logic
      const totalAmount = subtotal + taxAmount + shippingAmount - discountAmount;

      // Create order
      const order = this.ordersRepository.create({
        orderNumber,
        userId: createOrderDto.userId,
        status: OrderStatus.PENDING,
        paymentStatus: PaymentStatus.PENDING,
        subtotal,
        taxAmount,
        shippingAmount,
        discountAmount,
        totalAmount,
        couponCode: createOrderDto.couponCode,
        shippingAddress: createOrderDto.shippingAddress,
        billingAddress: createOrderDto.billingAddress || createOrderDto.shippingAddress,
        notes: createOrderDto.notes,
      });

      const savedOrder = await queryRunner.manager.save(order);

      // Create order items
      const orderItems = createOrderDto.items.map(item => 
        this.orderItemsRepository.create({
          orderId: savedOrder.id,
          productId: item.productId,
          skuId: item.skuId,
          productName: 'Product Name', // TODO: Get from catalog service
          skuCode: 'SKU Code', // TODO: Get from inventory service
          quantity: item.quantity,
          unitPrice: item.unitPrice,
          totalPrice: item.unitPrice * item.quantity,
        })
      );

      await queryRunner.manager.save(orderItems);

      // Create initial status history
      const statusHistory = this.statusHistoryRepository.create({
        orderId: savedOrder.id,
        fromStatus: OrderStatus.PENDING,
        toStatus: OrderStatus.PENDING,
        reason: 'Order created',
        changedBy: createOrderDto.userId,
        changedAt: new Date(),
      });

      await queryRunner.manager.save(statusHistory);

      // TODO: Reserve stock for order items
      // TODO: Emit order created event

      await queryRunner.commitTransaction();

      return this.findOne(savedOrder.id);
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
  }

  async findAll(
    filters: OrderFilters = {},
    pagination: PaginationOptions = {}
  ): Promise<{ orders: Order[]; total: number; page: number; limit: number }> {
    const { page = PAGINATION.DEFAULT_PAGE, limit = PAGINATION.DEFAULT_LIMIT } = pagination;
    const { userId, status, paymentStatus, dateFrom, dateTo } = filters;

    const queryBuilder = this.ordersRepository
      .createQueryBuilder('order')
      .leftJoinAndSelect('order.items', 'items')
      .orderBy('order.createdAt', 'DESC');

    if (userId) {
      queryBuilder.andWhere('order.userId = :userId', { userId });
    }

    if (status) {
      queryBuilder.andWhere('order.status = :status', { status });
    }

    if (paymentStatus) {
      queryBuilder.andWhere('order.paymentStatus = :paymentStatus', { paymentStatus });
    }

    if (dateFrom) {
      queryBuilder.andWhere('order.createdAt >= :dateFrom', { dateFrom });
    }

    if (dateTo) {
      queryBuilder.andWhere('order.createdAt <= :dateTo', { dateTo });
    }

    const [orders, total] = await queryBuilder
      .skip((page - 1) * limit)
      .take(limit)
      .getManyAndCount();

    return { orders, total, page, limit };
  }

  async findOne(id: string): Promise<Order> {
    const order = await this.ordersRepository.findOne({
      where: { id },
      relations: ['items'],
    });

    if (!order) {
      throw new NotFoundException(`Order with ID ${id} not found`);
    }

    return order;
  }

  async findByOrderNumber(orderNumber: string): Promise<Order> {
    const order = await this.ordersRepository.findOne({
      where: { orderNumber },
      relations: ['items'],
    });

    if (!order) {
      throw new NotFoundException(`Order with number ${orderNumber} not found`);
    }

    return order;
  }

  async updateStatus(id: string, updateStatusDto: UpdateOrderStatusDto): Promise<Order> {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const order = await this.findOne(id);
      const previousStatus = order.status;

      // Validate status transition
      if (!this.isValidStatusTransition(previousStatus, updateStatusDto.status)) {
        throw new BadRequestException(
          `Invalid status transition from ${previousStatus} to ${updateStatusDto.status}`
        );
      }

      // Update order status
      order.status = updateStatusDto.status;
      const updatedOrder = await queryRunner.manager.save(order);

      // Create status history record
      const statusHistory = this.statusHistoryRepository.create({
        orderId: order.id,
        fromStatus: previousStatus,
        toStatus: updateStatusDto.status,
        reason: updateStatusDto.reason,
        notes: updateStatusDto.notes,
        changedBy: updateStatusDto.changedBy,
        changedAt: new Date(),
      });

      await queryRunner.manager.save(statusHistory);

      // TODO: Emit order status changed event

      await queryRunner.commitTransaction();
      return updatedOrder;
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
  }

  async cancelOrder(id: string, cancelOrderDto: CancelOrderDto): Promise<Order> {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const order = await this.findOne(id);

      if (order.status === OrderStatus.CANCELLED) {
        throw new BadRequestException('Order is already cancelled');
      }

      if (order.status === OrderStatus.DELIVERED) {
        throw new BadRequestException('Cannot cancel delivered order');
      }

      const previousStatus = order.status;
      order.status = OrderStatus.CANCELLED;
      order.cancelledAt = new Date();
      order.cancellationReason = cancelOrderDto.reason;

      const updatedOrder = await queryRunner.manager.save(order);

      // Create status history
      const statusHistory = this.statusHistoryRepository.create({
        orderId: order.id,
        fromStatus: previousStatus,
        toStatus: OrderStatus.CANCELLED,
        reason: cancelOrderDto.reason,
        notes: cancelOrderDto.notes,
        changedBy: cancelOrderDto.cancelledBy,
        changedAt: new Date(),
      });

      await queryRunner.manager.save(statusHistory);

      // TODO: Release reserved stock
      // TODO: Emit order cancelled event

      await queryRunner.commitTransaction();
      return updatedOrder;
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
  }

  async shipOrder(id: string, shipOrderDto: ShipOrderDto): Promise<Order> {
    const order = await this.findOne(id);

    if (order.status !== OrderStatus.PROCESSING) {
      throw new BadRequestException('Order must be in processing status to ship');
    }

    order.status = OrderStatus.SHIPPED;
    order.trackingNumber = shipOrderDto.trackingNumber;
    order.shippedAt = new Date();

    const updatedOrder = await this.ordersRepository.save(order);

    // Create status history
    const statusHistory = this.statusHistoryRepository.create({
      orderId: order.id,
      fromStatus: OrderStatus.PROCESSING,
      toStatus: OrderStatus.SHIPPED,
      reason: 'Order shipped',
      notes: shipOrderDto.notes,
      changedBy: shipOrderDto.shippedBy,
      changedAt: new Date(),
    });

    await this.statusHistoryRepository.save(statusHistory);

    // TODO: Emit order shipped event

    return updatedOrder;
  }

  async getOrderHistory(orderId: string): Promise<OrderStatusHistory[]> {
    return this.statusHistoryRepository.find({
      where: { orderId },
      order: { changedAt: 'ASC' },
    });
  }

  private async generateOrderNumber(): Promise<string> {
    const date = new Date();
    const year = date.getFullYear().toString().slice(-2);
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    
    const count = await this.ordersRepository.count();
    const sequence = (count + 1).toString().padStart(4, '0');
    
    return `ORD${year}${month}${day}${sequence}`;
  }

  private isValidStatusTransition(from: OrderStatus, to: OrderStatus): boolean {
    const validTransitions: Record<OrderStatus, OrderStatus[]> = {
      [OrderStatus.PENDING]: [OrderStatus.CONFIRMED, OrderStatus.CANCELLED],
      [OrderStatus.CONFIRMED]: [OrderStatus.PROCESSING, OrderStatus.CANCELLED],
      [OrderStatus.PROCESSING]: [OrderStatus.SHIPPED, OrderStatus.CANCELLED],
      [OrderStatus.SHIPPED]: [OrderStatus.DELIVERED],
      [OrderStatus.DELIVERED]: [OrderStatus.REFUNDED],
      [OrderStatus.CANCELLED]: [],
      [OrderStatus.REFUNDED]: [],
    };

    return validTransitions[from]?.includes(to) || false;
  }
}