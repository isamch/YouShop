import { Entity, Column, OneToMany } from 'typeorm';
import { BaseEntity } from '@youshop/database';
import { Stock } from '../../stock/entities/stock.entity';

@Entity('skus')
export class Sku extends BaseEntity {
  @Column({ unique: true })
  code: string;

  @Column()
  productId: string;

  @Column()
  name: string;

  @Column({ nullable: true })
  description: string;

  @Column('decimal', { precision: 10, scale: 2 })
  price: number;

  @Column('decimal', { precision: 10, scale: 2, nullable: true })
  compareAtPrice: number;

  @Column({ nullable: true })
  barcode: string;

  @Column('decimal', { precision: 8, scale: 3, nullable: true })
  weight: number;

  @Column({ nullable: true })
  dimensions: string;

  @Column('simple-array', { nullable: true })
  images: string[];

  @Column('json', { nullable: true })
  attributes: Record<string, any>; // size, color, etc.

  @Column({ default: true })
  isActive: boolean;

  @Column({ default: true })
  trackQuantity: boolean;

  @Column({ default: false })
  allowBackorder: boolean;

  @OneToMany(() => Stock, stock => stock.sku)
  stocks: Stock[];
}