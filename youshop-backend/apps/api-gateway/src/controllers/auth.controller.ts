import { Controller, Post, Get, Body, Headers, HttpCode } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { SimpleHttpService } from '../services/http.service';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly httpService: SimpleHttpService) { }

  @Post('register')
  @ApiOperation({ summary: 'Register new user' })
  async register(@Body() registerDto: any) {
    return this.httpService.post('auth-service/auth/register', registerDto);
  }

  @Post('login')
  @HttpCode(200)
  @ApiOperation({ summary: 'Login user' })
  async login(@Body() loginDto: any) {
    return this.httpService.post('auth-service/auth/login', loginDto);
  }

  @Post('forgot-password')
  @ApiOperation({ summary: 'Forgot password' })
  async forgotPassword(@Body() forgotPasswordDto: any) {
    return this.httpService.post('auth-service/auth/forgot-password', forgotPasswordDto);
  }

  @Post('reset-password')
  @ApiOperation({ summary: 'Reset password' })
  async resetPassword(@Body() resetPasswordDto: any) {
    return this.httpService.post('auth-service/auth/reset-password', resetPasswordDto);
  }

  @Post('refresh')
  @ApiOperation({ summary: 'Refresh token' })
  async refreshToken(@Body() refreshTokenDto: any) {
    return this.httpService.post('auth-service/auth/refresh', refreshTokenDto);
  }

  @Post('logout')
  @ApiOperation({ summary: 'Logout user' })
  async logout(@Headers('authorization') auth: string) {
    return this.httpService.post('auth-service/auth/logout', {}, { authorization: auth });
  }

  @Get('profile')
  @ApiOperation({ summary: 'Get user profile' })
  async getProfile(@Headers('authorization') auth: string) {
    return this.httpService.get('auth-service/auth/profile', { authorization: auth });
  }
}