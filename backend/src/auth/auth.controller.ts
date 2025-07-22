import {
  Controller,
  Post,
  Body,
  HttpCode,
  HttpStatus,
  UseGuards,
  Get,
  Patch,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { Public } from './decorators/public.decorator';
import { CurrentUser } from './decorators/current-user.decorator';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { ChangePasswordDto } from './dto/change-password.dto';
import { ForgotPasswordDto } from './dto/forgot-password.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';
import { User } from '../entities/user.entity';

@Controller('v1/auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Public()
  @Post('register')
  async register(@Body() registerDto: RegisterDto) {
    return this.authService.register(registerDto);
  }

  @Public()
  @Post('login')
  @HttpCode(HttpStatus.OK)
  async login(@Body() loginDto: LoginDto) {
    return this.authService.login(loginDto);
  }

  @Post('logout')
  @HttpCode(HttpStatus.OK)
  logout() {
    // In a more sophisticated setup, you might want to blacklist the token
    return { message: 'Logout successful' };
  }

  @Public()
  @Post('refresh')
  @HttpCode(HttpStatus.OK)
  async refreshToken(@Body('refreshToken') refreshToken: string) {
    if (!refreshToken) {
      throw new UnauthorizedException('Refresh token is required');
    }
    return this.authService.refreshToken(refreshToken);
  }

  @Public()
  @Post('forgot-password')
  @HttpCode(HttpStatus.OK)
  async forgotPassword(@Body() forgotPasswordDto: ForgotPasswordDto) {
    await this.authService.forgotPassword(forgotPasswordDto);
    return { message: 'Password reset email sent if account exists' };
  }

  @Public()
  @Post('reset-password')
  @HttpCode(HttpStatus.OK)
  async resetPassword(@Body() resetPasswordDto: ResetPasswordDto) {
    await this.authService.resetPassword(resetPasswordDto);
    return { message: 'Password reset successful' };
  }

  @UseGuards(JwtAuthGuard)
  @Get('profile')
  getProfile(@CurrentUser() user: User) {
    return {
      id: user.id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      phone: user.phone,
      role: user.role,
      status: user.status,
      isEmailVerified: user.isEmailVerified,
      createdAt: user.createdAt,
      lastLogin: user.lastLogin,
    };
  }

  @UseGuards(JwtAuthGuard)
  @Patch('change-password')
  @HttpCode(HttpStatus.OK)
  async changePassword(
    @CurrentUser('id') userId: number,
    @Body() changePasswordDto: ChangePasswordDto,
  ) {
    await this.authService.changePassword(userId, changePasswordDto);
    return { message: 'Password changed successfully' };
  }

  @UseGuards(JwtAuthGuard)
  @Get('verify-token')
  @HttpCode(HttpStatus.OK)
  verifyToken(@CurrentUser() user: User) {
    return {
      valid: true,
      user: {
        id: user.id,
        email: user.email,
        role: user.role,
      },
    };
  }
}
