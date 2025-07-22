import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Coupon } from '../entities/coupon.entity';
import { CreateCouponDto } from './dto/create-coupon.dto';
import { UpdateCouponDto } from './dto/update-coupon.dto';

@Injectable()
export class CouponsService {
  constructor(
    @InjectRepository(Coupon)
    private readonly couponRepository: Repository<Coupon>,
  ) {}

  async create(createCouponDto: CreateCouponDto): Promise<Coupon> {
    const coupon = this.couponRepository.create(createCouponDto);
    return this.couponRepository.save(coupon);
  }

  async findAll(): Promise<Coupon[]> {
    return this.couponRepository.find({
      order: { createdAt: 'DESC' },
    });
  }

  async validateCoupon(code: string): Promise<Coupon> {
    const coupon = await this.couponRepository.findOne({
      where: { code },
    });

    if (!coupon) {
      throw new NotFoundException('Coupon not found');
    }

    return coupon;
  }

  async update(id: number, updateCouponDto: UpdateCouponDto): Promise<Coupon> {
    await this.couponRepository.update(id, updateCouponDto);
    const coupon = await this.couponRepository.findOne({ where: { id } });
    if (!coupon) {
      throw new NotFoundException('Coupon not found');
    }
    return coupon;
  }

  async remove(id: number): Promise<void> {
    await this.couponRepository.delete(id);
  }
}
