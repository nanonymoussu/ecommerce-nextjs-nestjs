import {
  Controller,
  Get,
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
import { UsersService, UpdateUserDto, QueryUsersDto } from './users.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { UserRole } from '../entities/user.entity';

@Controller({ path: 'users', version: '1' })
@UseGuards(ThrottlerGuard)
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  @Roles(UserRole.ADMIN, UserRole.MODERATOR)
  @UseGuards(JwtAuthGuard, RolesGuard)
  async findAll(@Query() queryDto: QueryUsersDto) {
    return this.usersService.findAll(queryDto);
  }

  @Get('stats')
  @Roles(UserRole.ADMIN)
  @UseGuards(JwtAuthGuard, RolesGuard)
  async getStats() {
    return this.usersService.getUserStats();
  }

  @Get('me')
  @UseGuards(JwtAuthGuard)
  async getProfile(@CurrentUser('id') userId: number) {
    return this.usersService.findOne(userId);
  }

  @Get(':id')
  @Roles(UserRole.ADMIN, UserRole.MODERATOR)
  @UseGuards(JwtAuthGuard, RolesGuard)
  async findOne(@Param('id', ParseIntPipe) id: number) {
    return this.usersService.findOne(id);
  }

  @Patch('me')
  @UseGuards(JwtAuthGuard)
  async updateProfile(
    @CurrentUser('id') userId: number,
    @Body() updateUserDto: UpdateUserDto,
  ) {
    // Remove role and status from user profile updates
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { role, status, ...profileUpdate } = updateUserDto;
    return this.usersService.update(userId, profileUpdate);
  }

  @Patch(':id')
  @Roles(UserRole.ADMIN)
  @UseGuards(JwtAuthGuard, RolesGuard)
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateUserDto: UpdateUserDto,
  ) {
    return this.usersService.update(id, updateUserDto);
  }

  @Delete(':id')
  @Roles(UserRole.ADMIN)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(@Param('id', ParseIntPipe) id: number) {
    await this.usersService.remove(id);
  }
}
