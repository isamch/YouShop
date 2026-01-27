import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { User } from '@youshop/database';

/**
* JWT Strategy
*
* @description
* Passport strategy for JWT authentication.
* Validates JWT tokens and attaches user to request.
*/
@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: process.env.JWT_SECRET || 'your-secret-key',
    });
  }

  /**
   * Validate JWT payload
   *
   * @param payload - Decoded JWT payload
   * @returns User object (attached to request)
   */
  async validate(payload: any) {
    console.log('🔍 JwtStrategy Validate:', payload);
    const user = await this.userRepository.findOne({
      where: { id: payload.sub }
    });

    if (!user) {
      console.log('❌ User not found for ID:', payload.sub);
      throw new UnauthorizedException('User not found');
    }

    if (!user.isActive) {
      console.log('❌ User inactive:', user.email);
      throw new UnauthorizedException('User account is inactive');
    }

    console.log('✅ User validated:', user.email);
    return user;
  }
}