import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Address } from '../entities/address.entity';
import { CreateAddressDto } from './dto/create-address.dto';
import { UpdateAddressDto } from './dto/update-address.dto';

@Injectable()
export class AddressesService {
  constructor(
    @InjectRepository(Address)
    private readonly addressRepository: Repository<Address>,
  ) {}

  async create(createAddressDto: CreateAddressDto): Promise<Address> {
    const address = this.addressRepository.create(createAddressDto);
    return this.addressRepository.save(address);
  }

  async findByUser(userId: number): Promise<Address[]> {
    return this.addressRepository.find({
      where: { userId },
      order: { isDefault: 'DESC', createdAt: 'DESC' },
    });
  }

  async update(
    id: number,
    updateAddressDto: UpdateAddressDto,
  ): Promise<Address> {
    await this.addressRepository.update(id, updateAddressDto);
    const address = await this.addressRepository.findOne({ where: { id } });
    if (!address) {
      throw new NotFoundException('Address not found');
    }
    return address;
  }

  async remove(id: number): Promise<void> {
    await this.addressRepository.delete(id);
  }
}
