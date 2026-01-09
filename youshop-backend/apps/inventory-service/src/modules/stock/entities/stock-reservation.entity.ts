import { Entity, Column } from 'typeorm';
import { BaseEntity } from '@youshop/database';

export enum ReservationStatus {
  ACTIVE = 'active',
  FULFILLED = 'fulfilled',
  CANCELLED = 'cancelled',
  EXPIRED = 'expired',
}

@Entity('stock_reservations')
export class StockReservation extends BaseEntity {
  @Column()
  skuId: string;

  @Column()
  stockId: string;

  @Column()
  orderId: string;

  @Column()
  quantity: number;

  @Column({
    type: 'enum',
    enum: ReservationStatus,
    default: ReservationStatus.ACTIVE,
  })
  status: ReservationStatus;

  @Column()
  expiresAt: Date;

  @Column({ nullable: true })
  fulfilledAt: Date;

  @Column({ nullable: true })
  cancelledAt: Date;

  @Column({ nullable: true })
  reason: string;

  @Column()
  reservedBy: string; // user ID
}