import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Review } from '../entities/review.entity';
import { CreateReviewDto } from './dto/create-review.dto';

@Injectable()
export class ReviewsService {
  constructor(
    @InjectRepository(Review)
    private readonly reviewRepository: Repository<Review>,
  ) {}

  async create(createReviewDto: CreateReviewDto): Promise<Review> {
    const review = this.reviewRepository.create(createReviewDto);
    return this.reviewRepository.save(review);
  }

  async findByProduct(productId: number): Promise<Review[]> {
    return this.reviewRepository.find({
      where: { productId },
      relations: ['user'],
      order: { createdAt: 'DESC' },
    });
  }
}
