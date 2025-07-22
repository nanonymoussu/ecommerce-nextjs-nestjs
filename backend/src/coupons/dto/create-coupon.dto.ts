import {
  IsString,
  IsOptional,
  IsEnum,
  IsNumber,
  IsPositive,
  IsBoolean,
  IsArray,
  IsDateString,
} from 'class-validator';
import { CouponType } from '../../entities/coupon.entity';

export class CreateCouponDto {
  @IsString()
  code: string;

  @IsString()
  name: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsEnum(CouponType)
  type: CouponType;

  @IsNumber()
  @IsPositive()
  value: number;

  @IsOptional()
  @IsNumber()
  @IsPositive()
  minimumAmount?: number;

  @IsOptional()
  @IsNumber()
  @IsPositive()
  maximumDiscount?: number;

  @IsOptional()
  @IsNumber()
  @IsPositive()
  usageLimit?: number;

  @IsOptional()
  @IsNumber()
  @IsPositive()
  userUsageLimit?: number;

  @IsOptional()
  @IsDateString()
  validFrom?: string;

  @IsOptional()
  @IsDateString()
  validUntil?: string;

  @IsOptional()
  @IsArray()
  @IsNumber({}, { each: true })
  applicableCategories?: number[];

  @IsOptional()
  @IsArray()
  @IsNumber({}, { each: true })
  applicableProducts?: number[];

  @IsOptional()
  @IsArray()
  @IsNumber({}, { each: true })
  excludedCategories?: number[];

  @IsOptional()
  @IsArray()
  @IsNumber({}, { each: true })
  excludedProducts?: number[];

  @IsOptional()
  @IsBoolean()
  isFirstTimeOnly?: boolean;
}
