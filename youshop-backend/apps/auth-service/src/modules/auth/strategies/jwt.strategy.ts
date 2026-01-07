import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';

/**
* JWT Strategy
*
* @description
* Passport strategy for JWT authentication.
* Validates JWT tokens and attaches user to request.
*/
@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
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
    // TODO: Load user from database
    // Mock user for now
    const user = {
      id: payload.sub,
      email: payload.email,
      roles: ['user'],
      isActive: true,
    };

    if (!user.isActive) {
      throw new UnauthorizedException('User account is inactive');
    }

    return user;
  }
}