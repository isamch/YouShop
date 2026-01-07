import { Entity, Column } from 'typeorm';
import { BaseEntity } from '../base/base.entity';

@Entity('users')
export class User extends BaseEntity {
  @Column({ unique: true })
  email: string;

  @Column({ select: false })
  password: string;

  @Column()
  firstName: string;

  @Column()
  lastName: string;

  @Column('simple-array', { default: 'user' })
  roles: string[];

  @Column({ default: true })
  isActive: boolean;

  @Column({ nullable: true, select: false })
  refreshToken?: string;

  @Column({ nullable: true, select: false })
  passwordResetToken?: string;

  @Column({ nullable: true })
  passwordResetExpires?: Date;
}