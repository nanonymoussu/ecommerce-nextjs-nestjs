import { Module, MiddlewareConsumer, NestModule } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ThrottlerModule } from '@nestjs/throttler';
import { APP_GUARD, APP_PIPE } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DatabaseModule } from './database/database.module';
import { AuthModule } from './auth/auth.module';
import { ProductsModule } from './products/products.module';
import { CategoriesModule } from './categories/categories.module';
import { OrdersModule } from './orders/orders.module';
import { CartsModule } from './carts/carts.module';
import { UsersModule } from './users/users.module';
import { PaymentsModule } from './payments/payments.module';
import { AddressesModule } from './addresses/addresses.module';
import { ReviewsModule } from './reviews/reviews.module';
import { CouponsModule } from './coupons/coupons.module';
import { WishlistsModule } from './wishlists/wishlists.module';
import { JwtAuthGuard } from './auth/guards/jwt-auth.guard';
import { RolesGuard } from './auth/guards/roles.guard';
import { SecurityMiddleware } from './common/middleware/security.middleware';
import { XssSanitizerPipe } from './common/pipes/xss-sanitizer.pipe';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    ThrottlerModule.forRoot([
      {
        ttl: 60000,
        limit: 10,
      },
    ]),
    DatabaseModule,
    AuthModule,
    ProductsModule,
    CategoriesModule,
    OrdersModule,
    CartsModule,
    UsersModule,
    PaymentsModule,
    AddressesModule,
    ReviewsModule,
    CouponsModule,
    WishlistsModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
    {
      provide: APP_GUARD,
      useClass: RolesGuard,
    },
    {
      provide: APP_PIPE,
      useClass: ValidationPipe,
    },
    {
      provide: APP_PIPE,
      useClass: XssSanitizerPipe,
    },
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(SecurityMiddleware).forRoutes('*');
  }
}
