import { BaseEvent } from '../interfaces/base-event.interface';

/**
 * Stock Reserved Event
 * 
 * @description
 * Emitted when stock is reserved for an order
 */
export interface StockReservedEvent extends BaseEvent {
  eventType: 'stock.reserved';
  data: {
    productId: string;
    quantity: number;
    orderId: string;
    reservationId: string;
  };
}

/**
 * Stock Released Event
 * 
 * @description
 * Emitted when reserved stock is released
 */
export interface StockReleasedEvent extends BaseEvent {
  eventType: 'stock.released';
  data: {
    productId: string;
    quantity: number;
    orderId: string;
    reservationId: string;
    reason: string;
  };
}

/**
 * Stock Updated Event
 * 
 * @description
 * Emitted when stock quantity is updated
 */
export interface StockUpdatedEvent extends BaseEvent {
  eventType: 'stock.updated';
  data: {
    productId: string;
    previousQuantity: number;
    newQuantity: number;
    changeReason: string;
  };
}

/**
 * Low Stock Alert Event
 * 
 * @description
 * Emitted when stock falls below threshold
 */
export interface LowStockAlertEvent extends BaseEvent {
  eventType: 'stock.low-alert';
  data: {
    productId: string;
    currentQuantity: number;
    threshold: number;
    productName: string;
  };
}