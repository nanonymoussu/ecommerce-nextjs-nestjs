import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

export enum CouponType {
  PERCENTAGE = 'percentage',
  FIXED_AMOUNT = 'fixed_amount',
  FREE_SHIPPING = 'free_shipping',
}

export enum CouponStatus {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
  EXPIRED = 'expired',
}

@Entity('coupons')
export class Coupon {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  code: string;

  @Column()
  name: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({
    type: 'enum',
    enum: CouponType,
  })
  type: CouponType;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  value: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
  minimumAmount: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
  maximumDiscount: number;

  @Column({ nullable: true })
  usageLimit: number;

  @Column({ default: 0 })
  usageCount: number;

  @Column({ nullable: true })
  userUsageLimit: number;

  @Column({ nullable: true })
  validFrom: Date;

  @Column({ nullable: true })
  validUntil: Date;

  @Column({
    type: 'enum',
    enum: CouponStatus,
    default: CouponStatus.ACTIVE,
  })
  status: CouponStatus;

  @Column({ type: 'json', nullable: true })
  applicableCategories: number[];

  @Column({ type: 'json', nullable: true })
  applicableProducts: number[];

  @Column({ type: 'json', nullable: true })
  excludedCategories: number[];

  @Column({ type: 'json', nullable: true })
  excludedProducts: number[];

  @Column({ default: false })
  isFirstTimeOnly: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  get isValid(): boolean {
    const now = new Date();

    if (this.status !== CouponStatus.ACTIVE) return false;
    if (this.validFrom && now < this.validFrom) return false;
    if (this.validUntil && now > this.validUntil) return false;
    if (this.usageLimit && this.usageCount >= this.usageLimit) return false;

    return true;
  }

  get isExpired(): boolean {
    const now = new Date();
    return this.validUntil && now > this.validUntil;
  }

  calculateDiscount(subtotal: number): number {
    if (!this.isValid) return 0;
    if (this.minimumAmount && subtotal < this.minimumAmount) return 0;

    let discount = 0;

    switch (this.type) {
      case CouponType.PERCENTAGE:
        discount = (subtotal * this.value) / 100;
        break;
      case CouponType.FIXED_AMOUNT:
        discount = this.value;
        break;
      case CouponType.FREE_SHIPPING:
        // This would be handled in shipping calculation
        return 0;
    }

    if (this.maximumDiscount && discount > this.maximumDiscount) {
      discount = this.maximumDiscount;
    }

    return Math.min(discount, subtotal);
  }
}
