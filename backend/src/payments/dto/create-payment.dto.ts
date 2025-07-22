import {
  IsNumber,
  IsPositive,
  IsEnum,
  IsString,
  IsOptional,
  IsObject,
} from 'class-validator';
import { PaymentMethod } from '../../entities/payment.entity';

export class CreatePaymentDto {
  @IsNumber()
  @IsPositive()
  orderId: number;

  @IsString()
  transactionId: string;

  @IsEnum(PaymentMethod)
  method: PaymentMethod;

  @IsNumber()
  @IsPositive()
  amount: number;

  @IsOptional()
  @IsString()
  currency?: string;

  @IsOptional()
  @IsString()
  gatewayTransactionId?: string;

  @IsOptional()
  @IsObject()
  gatewayResponse?: Record<string, unknown>;

  @IsOptional()
  @IsObject()
  metadata?: Record<string, unknown>;
}
