import { Injectable, UnauthorizedException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import { LoginDto } from '../dto/login.dto';
import { RegisterDto } from '../dto/register.dto';
import { RefreshTokenDto } from '../dto/refresh-token.dto';
import { ForgotPasswordDto } from '../dto/forgot-password.dto';
import { ResetPasswordDto } from '../dto/reset-password.dto';
import { User } from '@youshop/database';
import * as bcrypt from 'bcrypt';

/**
 * Authentication Service
 * Handles user authentication, registration, and account management logic
 */
@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    private jwtService: JwtService,
  ) { }

  /**
   * Register new user account
   * Creates user, sends verification email, and returns tokens
   */
  async register(registerDto: RegisterDto) {
    // Check if user exists
    const existingUser = await this.userRepository.findOne({
      where: { email: registerDto.email }
    });

    if (existingUser) {
      throw new BadRequestException('User already exists');
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(registerDto.password, 10);

    // Create user
    const user = this.userRepository.create({
      email: registerDto.email,
      password: hashedPassword,
      firstName: registerDto.firstName,
      lastName: registerDto.lastName,
      roles: ['user'],
      isActive: true,
    });

    await this.userRepository.save(user);

    return this.generateTokens(user.id, user.email, user.roles);
  }

  /**
   * Authenticate user with credentials
   * Validates credentials and returns JWT tokens
   */
  async login(loginDto: LoginDto) {
    // Find user with password
    const user = await this.userRepository.findOne({
      where: { email: loginDto.email },
      select: ['id', 'email', 'password', 'firstName', 'lastName', 'roles', 'isActive']
    });

    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    if (!user.isActive) {
      throw new UnauthorizedException('Account is inactive');
    }

    // Verify password
    const isPasswordValid = await bcrypt.compare(loginDto.password, user.password);

    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    return this.generateTokens(user.id, user.email, user.roles);
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
      return this.generateTokens(payload.sub, payload.email, payload.roles || ['user']);
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
   * Get user profile
   */
  async getProfile(userId: string) {
    try {
      console.log('🔍 Getting profile for user:', userId);
      const user = await this.userRepository.findOne({
        where: { id: userId }
      });

      if (!user) {
        console.log('❌ User not found');
        throw new UnauthorizedException('User not found');
      }

      console.log('✅ Profile found');
      return user;
    } catch (error) {
      console.error('❌ Error in getProfile:', error);
      throw error;
    }
  }

  /**
   * Generate JWT access and refresh tokens
   * Creates signed tokens for user authentication
   */
  private async generateTokens(userId: string, email: string, roles: string[]) {
    const payload = { sub: userId, email, roles };
    const accessToken = this.jwtService.sign(payload);
    const refreshToken = this.jwtService.sign(payload, { expiresIn: '7d' });

    return {
      accessToken,
      refreshToken,
      user: {
        id: userId,
        email,
        roles
      }
    };
  }
}