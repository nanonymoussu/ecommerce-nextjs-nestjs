import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Payment } from '../entities/payment.entity';
import { CreatePaymentDto } from './dto/create-payment.dto';

@Injectable()
export class PaymentsService {
  constructor(
    @InjectRepository(Payment)
    private readonly paymentRepository: Repository<Payment>,
  ) {}

  async create(createPaymentDto: CreatePaymentDto): Promise<Payment> {
    const payment = this.paymentRepository.create(createPaymentDto);
    return this.paymentRepository.save(payment);
  }

  async findByOrder(orderId: number): Promise<Payment[]> {
    return this.paymentRepository.find({
      where: { orderId },
      order: { createdAt: 'DESC' },
    });
  }

  async findAll(): Promise<Payment[]> {
    return this.paymentRepository.find({
      relations: ['order'],
      order: { createdAt: 'DESC' },
    });
  }
}
