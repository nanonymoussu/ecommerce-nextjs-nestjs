import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
  BeforeInsert,
  BeforeUpdate,
} from 'typeorm';
import { Exclude } from 'class-transformer';
import * as bcrypt from 'bcryptjs';
import * as CryptoJS from 'crypto-js';
import { Order } from './order.entity';
import { Cart } from './cart.entity';
import { Address } from './address.entity';
import { Review } from './review.entity';
import { Wishlist } from './wishlist.entity';

export enum UserRole {
  CUSTOMER = 'customer',
  ADMIN = 'admin',
  MODERATOR = 'moderator',
}

export enum UserStatus {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
  BANNED = 'banned',
}

@Entity('users')
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  email: string;

  @Column()
  @Exclude()
  password: string;

  @Column()
  firstName: string;

  @Column()
  lastName: string;

  @Column({ nullable: true })
  phone: string;

  @Column({
    type: 'enum',
    enum: UserRole,
    default: UserRole.CUSTOMER,
  })
  role: UserRole;

  @Column({
    type: 'enum',
    enum: UserStatus,
    default: UserStatus.ACTIVE,
  })
  status: UserStatus;

  @Column({ default: false })
  isEmailVerified: boolean;

  @Column({ nullable: true })
  @Exclude()
  emailVerificationToken: string;

  @Column({ nullable: true })
  @Exclude()
  passwordResetToken: string;

  @Column({ nullable: true })
  passwordResetExpires: Date;

  @Column({ nullable: true })
  lastLogin: Date;

  @Column({ default: 0 })
  loginAttempts: number;

  @Column({ nullable: true })
  lockUntil: Date;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @OneToMany(() => Order, (order) => order.user)
  orders: Order[];

  @OneToMany(() => Cart, (cart) => cart.user)
  carts: Cart[];

  @OneToMany(() => Address, (address) => address.user)
  addresses: Address[];

  @OneToMany(() => Review, (review) => review.user)
  reviews: Review[];

  @OneToMany(() => Wishlist, (wishlist) => wishlist.user)
  wishlists: Wishlist[];

  @BeforeInsert()
  @BeforeUpdate()
  async hashPassword() {
    if (this.password) {
      this.password = await bcrypt.hash(this.password, 12);
    }
  }

  @BeforeInsert()
  @BeforeUpdate()
  encryptSensitiveData() {
    const secretKey = process.env.ENCRYPTION_KEY || 'default-secret-key';
    if (this.emailVerificationToken) {
      this.emailVerificationToken = CryptoJS.AES.encrypt(
        this.emailVerificationToken,
        secretKey,
      ).toString();
    }
    if (this.passwordResetToken) {
      this.passwordResetToken = CryptoJS.AES.encrypt(
        this.passwordResetToken,
        secretKey,
      ).toString();
    }
  }

  async validatePassword(password: string): Promise<boolean> {
    return bcrypt.compare(password, this.password);
  }

  get isLocked(): boolean {
    return !!(this.lockUntil && this.lockUntil > new Date());
  }

  get fullName(): string {
    return `${this.firstName} ${this.lastName}`;
  }

  canAccess(requiredRole: UserRole): boolean {
    const roleHierarchy = {
      [UserRole.CUSTOMER]: 0,
      [UserRole.MODERATOR]: 1,
      [UserRole.ADMIN]: 2,
    };
    return roleHierarchy[this.role] >= roleHierarchy[requiredRole];
  }
}
