import {
  Controller,
  Get,
  Post,
  Delete,
  Body,
  Param,
  UseGuards,
  ParseIntPipe,
} from '@nestjs/common';
import { CartsService } from './carts.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';

@Controller({ path: 'carts', version: '1' })
export class CartsController {
  constructor(private readonly cartsService: CartsService) {}

  @Get()
  @UseGuards(JwtAuthGuard)
  async getCart(@CurrentUser('id') userId: number) {
    return this.cartsService.findUserCart(userId);
  }

  @Post('items')
  @UseGuards(JwtAuthGuard)
  async addItem(
    @CurrentUser('id') userId: number,
    @Body() addItemDto: { productId: number; quantity: number },
  ) {
    return this.cartsService.addItem(
      userId,
      addItemDto.productId,
      addItemDto.quantity,
    );
  }

  @Delete('items/:itemId')
  @UseGuards(JwtAuthGuard)
  async removeItem(
    @CurrentUser('id') userId: number,
    @Param('itemId', ParseIntPipe) itemId: number,
  ) {
    await this.cartsService.removeItem(userId, itemId);
  }

  @Delete()
  @UseGuards(JwtAuthGuard)
  async clearCart(@CurrentUser('id') userId: number) {
    await this.cartsService.clearCart(userId);
  }
}
