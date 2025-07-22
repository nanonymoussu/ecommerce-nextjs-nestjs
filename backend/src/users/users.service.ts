import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User, UserRole, UserStatus } from '../entities/user.entity';

export interface UpdateUserDto {
  firstName?: string;
  lastName?: string;
  phone?: string;
  role?: UserRole;
  status?: UserStatus;
}

export interface QueryUsersDto {
  page?: number;
  limit?: number;
  search?: string;
  role?: UserRole;
  status?: UserStatus;
  sortBy?: string;
  sortOrder?: 'ASC' | 'DESC';
}

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async findAll(queryDto: QueryUsersDto) {
    const {
      page = 1,
      limit = 20,
      search,
      role,
      status,
      sortBy = 'createdAt',
      sortOrder = 'DESC',
    } = queryDto;

    const query = this.userRepository.createQueryBuilder('user');

    // Search filter
    if (search) {
      query.andWhere(
        '(user.firstName ILIKE :search OR user.lastName ILIKE :search OR user.email ILIKE :search)',
        { search: `%${search}%` },
      );
    }

    // Role filter
    if (role) {
      query.andWhere('user.role = :role', { role });
    }

    // Status filter
    if (status) {
      query.andWhere('user.status = :status', { status });
    }

    // Sorting
    const validSortFields = [
      'createdAt',
      'updatedAt',
      'firstName',
      'lastName',
      'email',
      'lastLogin',
    ];

    if (validSortFields.includes(sortBy)) {
      query.orderBy(`user.${sortBy}`, sortOrder);
    } else {
      query.orderBy('user.createdAt', 'DESC');
    }

    // Pagination
    const skip = (page - 1) * limit;
    query.skip(skip).take(limit);

    const [users, total] = await query.getManyAndCount();

    return {
      users: users.map((user) => this.sanitizeUser(user)),
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    };
  }

  async findOne(id: number): Promise<User> {
    const user = await this.userRepository.findOne({
      where: { id },
      relations: ['orders', 'addresses', 'reviews'],
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return user;
  }

  async update(
    id: number,
    updateUserDto: UpdateUserDto,
  ): Promise<Partial<User>> {
    const user = await this.findOne(id);

    Object.assign(user, updateUserDto);
    const savedUser = await this.userRepository.save(user);

    return this.sanitizeUser(savedUser);
  }

  async remove(id: number): Promise<void> {
    const user = await this.findOne(id);
    await this.userRepository.remove(user);
  }

  async getUserStats() {
    const totalUsers = await this.userRepository.count();
    const activeUsers = await this.userRepository.count({
      where: { status: UserStatus.ACTIVE },
    });
    const adminUsers = await this.userRepository.count({
      where: { role: UserRole.ADMIN },
    });
    const customerUsers = await this.userRepository.count({
      where: { role: UserRole.CUSTOMER },
    });

    return {
      totalUsers,
      activeUsers,
      adminUsers,
      customerUsers,
    };
  }

  private sanitizeUser(user: User): Partial<User> {
    const {
      password: _password,
      passwordResetToken: _passwordResetToken,
      emailVerificationToken: _emailVerificationToken,
      ...sanitized
    } = user;
    // These variables are intentionally unused to exclude from the sanitized object
    void _password;
    void _passwordResetToken;
    void _emailVerificationToken;
    return sanitized;
  }
}
