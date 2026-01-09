import { Entity, Column, ManyToOne, JoinColumn } from 'typeorm';
import { BaseEntity } from '@youshop/database';
import { Order, OrderStatus } from './order.entity';

@Entity('order_status_history')
export class OrderStatusHistory extends BaseEntity {
  @Column()
  orderId: string;

  @Column({
    type: 'enum',
    enum: OrderStatus,
  })
  fromStatus: OrderStatus;

  @Column({
    type: 'enum',
    enum: OrderStatus,
  })
  toStatus: OrderStatus;

  @Column({ nullable: true })
  reason: string;

  @Column({ nullable: true })
  notes: string;

  @Column()
  changedBy: string; // user ID

  @Column()
  changedAt: Date;

  @ManyToOne(() => Order)
  @JoinColumn({ name: 'orderId' })
  order: Order;
}