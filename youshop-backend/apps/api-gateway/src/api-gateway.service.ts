import { Injectable } from '@nestjs/common';

@Injectable()
export class ApiGatewayService {
  getHello(): string {
    return 'YouShop API Gateway - Simple Version';
  }
}
