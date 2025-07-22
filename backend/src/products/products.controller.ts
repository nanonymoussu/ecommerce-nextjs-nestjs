import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  UseGuards,
  ParseIntPipe,
  HttpStatus,
  HttpCode,
} from '@nestjs/common';
import { ThrottlerGuard } from '@nestjs/throttler';
import { ProductsService } from './products.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { Public } from '../auth/decorators/public.decorator';
import { UserRole } from '../entities/user.entity';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { QueryProductsDto } from './dto/query-products.dto';

@Controller({ path: 'products', version: '1' })
@UseGuards(ThrottlerGuard)
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Post()
  @Roles(UserRole.ADMIN, UserRole.MODERATOR)
  @UseGuards(JwtAuthGuard, RolesGuard)
  async create(@Body() createProductDto: CreateProductDto) {
    return this.productsService.create(createProductDto);
  }

  @Get()
  @Public()
  async findAll(@Query() queryDto: QueryProductsDto) {
    return this.productsService.findAll(queryDto);
  }

  @Get('featured')
  @Public()
  async getFeatured(@Query('limit', ParseIntPipe) limit: number = 10) {
    return this.productsService.getFeaturedProducts(limit);
  }

  @Get(':id')
  @Public()
  async findOne(@Param('id', ParseIntPipe) id: number) {
    return this.productsService.findOne(id);
  }

  @Get('slug/:slug')
  @Public()
  async findBySlug(@Param('slug') slug: string) {
    return this.productsService.findBySlug(slug);
  }

  @Get(':id/related')
  @Public()
  async getRelated(
    @Param('id', ParseIntPipe) id: number,
    @Query('limit', ParseIntPipe) limit: number = 5,
  ) {
    return this.productsService.getRelatedProducts(id, limit);
  }

  @Patch(':id')
  @Roles(UserRole.ADMIN, UserRole.MODERATOR)
  @UseGuards(JwtAuthGuard, RolesGuard)
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateProductDto: UpdateProductDto,
  ) {
    return this.productsService.update(id, updateProductDto);
  }

  @Patch(':id/inventory')
  @Roles(UserRole.ADMIN, UserRole.MODERATOR)
  @UseGuards(JwtAuthGuard, RolesGuard)
  async updateInventory(
    @Param('id', ParseIntPipe) id: number,
    @Body('quantity', ParseIntPipe) quantity: number,
  ) {
    return this.productsService.updateInventory(id, quantity);
  }

  @Delete(':id')
  @Roles(UserRole.ADMIN)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(@Param('id', ParseIntPipe) id: number) {
    await this.productsService.remove(id);
  }
}
