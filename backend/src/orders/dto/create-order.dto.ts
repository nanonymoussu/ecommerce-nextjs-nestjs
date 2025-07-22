import {
  IsString,
  IsOptional,
  IsArray,
  ValidateNested,
  IsObject,
  IsNumber,
  IsPositive,
} from 'class-validator';
import { Type } from 'class-transformer';

export class OrderAddressDto {
  @IsString()
  firstName: string;

  @IsString()
  lastName: string;

  @IsOptional()
  @IsString()
  company?: string;

  @IsString()
  address1: string;

  @IsOptional()
  @IsString()
  address2?: string;

  @IsString()
  city: string;

  @IsString()
  state: string;

  @IsString()
  postalCode: string;

  @IsString()
  country: string;

  @IsOptional()
  @IsString()
  phone?: string;
}

export class CreateOrderItemDto {
  @IsNumber()
  @IsPositive()
  productId: number;

  @IsNumber()
  @IsPositive()
  quantity: number;

  @IsNumber()
  @IsPositive()
  price: number;
}

export class CreateOrderDto {
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateOrderItemDto)
  items: CreateOrderItemDto[];

  @IsObject()
  @ValidateNested()
  @Type(() => OrderAddressDto)
  shippingAddress: OrderAddressDto;

  @IsOptional()
  @IsObject()
  @ValidateNested()
  @Type(() => OrderAddressDto)
  billingAddress?: OrderAddressDto;

  @IsOptional()
  @IsString()
  couponCode?: string;

  @IsOptional()
  @IsString()
  notes?: string;
}
