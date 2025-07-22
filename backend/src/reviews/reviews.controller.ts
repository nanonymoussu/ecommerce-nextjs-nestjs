import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  UseGuards,
  ParseIntPipe,
} from '@nestjs/common';
import { ReviewsService } from './reviews.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { CreateReviewDto } from './dto/create-review.dto';

@Controller({ path: 'reviews', version: '1' })
export class ReviewsController {
  constructor(private readonly reviewsService: ReviewsService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  async create(
    @Body() createReviewDto: CreateReviewDto,
    @CurrentUser('id') userId: number,
  ) {
    return this.reviewsService.create({ ...createReviewDto, userId });
  }

  @Get('product/:productId')
  async findByProduct(@Param('productId', ParseIntPipe) productId: number) {
    return this.reviewsService.findByProduct(productId);
  }
}
