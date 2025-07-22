import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Order, OrderStatus } from '../entities/order.entity';
import { OrderItem } from '../entities/order-item.entity';
import { CreateOrderDto } from './dto/create-order.dto';

@Injectable()
export class OrdersService {
  constructor(
    @InjectRepository(Order)
    private readonly orderRepository: Repository<Order>,
    @InjectRepository(OrderItem)
    private readonly orderItemRepository: Repository<OrderItem>,
  ) {}

  async create(createOrderDto: CreateOrderDto): Promise<Order> {
    const order = this.orderRepository.create(createOrderDto);
    return this.orderRepository.save(order);
  }

  async findAll(userId?: number) {
    const query = this.orderRepository
      .createQueryBuilder('order')
      .leftJoinAndSelect('order.items', 'items')
      .leftJoinAndSelect('order.user', 'user');

    if (userId) {
      query.where('order.userId = :userId', { userId });
    }

    return query.getMany();
  }

  async findOne(id: number): Promise<Order> {
    const order = await this.orderRepository.findOne({
      where: { id },
      relations: ['items', 'items.product', 'user', 'payments'],
    });

    if (!order) {
      throw new NotFoundException('Order not found');
    }

    return order;
  }

  async updateStatus(id: number, status: OrderStatus): Promise<Order> {
    const order = await this.findOne(id);
    order.status = status;
    return this.orderRepository.save(order);
  }

  async cancel(id: number): Promise<Order> {
    return this.updateStatus(id, OrderStatus.CANCELLED);
  }
}
