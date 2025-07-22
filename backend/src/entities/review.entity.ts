import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { User } from './user.entity';
import { Product } from './product.entity';

export enum ReviewStatus {
  PENDING = 'pending',
  APPROVED = 'approved',
  REJECTED = 'rejected',
}

@Entity('reviews')
export class Review {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  userId: number;

  @Column()
  productId: number;

  @Column({ type: 'int', width: 1 })
  rating: number; // 1-5 stars

  @Column()
  title: string;

  @Column({ type: 'text' })
  comment: string;

  @Column({
    type: 'enum',
    enum: ReviewStatus,
    default: ReviewStatus.PENDING,
  })
  status: ReviewStatus;

  @Column({ default: false })
  isVerifiedPurchase: boolean;

  @Column({ type: 'json', nullable: true })
  images: string[];

  @Column({ default: 0 })
  helpfulCount: number;

  @Column({ default: 0 })
  unhelpfulCount: number;

  @Column({ nullable: true })
  moderatorNote: string;

  @ManyToOne(() => User, (user) => user.reviews)
  @JoinColumn({ name: 'userId' })
  user: User;

  @ManyToOne(() => Product, (product) => product.reviews)
  @JoinColumn({ name: 'productId' })
  product: Product;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  get helpfulnessRatio(): number {
    const total = this.helpfulCount + this.unhelpfulCount;
    return total > 0 ? this.helpfulCount / total : 0;
  }
}
