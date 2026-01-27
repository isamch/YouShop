import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';
import { SERVICES_CONFIG } from '../config/services.config';

@Injectable()
export class SimpleHttpService {
  constructor(private readonly httpService: HttpService) { }

  async post(serviceEndpoint: string, data: any, headers?: any) {
    try {
      const [service, ...endpointParts] = serviceEndpoint.split('/');
      const endpoint = endpointParts.join('/');
      const serviceUrl = this.getServiceUrl(service);

      const response = await firstValueFrom(
        this.httpService.post(`${serviceUrl}/api/${endpoint}`, data, { headers })
      );

      return response.data;
    } catch (error) {
      throw new HttpException(
        error.response?.data || 'Service error',
        error.response?.status || HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  async get(serviceEndpoint: string, headers?: any) {
    try {
      const [service, ...endpointParts] = serviceEndpoint.split('/');
      const endpoint = endpointParts.join('/');
      const serviceUrl = this.getServiceUrl(service);

      const response = await firstValueFrom(
        this.httpService.get(`${serviceUrl}/api/${endpoint}`, { headers })
      );

      return response.data;
    } catch (error) {
      throw new HttpException(
        error.response?.data || 'Service error',
        error.response?.status || HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  async patch(serviceEndpoint: string, data: any, headers?: any) {
    try {
      const [service, ...endpointParts] = serviceEndpoint.split('/');
      const endpoint = endpointParts.join('/');
      const serviceUrl = this.getServiceUrl(service);

      const response = await firstValueFrom(
        this.httpService.patch(`${serviceUrl}/api/${endpoint}`, data, { headers })
      );

      return response.data;
    } catch (error) {
      throw new HttpException(
        error.response?.data || 'Service error',
        error.response?.status || HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  async delete(serviceEndpoint: string, headers?: any) {
    try {
      const [service, ...endpointParts] = serviceEndpoint.split('/');
      const endpoint = endpointParts.join('/');
      const serviceUrl = this.getServiceUrl(service);

      const response = await firstValueFrom(
        this.httpService.delete(`${serviceUrl}/api/${endpoint}`, { headers })
      );

      return response.data;
    } catch (error) {
      throw new HttpException(
        error.response?.data || 'Service error',
        error.response?.status || HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  private getServiceUrl(service: string): string {
    switch (service) {
      case 'auth-service':
        return SERVICES_CONFIG.AUTH_SERVICE;
      case 'catalog-service':
        return SERVICES_CONFIG.CATALOG_SERVICE;
      case 'inventory-service':
        return SERVICES_CONFIG.INVENTORY_SERVICE;
      case 'orders-service':
        return SERVICES_CONFIG.ORDERS_SERVICE;
      case 'payment-service':
        return SERVICES_CONFIG.PAYMENT_SERVICE;
      default:
        throw new HttpException('Service not found', HttpStatus.NOT_FOUND);
    }
  }
}