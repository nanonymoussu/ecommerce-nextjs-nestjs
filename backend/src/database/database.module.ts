import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';

import { User } from '../entities/user.entity';
import { Product } from '../entities/product.entity';
import { Category } from '../entities/category.entity';
import { Order } from '../entities/order.entity';
import { OrderItem } from '../entities/order-item.entity';
import { Cart } from '../entities/cart.entity';
import { CartItem } from '../entities/cart-item.entity';
import { Address } from '../entities/address.entity';
import { Payment } from '../entities/payment.entity';
import { Review } from '../entities/review.entity';
import { Coupon } from '../entities/coupon.entity';
import { Wishlist } from '../entities/wishlist.entity';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        type: 'mysql',
        host: configService.get<string>('DB_HOST'),
        port: configService.get<number>('DB_PORT'),
        username: configService.get<string>('DB_USERNAME'),
        password: configService.get<string>('DB_PASSWORD'),
        database: configService.get<string>('DB_DATABASE'),
        entities: [
          User,
          Product,
          Category,
          Order,
          OrderItem,
          Cart,
          CartItem,
          Address,
          Payment,
          Review,
          Coupon,
          Wishlist,
        ],
        synchronize: configService.get<string>('NODE_ENV') !== 'production',
        logging: configService.get<string>('NODE_ENV') === 'development',
      }),
      inject: [ConfigService],
    }),
  ],
})
export class DatabaseModule {}
