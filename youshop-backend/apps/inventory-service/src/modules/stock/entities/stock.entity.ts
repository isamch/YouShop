import { Entity, Column, ManyToOne, JoinColumn } from 'typeorm';
import { BaseEntity } from '@youshop/database';
import { Sku } from '../../sku/entities/sku.entity';

export enum StockMovementType {
  INITIAL = 'initial',
  PURCHASE = 'purchase',
  SALE = 'sale',
  RETURN = 'return',
  ADJUSTMENT = 'adjustment',
  RESERVATION = 'reservation',
  RELEASE = 'release',
  DAMAGE = 'damage',
  TRANSFER = 'transfer',
}

@Entity('stocks')
export class Stock extends BaseEntity {
  @Column()
  skuId: string;

  @Column()
  locationId: string; // warehouse, store, etc.

  @Column({ default: 0 })
  availableQuantity: number;

  @Column({ default: 0 })
  reservedQuantity: number;

  @Column({ default: 0 })
  totalQuantity: number;

  @Column({ default: 0 })
  reorderPoint: number;

  @Column({ default: 0 })
  maxStock: number;

  @Column({ nullable: true })
  lastMovementDate: Date;

  @Column({ default: true })
  isActive: boolean;

  @ManyToOne(() => Sku, sku => sku.stocks)
  @JoinColumn({ name: 'skuId' })
  sku: Sku;
}

@Entity('stock_movements')
export class StockMovement extends BaseEntity {
  @Column()
  stockId: string;

  @Column()
  skuId: string;

  @Column({
    type: 'enum',
    enum: StockMovementType,
  })
  type: StockMovementType;

  @Column()
  quantity: number;

  @Column()
  previousQuantity: number;

  @Column()
  newQuantity: number;

  @Column({ nullable: true })
  orderId: string;

  @Column({ nullable: true })
  reservationId: string;

  @Column({ nullable: true })
  reason: string;

  @Column({ nullable: true })
  notes: string;

  @Column()
  performedBy: string; // user ID

  @ManyToOne(() => Stock)
  @JoinColumn({ name: 'stockId' })
  stock: Stock;
}