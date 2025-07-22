import {
  IsString,
  IsOptional,
  IsEnum,
  IsBoolean,
  IsNumber,
} from 'class-validator';
import { AddressType } from '../../entities/address.entity';

export class CreateAddressDto {
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

  @IsEnum(AddressType)
  type: AddressType;

  @IsOptional()
  @IsBoolean()
  isDefault?: boolean;

  @IsOptional()
  @IsNumber()
  userId?: number;
}
