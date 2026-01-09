import { Entity, Column, ManyToOne, JoinColumn } from 'typeorm';
import { BaseEntity } from '@youshop/database';
import { Order } from './order.entity';

@Entity('order_items')
export class OrderItem extends BaseEntity {
  @Column()
  orderId: string;

  @Column()
  productId: string;

  @Column()
  skuId: string;

  @Column()
  productName: string;

  @Column()
  skuCode: string;

  @Column('json', { nullable: true })
  productAttributes: Record<string, any>; // size, color, etc.

  @Column()
  quantity: number;

  @Column('decimal', { precision: 10, scale: 2 })
  unitPrice: number;

  @Column('decimal', { precision: 10, scale: 2 })
  totalPrice: number;

  @Column({ nullable: true })
  productImage: string;

  @Column({ nullable: true })
  reservationId: string;

  @ManyToOne(() => Order, order => order.items, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'orderId' })
  order: Order;
}