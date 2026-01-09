import { Controller, Get } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { HttpClientService } from '../services/http-client.service';

@ApiTags('health')
@Controller('health')
export class HealthController {
  constructor(private readonly httpClient: HttpClientService) {}

  @Get()
  @ApiOperation({ summary: 'Check API Gateway health' })
  @ApiResponse({ status: 200, description: 'API Gateway is healthy' })
  getHealth() {
    return {
      status: 'ok',
      timestamp: new Date().toISOString(),
      service: 'api-gateway',
    };
  }

  @Get('services')
  @ApiOperation({ summary: 'Check all services health' })
  @ApiResponse({ status: 200, description: 'Services health status' })
  async getServicesHealth() {
    const servicesHealth = await this.httpClient.checkAllServicesHealth();
    
    const overallStatus = Object.values(servicesHealth).every(status => status) 
      ? 'healthy' 
      : 'degraded';

    return {
      status: overallStatus,
      timestamp: new Date().toISOString(),
      services: servicesHealth,
    };
  }
}