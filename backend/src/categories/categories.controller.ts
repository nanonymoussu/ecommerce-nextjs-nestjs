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
  HttpStatus,
  HttpCode,
} from '@nestjs/common';
import { ThrottlerGuard } from '@nestjs/throttler';
import {
  CategoriesService,
  CreateCategoryDto,
  UpdateCategoryDto,
} from './categories.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { Public } from '../auth/decorators/public.decorator';
import { UserRole } from '../entities/user.entity';

@Controller({ path: 'categories', version: '1' })
@UseGuards(ThrottlerGuard)
export class CategoriesController {
  constructor(private readonly categoriesService: CategoriesService) {}

  @Post()
  @Roles(UserRole.ADMIN, UserRole.MODERATOR)
  @UseGuards(JwtAuthGuard, RolesGuard)
  async create(@Body() createCategoryDto: CreateCategoryDto) {
    return this.categoriesService.create(createCategoryDto);
  }

  @Get()
  @Public()
  async findAll() {
    return this.categoriesService.findAll();
  }

  @Get('active')
  @Public()
  async findActive() {
    return this.categoriesService.findActive();
  }

  @Get('hierarchy')
  @Public()
  async getHierarchy() {
    return this.categoriesService.getHierarchy();
  }

  @Get(':id')
  @Public()
  async findOne(@Param('id', ParseIntPipe) id: number) {
    return this.categoriesService.findOne(id);
  }

  @Get('slug/:slug')
  @Public()
  async findBySlug(@Param('slug') slug: string) {
    return this.categoriesService.findBySlug(slug);
  }

  @Patch(':id')
  @Roles(UserRole.ADMIN, UserRole.MODERATOR)
  @UseGuards(JwtAuthGuard, RolesGuard)
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateCategoryDto: UpdateCategoryDto,
  ) {
    return this.categoriesService.update(id, updateCategoryDto);
  }

  @Delete(':id')
  @Roles(UserRole.ADMIN)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(@Param('id', ParseIntPipe) id: number) {
    await this.categoriesService.remove(id);
  }
}
