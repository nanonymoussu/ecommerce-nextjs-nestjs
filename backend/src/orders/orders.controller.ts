import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  UseGuards,
  ParseIntPipe,
} from '@nestjs/common';
import { OrdersService } from './orders.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { UserRole } from '../entities/user.entity';
import { OrderStatus } from '../entities/order.entity';
import { CreateOrderDto } from './dto/create-order.dto';

@Controller({ path: 'orders', version: '1' })
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  async create(@Body() createOrderDto: CreateOrderDto) {
    return this.ordersService.create(createOrderDto);
  }

  @Get()
  @Roles(UserRole.ADMIN, UserRole.MODERATOR)
  @UseGuards(JwtAuthGuard, RolesGuard)
  async findAll() {
    return this.ordersService.findAll();
  }

  @Get('my-orders')
  @UseGuards(JwtAuthGuard)
  async findUserOrders(@CurrentUser('id') userId: number) {
    return this.ordersService.findAll(userId);
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  async findOne(@Param('id', ParseIntPipe) id: number) {
    return this.ordersService.findOne(id);
  }

  @Patch(':id/status')
  @Roles(UserRole.ADMIN, UserRole.MODERATOR)
  @UseGuards(JwtAuthGuard, RolesGuard)
  async updateStatus(
    @Param('id', ParseIntPipe) id: number,
    @Body('status') status: OrderStatus,
  ) {
    return this.ordersService.updateStatus(id, status);
  }

  @Patch(':id/cancel')
  @UseGuards(JwtAuthGuard)
  async cancel(@Param('id', ParseIntPipe) id: number) {
    return this.ordersService.cancel(id);
  }
}
