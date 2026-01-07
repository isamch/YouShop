import { Injectable, UnauthorizedException, BadRequestException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { LoginDto } from '../dto/login.dto';
import { RegisterDto } from '../dto/register.dto';
import { RefreshTokenDto } from '../dto/refresh-token.dto';
import { ForgotPasswordDto } from '../dto/forgot-password.dto';
import { ResetPasswordDto } from '../dto/reset-password.dto';
import * as bcrypt from 'bcrypt';

/**
 * Authentication Service
 * Handles user authentication, registration, and account management logic
 */
@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
  ) { }

  /**
   * Register new user account
   * Creates user, sends verification email, and returns tokens
   */
  async register(registerDto: RegisterDto) {
    // TODO: Implement user creation
    const hashedPassword = await bcrypt.hash(registerDto.password, 10);
    
    // Mock user creation for now
    const user = {
      id: '1',
      email: registerDto.email,
      firstName: registerDto.firstName,
      lastName: registerDto.lastName,
      roles: ['user'],
    };

    return this.generateTokens(user.id, user.email);
  }

  /**
   * Authenticate user with credentials
   * Validates credentials and returns JWT tokens
   */
  async login(loginDto: LoginDto) {
    // TODO: Implement user validation
    // Mock validation for now
    if (loginDto.email === 'admin@youshop.com' && loginDto.password === 'password') {
      const user = {
        id: '1',
        email: loginDto.email,
        roles: ['admin'],
      };
      return this.generateTokens(user.id, user.email);
    }

    throw new UnauthorizedException('Invalid credentials');
  }

  /**
   * Send password reset email
   * Generates reset token and sends reset link
   */
  async forgotPassword(forgotPasswordDto: ForgotPasswordDto) {
    // TODO: Implement password reset
    return { message: 'If email exists, reset link has been sent' };
  }

  /**
   * Reset user password with token
   * Updates password using valid reset token
   */
  async resetPassword(resetPasswordDto: ResetPasswordDto) {
    // TODO: Implement password reset
    return { message: 'Password reset successfully' };
  }

  /**
   * Refresh JWT access token
   * Validates refresh token and generates new tokens
   */
  async refreshTokens(refreshTokenDto: RefreshTokenDto) {
    try {
      const payload = this.jwtService.verify(refreshTokenDto.refreshToken);
      return this.generateTokens(payload.sub, payload.email);
    } catch (e) {
      throw new UnauthorizedException('Invalid refresh token');
    }
  }

  /**
   * Logout user and clear tokens
   * Invalidates refresh token in database
   */
  async logout(userId: string) {
    // TODO: Implement token invalidation
    return { message: 'Logged out successfully' };
  }

  /**
   * Generate JWT access and refresh tokens
   * Creates signed tokens for user authentication
   */
  private async generateTokens(userId: string, email: string) {
    const payload = { sub: userId, email };
    const accessToken = this.jwtService.sign(payload);
    const refreshToken = this.jwtService.sign(payload, { expiresIn: '7d' });
    
    return { 
      access_token: accessToken, 
      refresh_token: refreshToken 
    };
  }
}