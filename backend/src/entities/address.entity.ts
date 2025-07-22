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

export enum AddressType {
  SHIPPING = 'shipping',
  BILLING = 'billing',
  BOTH = 'both',
}

@Entity('addresses')
export class Address {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  userId: number;

  @Column()
  firstName: string;

  @Column()
  lastName: string;

  @Column({ nullable: true })
  company: string;

  @Column()
  address1: string;

  @Column({ nullable: true })
  address2: string;

  @Column()
  city: string;

  @Column()
  state: string;

  @Column()
  postalCode: string;

  @Column()
  country: string;

  @Column({ nullable: true })
  phone: string;

  @Column({
    type: 'enum',
    enum: AddressType,
    default: AddressType.BOTH,
  })
  type: AddressType;

  @Column({ default: false })
  isDefault: boolean;

  @ManyToOne(() => User, (user) => user.addresses)
  @JoinColumn({ name: 'userId' })
  user: User;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  get fullName(): string {
    return `${this.firstName} ${this.lastName}`;
  }

  get fullAddress(): string {
    const parts = [
      this.address1,
      this.address2,
      this.city,
      this.state,
      this.postalCode,
      this.country,
    ].filter(Boolean);
    return parts.join(', ');
  }
}
