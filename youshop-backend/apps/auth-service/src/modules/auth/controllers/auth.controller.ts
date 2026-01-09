import { Controller, Post, Body, Get, UseGuards } from '@nestjs/common';
import { AuthService } from '../services/auth.service';
import { LoginDto } from '../dto/login.dto';
import { RegisterDto } from '../dto/register.dto';
import { CurrentUser } from '@youshop/shared';
import { RefreshTokenDto } from '../dto/refresh-token.dto';
import { ForgotPasswordDto } from '../dto/forgot-password.dto';
import { ResetPasswordDto } from '../dto/reset-password.dto';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';

/**
 * Public Decorator - inline definition
 */
import { SetMetadata } from '@nestjs/common';
const Public = () => SetMetadata('isPublic', true);

/**
 * Authentication Controller
 * Handles user authentication, registration, and account management
 */
@ApiTags('auth')
@Controller('auth')
@UseGuards(JwtAuthGuard)
export class AuthController {
  constructor(private readonly authService: AuthService) { }

  /**
   * Register a new user account
   * Creates user and sends verification email
   */
  @ApiOperation({ summary: 'Register a new user' })
  @Public()
  @Post('register')
  register(@Body() registerDto: RegisterDto) {
    return this.authService.register(registerDto);
  }

  /**
   * Authenticate user with email and password
   * Returns JWT tokens for authenticated user
   */
  @ApiOperation({ summary: 'Login user' })
  @Public()
  @Post('login')
  login(@Body() loginDto: LoginDto) {
    return this.authService.login(loginDto);
  }

  /**
   * Request password reset email
   * Sends password reset link to user email
   */
  @ApiOperation({ summary: 'Request password reset' })
  @Public()
  @Post('forgot-password')
  forgotPassword(@Body() forgotPasswordDto: ForgotPasswordDto) {
    return this.authService.forgotPassword(forgotPasswordDto);
  }

  /**
   * Reset user password with token
   * Updates password using reset token from email
   */
  @ApiOperation({ summary: 'Reset password' })
  @Public()
  @Post('reset-password')
  resetPassword(@Body() resetPasswordDto: ResetPasswordDto) {
    return this.authService.resetPassword(resetPasswordDto);
  }

  /**
   * Refresh JWT access token
   * Generates new access token using refresh token
   */
  @ApiOperation({ summary: 'Refresh tokens' })
  @Public()
  @Post('refresh')
  refreshTokens(@Body() refreshTokenDto: RefreshTokenDto) {
    return this.authService.refreshTokens(refreshTokenDto);
  }

  /**
   * Logout user and invalidate tokens
   * Clears refresh token from database
   */
  @ApiOperation({ summary: 'Logout user' })
  @ApiBearerAuth()
  @Post('logout')
  logout(@CurrentUser('id') userId: string) {
    return this.authService.logout(userId);
  }

  /**
   * Get current user profile information
   * Returns authenticated user details
   */
  @ApiOperation({ summary: 'Get user profile' })
  @ApiBearerAuth()
  @Get('profile')
  getProfile(@CurrentUser() user: any) {
    return { user };
  }
}