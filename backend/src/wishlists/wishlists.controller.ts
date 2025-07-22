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
import { WishlistsService } from './wishlists.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';

@Controller({ path: 'wishlists', version: '1' })
export class WishlistsController {
  constructor(private readonly wishlistsService: WishlistsService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  add(
    @Body() addToWishlistDto: { productId: number },
    @CurrentUser('id') userId: number,
  ) {
    return this.wishlistsService.add(userId, addToWishlistDto.productId);
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  findAll(@CurrentUser('id') userId: number) {
    return this.wishlistsService.findByUser(userId);
  }

  @Delete(':productId')
  @UseGuards(JwtAuthGuard)
  remove(
    @Param('productId', ParseIntPipe) productId: number,
    @CurrentUser('id') userId: number,
  ) {
    return this.wishlistsService.remove(userId, productId);
  }
}
