import {
  IsInt,
  IsString,
  IsOptional,
  IsArray,
  Min,
  Max,
  IsBoolean,
} from 'class-validator';

export class CreateReviewDto {
  @IsInt()
  productId: number;

  @IsInt()
  @Min(1)
  @Max(5)
  rating: number;

  @IsString()
  title: string;

  @IsString()
  comment: string;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  images?: string[];

  @IsOptional()
  @IsBoolean()
  isVerifiedPurchase?: boolean;

  @IsOptional()
  @IsInt()
  userId?: number;
}
