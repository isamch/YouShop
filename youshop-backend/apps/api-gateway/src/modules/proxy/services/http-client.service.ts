import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';
import { AxiosRequestConfig, AxiosResponse } from 'axios';
import { SERVICE_REGISTRY, ServiceConfig } from '../../../config/service-registry';

@Injectable()
export class HttpClientService {
  constructor(private readonly httpService: HttpService) {}

  async forwardRequest(
    serviceName: string,
    path: string,
    method: string,
    data?: any,
    headers?: Record<string, string>,
    query?: Record<string, any>
  ): Promise<any> {
    const service = SERVICE_REGISTRY[serviceName];
    
    if (!service) {
      throw new HttpException(
        `Service ${serviceName} not found`,
        HttpStatus.SERVICE_UNAVAILABLE
      );
    }

    try {
      const config: AxiosRequestConfig = {
        method: method.toLowerCase() as any,
        url: `${service.url}${path}`,
        timeout: service.timeout,
        headers: {
          'Content-Type': 'application/json',
          ...headers,
        },
      };

      if (data) {
        config.data = data;
      }

      if (query) {
        config.params = query;
      }

      const response: AxiosResponse = await firstValueFrom(
        this.httpService.request(config)
      );

      return response.data;
    } catch (error) {
      if (error.response) {
        // Service responded with error status
        throw new HttpException(
          error.response.data || 'Service error',
          error.response.status
        );
      } else if (error.code === 'ECONNREFUSED') {
        // Service is down
        throw new HttpException(
          `Service ${serviceName} is unavailable`,
          HttpStatus.SERVICE_UNAVAILABLE
        );
      } else {
        // Other errors
        throw new HttpException(
          'Internal server error',
          HttpStatus.INTERNAL_SERVER_ERROR
        );
      }
    }
  }

  async checkServiceHealth(serviceName: string): Promise<boolean> {
    const service = SERVICE_REGISTRY[serviceName];
    
    if (!service) {
      return false;
    }

    try {
      await firstValueFrom(
        this.httpService.get(`${service.url}${service.healthCheck}`, {
          timeout: 3000,
        })
      );
      return true;
    } catch (error) {
      return false;
    }
  }

  async checkAllServicesHealth(): Promise<Record<string, boolean>> {
    const healthStatus: Record<string, boolean> = {};
    
    for (const serviceName of Object.keys(SERVICE_REGISTRY)) {
      healthStatus[serviceName] = await this.checkServiceHealth(serviceName);
    }
    
    return healthStatus;
  }
}