import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  OneToMany,
  JoinColumn,
} from 'typeorm';
import { User } from './user.entity';
import { CartItem } from './cart-item.entity';

@Entity('carts')
export class Cart {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  userId: number;

  @Column({ nullable: true })
  sessionId: string;

  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
  subtotal: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
  tax: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
  shipping: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
  discount: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
  total: number;

  @Column({ nullable: true })
  couponCode: string;

  @Column({ nullable: true })
  expiresAt: Date;

  @ManyToOne(() => User, (user) => user.carts, {
    nullable: true,
  })
  @JoinColumn({ name: 'userId' })
  user: User;

  @OneToMany(() => CartItem, (cartItem) => cartItem.cart, {
    cascade: true,
  })
  items: CartItem[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  get itemCount(): number {
    return this.items?.reduce((count, item) => count + item.quantity, 0) || 0;
  }

  get isEmpty(): boolean {
    return this.itemCount === 0;
  }
}
