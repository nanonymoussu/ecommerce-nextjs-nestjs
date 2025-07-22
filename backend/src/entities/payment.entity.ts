import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Exclude } from 'class-transformer';
import { Order } from './order.entity';

export enum PaymentMethod {
  CREDIT_CARD = 'credit_card',
  DEBIT_CARD = 'debit_card',
  PAYPAL = 'paypal',
  STRIPE = 'stripe',
  BANK_TRANSFER = 'bank_transfer',
  CASH_ON_DELIVERY = 'cash_on_delivery',
}

export enum PaymentStatus {
  PENDING = 'pending',
  PROCESSING = 'processing',
  COMPLETED = 'completed',
  FAILED = 'failed',
  CANCELLED = 'cancelled',
  REFUNDED = 'refunded',
  PARTIALLY_REFUNDED = 'partially_refunded',
}

@Entity('payments')
export class Payment {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  orderId: number;

  @Column({ unique: true })
  transactionId: string;

  @Column({
    type: 'enum',
    enum: PaymentMethod,
  })
  method: PaymentMethod;

  @Column({
    type: 'enum',
    enum: PaymentStatus,
    default: PaymentStatus.PENDING,
  })
  status: PaymentStatus;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  amount: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
  refundedAmount: number;

  @Column({ default: 'USD' })
  currency: string;

  @Column({ nullable: true })
  @Exclude()
  gatewayTransactionId: string;

  @Column({ type: 'json', nullable: true })
  @Exclude()
  gatewayResponse: Record<string, unknown>;

  @Column({ nullable: true })
  failureReason: string;

  @Column({ nullable: true })
  processedAt: Date;

  @Column({ nullable: true })
  refundedAt: Date;

  @Column({ type: 'json', nullable: true })
  metadata: Record<string, unknown>;

  @ManyToOne(() => Order, (order) => order.payments)
  @JoinColumn({ name: 'orderId' })
  order: Order;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  get canRefund(): boolean {
    return (
      this.status === PaymentStatus.COMPLETED &&
      this.refundedAmount < this.amount
    );
  }

  get availableRefundAmount(): number {
    return this.amount - this.refundedAmount;
  }
}
