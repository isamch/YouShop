import { Injectable, NestMiddleware, HttpException, HttpStatus } from '@nestjs/common';
import type { Request, Response, NextFunction } from 'express';

interface RateLimitStore {
  [key: string]: {
    count: number;
    resetTime: number;
  };
}

@Injectable()
export class RateLimitMiddleware implements NestMiddleware {
  private store: RateLimitStore = {};
  private readonly windowMs = 15 * 60 * 1000; // 15 minutes
  private readonly maxRequests = 100; // max requests per window

  use(req: Request, res: Response, next: NextFunction) {
    const clientId = this.getClientId(req);
    const now = Date.now();
    
    // Clean up expired entries
    this.cleanup(now);
    
    // Get or create client entry
    if (!this.store[clientId]) {
      this.store[clientId] = {
        count: 0,
        resetTime: now + this.windowMs,
      };
    }
    
    const clientData = this.store[clientId];
    
    // Reset if window has expired
    if (now > clientData.resetTime) {
      clientData.count = 0;
      clientData.resetTime = now + this.windowMs;
    }
    
    // Check if limit exceeded
    if (clientData.count >= this.maxRequests) {
      const resetTimeSeconds = Math.ceil((clientData.resetTime - now) / 1000);
      
      res.set({
        'X-RateLimit-Limit': this.maxRequests.toString(),
        'X-RateLimit-Remaining': '0',
        'X-RateLimit-Reset': resetTimeSeconds.toString(),
      });
      
      throw new HttpException(
        'Too many requests, please try again later',
        HttpStatus.TOO_MANY_REQUESTS
      );
    }
    
    // Increment counter
    clientData.count++;
    
    // Set rate limit headers
    res.set({
      'X-RateLimit-Limit': this.maxRequests.toString(),
      'X-RateLimit-Remaining': (this.maxRequests - clientData.count).toString(),
      'X-RateLimit-Reset': Math.ceil((clientData.resetTime - now) / 1000).toString(),
    });
    
    next();
  }
  
  private getClientId(req: Request): string {
    // Use IP address as client identifier
    return req.ip || req.connection.remoteAddress || 'unknown';
  }
  
  private cleanup(now: number) {
    Object.keys(this.store).forEach(clientId => {
      if (now > this.store[clientId].resetTime) {
        delete this.store[clientId];
      }
    });
  }
}