import {
  Injectable,
  UnauthorizedException,
  BadRequestException,
  ConflictException,
  NotFoundException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ConfigService } from '@nestjs/config';
import * as crypto from 'crypto';
import { User, UserRole, UserStatus } from '../entities/user.entity';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { ChangePasswordDto } from './dto/change-password.dto';
import { ForgotPasswordDto } from './dto/forgot-password.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';

export interface JwtPayload {
  sub: number;
  email: string;
  role: UserRole;
  iat?: number;
  exp?: number;
}

export interface AuthResult {
  user: Partial<User>;
  accessToken: string;
  refreshToken: string;
}

@Injectable()
export class AuthService {
  private readonly maxLoginAttempts = 5;
  private readonly lockTime = 2 * 60 * 60 * 1000; // 2 hours

  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  async register(registerDto: RegisterDto): Promise<AuthResult> {
    const { email, password, firstName, lastName, phone } = registerDto;

    // Check if user already exists
    const existingUser = await this.userRepository.findOne({
      where: { email },
    });
    if (existingUser) {
      throw new ConflictException('User with this email already exists');
    }

    // Create new user
    const user = this.userRepository.create({
      email,
      password,
      firstName,
      lastName,
      phone,
      emailVerificationToken: crypto.randomBytes(32).toString('hex'),
    });

    const savedUser = await this.userRepository.save(user);

    // Generate tokens
    const payload: JwtPayload = {
      sub: savedUser.id,
      email: savedUser.email,
      role: savedUser.role,
    };

    const accessToken = this.jwtService.sign(payload);
    const refreshToken = this.jwtService.sign(payload, {
      expiresIn: this.configService.get('JWT_REFRESH_EXPIRES_IN', '7d'),
    });

    return {
      user: this.sanitizeUser(savedUser),
      accessToken,
      refreshToken,
    };
  }

  async login(loginDto: LoginDto): Promise<AuthResult> {
    const { email, password } = loginDto;

    const user = await this.userRepository.findOne({ where: { email } });
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    // Check if account is locked
    if (user.isLocked) {
      throw new UnauthorizedException(
        'Account is temporarily locked due to too many failed attempts',
      );
    }

    // Check if account is active
    if (user.status !== UserStatus.ACTIVE) {
      throw new UnauthorizedException('Account is not active');
    }

    // Validate password
    const isPasswordValid = await user.validatePassword(password);
    if (!isPasswordValid) {
      await this.handleFailedLogin(user);
      throw new UnauthorizedException('Invalid credentials');
    }

    // Reset login attempts on successful login
    await this.handleSuccessfulLogin(user);

    // Generate tokens
    const payload: JwtPayload = {
      sub: user.id,
      email: user.email,
      role: user.role,
    };

    const accessToken = this.jwtService.sign(payload);
    const refreshToken = this.jwtService.sign(payload, {
      expiresIn: this.configService.get('JWT_REFRESH_EXPIRES_IN', '7d'),
    });

    return {
      user: this.sanitizeUser(user),
      accessToken,
      refreshToken,
    };
  }

  async validateUser(email: string, password: string): Promise<User | null> {
    const user = await this.userRepository.findOne({ where: { email } });
    if (user && (await user.validatePassword(password))) {
      return user;
    }
    return null;
  }

  async findById(id: number): Promise<User | null> {
    return this.userRepository.findOne({ where: { id } });
  }

  async changePassword(
    userId: number,
    changePasswordDto: ChangePasswordDto,
  ): Promise<void> {
    const { currentPassword, newPassword } = changePasswordDto;

    const user = await this.userRepository.findOne({ where: { id: userId } });
    if (!user) {
      throw new NotFoundException('User not found');
    }

    const isCurrentPasswordValid = await user.validatePassword(currentPassword);
    if (!isCurrentPasswordValid) {
      throw new BadRequestException('Current password is incorrect');
    }

    user.password = newPassword;
    await this.userRepository.save(user);
  }

  async forgotPassword(forgotPasswordDto: ForgotPasswordDto): Promise<void> {
    const { email } = forgotPasswordDto;

    const user = await this.userRepository.findOne({ where: { email } });
    if (!user) {
      // Don't reveal that user doesn't exist
      return;
    }

    const resetToken = crypto.randomBytes(32).toString('hex');
    const resetExpires = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

    user.passwordResetToken = resetToken;
    user.passwordResetExpires = resetExpires;
    await this.userRepository.save(user);

    // TODO: Send email with reset token
    // await this.emailService.sendPasswordResetEmail(user.email, resetToken);
  }

  async resetPassword(resetPasswordDto: ResetPasswordDto): Promise<void> {
    const { token, newPassword } = resetPasswordDto;

    const user = await this.userRepository.findOne({
      where: {
        passwordResetToken: token,
      },
    });

    if (
      !user ||
      !user.passwordResetExpires ||
      user.passwordResetExpires < new Date()
    ) {
      throw new BadRequestException('Invalid or expired reset token');
    }

    user.password = newPassword;
    user.passwordResetToken = '';
    user.passwordResetExpires = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes
    await this.userRepository.save(user);
  }

  async refreshToken(refreshToken: string): Promise<{ accessToken: string }> {
    try {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      const decoded = this.jwtService.verify(refreshToken);
      if (typeof decoded === 'object' && decoded !== null && 'sub' in decoded) {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
        const user = await this.findById(decoded.sub as number);

        if (!user || user.status !== UserStatus.ACTIVE) {
          throw new UnauthorizedException('User not found or inactive');
        }

        const payload: JwtPayload = {
          sub: user.id,
          email: user.email,
          role: user.role,
        };

        const accessToken = this.jwtService.sign(payload);
        return { accessToken };
      }
      throw new UnauthorizedException('Invalid refresh token');
    } catch {
      throw new UnauthorizedException('Invalid refresh token');
    }
  }

  private async handleFailedLogin(user: User): Promise<void> {
    user.loginAttempts = (user.loginAttempts || 0) + 1;

    if (user.loginAttempts >= this.maxLoginAttempts) {
      user.lockUntil = new Date(Date.now() + this.lockTime);
    }

    await this.userRepository.save(user);
  }

  private async handleSuccessfulLogin(user: User): Promise<void> {
    user.loginAttempts = 0;
    user.lockUntil = new Date(Date.now() + 1000);
    user.lastLogin = new Date();
    await this.userRepository.save(user);
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
