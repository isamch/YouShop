import { BaseEvent } from '../interfaces/base-event.interface';

/**
 * Order Created Event
 * 
 * @description
 * Emitted when a new order is created
 */
export interface OrderCreatedEvent extends BaseEvent {
  eventType: 'order.created';
  data: {
    orderId: string;
    userId: string;
    items: Array<{
      productId: string;
      quantity: number;
      price: number;
    }>;
    totalAmount: number;
    status: string;
  };
}

/**
 * Order Updated Event
 * 
 * @description
 * Emitted when order status is updated
 */
export interface OrderUpdatedEvent extends BaseEvent {
  eventType: 'order.updated';
  data: {
    orderId: string;
    userId: string;
    status: string;
    previousStatus: string;
  };
}

/**
 * Order Cancelled Event
 * 
 * @description
 * Emitted when an order is cancelled
 */
export interface OrderCancelledEvent extends BaseEvent {
  eventType: 'order.cancelled';
  data: {
    orderId: string;
    userId: string;
    items: Array<{
      productId: string;
      quantity: number;
    }>;
    reason: string;
  };
}