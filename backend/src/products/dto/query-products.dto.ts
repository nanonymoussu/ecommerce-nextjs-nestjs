import {
  IsOptional,
  IsString,
  IsNumber,
  IsEnum,
  IsBoolean,
  Min,
  Max,
  IsArray,
} from 'class-validator';
import { Transform, Type } from 'class-transformer';
import { ProductStatus } from '../../entities/product.entity';

export class QueryProductsDto {
  @IsOptional()
  @IsNumber()
  @Min(1)
  @Type(() => Number)
  page?: number = 1;

  @IsOptional()
  @IsNumber()
  @Min(1)
  @Max(100)
  @Type(() => Number)
  limit?: number = 20;

  @IsOptional()
  @IsString()
  search?: string;

  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  categoryId?: number;

  @IsOptional()
  @IsEnum(ProductStatus)
  status?: ProductStatus;

  @IsOptional()
  @IsBoolean()
  @Transform(({ value }) => value === 'true')
  isFeatured?: boolean;

  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  minPrice?: number;

  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  maxPrice?: number;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  @Transform(
    ({ value }) => (Array.isArray(value) ? value : [value]) as string[],
  )
  tags?: string[];

  @IsOptional()
  @IsString()
  sortBy?: string = 'createdAt';

  @IsOptional()
  @IsString()
  sortOrder?: 'ASC' | 'DESC' = 'DESC';

  @IsOptional()
  @IsBoolean()
  @Transform(({ value }) => value === 'true')
  inStock?: boolean;
}
