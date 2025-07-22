import {
  Controller,
  Post,
  Get,
  Body,
  Param,
  UseGuards,
  ParseIntPipe,
} from '@nestjs/common';
import { PaymentsService } from './payments.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { UserRole } from '../entities/user.entity';
import { CreatePaymentDto } from './dto/create-payment.dto';

@Controller({ path: 'payments', version: '1' })
export class PaymentsController {
  constructor(private readonly paymentsService: PaymentsService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  create(@Body() createPaymentDto: CreatePaymentDto) {
    return this.paymentsService.create(createPaymentDto);
  }

  @Get('order/:orderId')
  @UseGuards(JwtAuthGuard)
  findByOrder(@Param('orderId', ParseIntPipe) orderId: number) {
    return this.paymentsService.findByOrder(orderId);
  }

  @Get()
  @Roles(UserRole.ADMIN, UserRole.MODERATOR)
  @UseGuards(JwtAuthGuard, RolesGuard)
  findAll() {
    return this.paymentsService.findAll();
  }
}
