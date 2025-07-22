import { PartialType } from '@nestjs/mapped-types';
import { IsOptional, IsEnum, IsString } from 'class-validator';
import { CreateReviewDto } from './create-review.dto';
import { ReviewStatus } from '../../entities/review.entity';

export class UpdateReviewDto extends PartialType(CreateReviewDto) {
  @IsOptional()
  @IsEnum(ReviewStatus)
  status?: ReviewStatus;

  @IsOptional()
  @IsString()
  moderatorNote?: string;
}
