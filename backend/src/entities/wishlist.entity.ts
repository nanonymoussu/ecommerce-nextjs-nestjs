import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
  Unique,
} from 'typeorm';
import { User } from './user.entity';
import { Product } from './product.entity';

@Entity('wishlists')
@Unique(['userId', 'productId'])
export class Wishlist {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  userId: number;

  @Column()
  productId: number;

  @Column({ type: 'text', nullable: true })
  notes: string;

  @ManyToOne(() => User, (user) => user.wishlists)
  @JoinColumn({ name: 'userId' })
  user: User;

  @ManyToOne(() => Product, (product) => product.wishlists)
  @JoinColumn({ name: 'productId' })
  product: Product;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
