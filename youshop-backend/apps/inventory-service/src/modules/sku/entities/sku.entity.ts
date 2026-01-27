import { Entity, Column, OneToMany } from 'typeorm';
import { BaseEntity } from '@youshop/database';
import { Stock } from '../../stock/entities/stock.entity';

@Entity('skus')
export class Sku extends BaseEntity {
  @Column({ unique: true })
  code: string;

  @Column()
  productId: string;

  @Column({ nullable: true })
  name: string;

  @Column('jsonb', { nullable: true })
  attributes: Record<string, any>;

  @Column({ default: true })
  isActive: boolean;

  @OneToMany(() => Stock, stock => stock.sku)
  stocks: Stock[];
}