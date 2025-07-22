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
import { AddressesService } from './addresses.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { CreateAddressDto } from './dto/create-address.dto';
import { UpdateAddressDto } from './dto/update-address.dto';

@Controller({ path: 'addresses', version: '1' })
export class AddressesController {
  constructor(private readonly addressesService: AddressesService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  create(
    @Body() createAddressDto: CreateAddressDto,
    @CurrentUser('id') userId: number,
  ) {
    return this.addressesService.create({ ...createAddressDto, userId });
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  findAll(@CurrentUser('id') userId: number) {
    return this.addressesService.findByUser(userId);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateAddressDto: UpdateAddressDto,
  ) {
    return this.addressesService.update(id, updateAddressDto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.addressesService.remove(id);
  }
}
