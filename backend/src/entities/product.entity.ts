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
import { Category } from './category.entity';
import { OrderItem } from './order-item.entity';
import { CartItem } from './cart-item.entity';
import { Review } from './review.entity';
import { Wishlist } from './wishlist.entity';

export enum ProductStatus {
  DRAFT = 'draft',
  ACTIVE = 'active',
  INACTIVE = 'inactive',
  OUT_OF_STOCK = 'out_of_stock',
}

@Entity('products')
export class Product {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column({ unique: true })
  slug: string;

  @Column({ type: 'text' })
  description: string;

  @Column({ type: 'text', nullable: true })
  shortDescription: string;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  price: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
  comparePrice: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
  costPrice: number;

  @Column()
  sku: string;

  @Column({ default: 0 })
  inventory: number;

  @Column({ default: 0 })
  lowStockThreshold: number;

  @Column({ default: true })
  trackInventory: boolean;

  @Column({ default: 0 })
  weight: number;

  @Column({ type: 'json', nullable: true })
  dimensions: {
    length: number;
    width: number;
    height: number;
  };

  @Column({ type: 'json', nullable: true })
  images: string[];

  @Column({
    type: 'enum',
    enum: ProductStatus,
    default: ProductStatus.DRAFT,
  })
  status: ProductStatus;

  @Column({ default: false })
  isFeatured: boolean;

  @Column({ default: 0 })
  viewCount: number;

  @Column({ default: 0 })
  salesCount: number;

  @Column({ type: 'decimal', precision: 3, scale: 2, default: 0 })
  averageRating: number;

  @Column({ default: 0 })
  reviewCount: number;

  @Column({ type: 'json', nullable: true })
  attributes: Record<string, any>;

  @Column({ type: 'json', nullable: true })
  tags: string[];

  @Column({ type: 'json', nullable: true })
  seoTitle: string;

  @Column({ type: 'text', nullable: true })
  seoDescription: string;

  @Column({ type: 'json', nullable: true })
  seoKeywords: string[];

  @Column()
  categoryId: number;

  @ManyToOne(() => Category, (category) => category.products)
  @JoinColumn({ name: 'categoryId' })
  category: Category;

  @OneToMany(() => OrderItem, (orderItem) => orderItem.product)
  orderItems: OrderItem[];

  @OneToMany(() => CartItem, (cartItem) => cartItem.product)
  cartItems: CartItem[];

  @OneToMany(() => Review, (review) => review.product)
  reviews: Review[];

  @OneToMany(() => Wishlist, (wishlist) => wishlist.product)
  wishlists: Wishlist[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  get isInStock(): boolean {
    return this.trackInventory ? this.inventory > 0 : true;
  }

  get isLowStock(): boolean {
    return this.trackInventory && this.inventory <= this.lowStockThreshold;
  }

  get discountPercentage(): number {
    if (!this.comparePrice || this.comparePrice <= this.price) return 0;
    return Math.round(
      ((this.comparePrice - this.price) / this.comparePrice) * 100,
    );
  }
}
