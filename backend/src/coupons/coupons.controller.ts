import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  ParseIntPipe,
} from '@nestjs/common';
import { CouponsService } from './coupons.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { UserRole } from '../entities/user.entity';
import { CreateCouponDto } from './dto/create-coupon.dto';
import { UpdateCouponDto } from './dto/update-coupon.dto';

@Controller({ path: 'coupons', version: '1' })
export class CouponsController {
  constructor(private readonly couponsService: CouponsService) {}

  @Post()
  @Roles(UserRole.ADMIN)
  @UseGuards(JwtAuthGuard, RolesGuard)
  create(@Body() createCouponDto: CreateCouponDto) {
    return this.couponsService.create(createCouponDto);
  }

  @Get()
  @Roles(UserRole.ADMIN, UserRole.MODERATOR)
  @UseGuards(JwtAuthGuard, RolesGuard)
  findAll() {
    return this.couponsService.findAll();
  }

  @Get('validate/:code')
  @UseGuards(JwtAuthGuard)
  validate(@Param('code') code: string) {
    return this.couponsService.validateCoupon(code);
  }

  @Patch(':id')
  @Roles(UserRole.ADMIN)
  @UseGuards(JwtAuthGuard, RolesGuard)
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateCouponDto: UpdateCouponDto,
  ) {
    return this.couponsService.update(id, updateCouponDto);
  }

  @Delete(':id')
  @Roles(UserRole.ADMIN)
  @UseGuards(JwtAuthGuard, RolesGuard)
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.couponsService.remove(id);
  }
}
