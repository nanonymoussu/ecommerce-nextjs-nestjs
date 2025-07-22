import { Injectable, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Wishlist } from '../entities/wishlist.entity';

@Injectable()
export class WishlistsService {
  constructor(
    @InjectRepository(Wishlist)
    private readonly wishlistRepository: Repository<Wishlist>,
  ) {}

  async add(userId: number, productId: number): Promise<Wishlist> {
    const existing = await this.wishlistRepository.findOne({
      where: { userId, productId },
    });

    if (existing) {
      throw new ConflictException('Product already in wishlist');
    }

    const wishlist = this.wishlistRepository.create({ userId, productId });
    return this.wishlistRepository.save(wishlist);
  }

  async findByUser(userId: number): Promise<Wishlist[]> {
    return this.wishlistRepository.find({
      where: { userId },
      relations: ['product'],
      order: { createdAt: 'DESC' },
    });
  }

  async remove(userId: number, productId: number): Promise<void> {
    await this.wishlistRepository.delete({ userId, productId });
  }
}
