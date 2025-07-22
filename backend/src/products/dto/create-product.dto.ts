import {
  IsString,
  IsNumber,
  IsOptional,
  IsArray,
  IsEnum,
  IsBoolean,
  Min,
  MaxLength,
  IsUrl,
  IsObject,
  ValidateNested,
} from 'class-validator';
import { Type, Transform } from 'class-transformer';
import { ProductStatus } from '../../entities/product.entity';

class DimensionsDto {
  @IsNumber()
  @Min(0)
  length: number;

  @IsNumber()
  @Min(0)
  width: number;

  @IsNumber()
  @Min(0)
  height: number;
}

export class CreateProductDto {
  @IsString()
  @MaxLength(255)
  name: string;

  @IsString()
  @MaxLength(255)
  slug: string;

  @IsString()
  description: string;

  @IsOptional()
  @IsString()
  shortDescription?: string;

  @IsNumber()
  @Min(0)
  @Transform(({ value }) => parseFloat(value as string))
  price: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  @Transform(({ value }) => parseFloat(value as string))
  comparePrice?: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  @Transform(({ value }) => parseFloat(value as string))
  costPrice?: number;

  @IsString()
  @MaxLength(100)
  sku: string;

  @IsOptional()
  @IsNumber()
  @Min(0)
  inventory?: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  lowStockThreshold?: number;

  @IsOptional()
  @IsBoolean()
  trackInventory?: boolean;

  @IsOptional()
  @IsNumber()
  @Min(0)
  weight?: number;

  @IsOptional()
  @ValidateNested()
  @Type(() => DimensionsDto)
  dimensions?: DimensionsDto;

  @IsOptional()
  @IsArray()
  @IsUrl({}, { each: true })
  images?: string[];

  @IsOptional()
  @IsEnum(ProductStatus)
  status?: ProductStatus;

  @IsOptional()
  @IsBoolean()
  isFeatured?: boolean;

  @IsOptional()
  @IsObject()
  attributes?: Record<string, any>;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  tags?: string[];

  @IsOptional()
  @IsString()
  @MaxLength(255)
  seoTitle?: string;

  @IsOptional()
  @IsString()
  seoDescription?: string;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  seoKeywords?: string[];

  @IsNumber()
  categoryId: number;
}
