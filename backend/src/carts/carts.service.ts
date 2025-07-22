import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Cart } from '../entities/cart.entity';
import { CartItem } from '../entities/cart-item.entity';

@Injectable()
export class CartsService {
  constructor(
    @InjectRepository(Cart)
    private readonly cartRepository: Repository<Cart>,
    @InjectRepository(CartItem)
    private readonly cartItemRepository: Repository<CartItem>,
  ) {}

  async findUserCart(userId: number): Promise<Cart> {
    let cart = await this.cartRepository.findOne({
      where: { userId },
      relations: ['items', 'items.product'],
    });

    if (!cart) {
      cart = this.cartRepository.create({ userId });
      cart = await this.cartRepository.save(cart);
    }

    return cart;
  }

  async addItem(userId: number, productId: number, quantity: number) {
    const cart = await this.findUserCart(userId);

    let cartItem = await this.cartItemRepository.findOne({
      where: { cartId: cart.id, productId },
    });

    if (cartItem) {
      cartItem.quantity += quantity;
    } else {
      cartItem = this.cartItemRepository.create({
        cartId: cart.id,
        productId,
        quantity,
        price: 0, // Would calculate from product
        total: 0,
      });
    }

    return this.cartItemRepository.save(cartItem);
  }

  async removeItem(userId: number, itemId: number) {
    const cart = await this.findUserCart(userId);
    await this.cartItemRepository.delete({ id: itemId, cartId: cart.id });
  }

  async clearCart(userId: number) {
    const cart = await this.findUserCart(userId);
    await this.cartItemRepository.delete({ cartId: cart.id });
  }
}
