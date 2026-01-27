import { Entity, Column, ManyToOne, JoinColumn } from 'typeorm';
import { BaseEntity } from '@youshop/database';
import { Sku } from '../../sku/entities/sku.entity';

@Entity('stocks')
export class Stock extends BaseEntity {
  @Column()
  skuId: string;

  @Column({ default: 0 })
  availableQuantity: number;

  @Column({ default: 0 })
  reservedQuantity: number;

  @Column({ default: 0 })
  totalQuantity: number;

  @Column({ default: true })
  isActive: boolean;

  @ManyToOne(() => Sku, sku => sku.stocks)
  @JoinColumn({ name: 'skuId' })
  sku: Sku;
}