import { Controller, All, Req, Res, Headers, Query } from '@nestjs/common';
import type { Request, Response } from 'express';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { HttpClientService } from '../services/http-client.service';

@ApiTags('orders')
@Controller('orders')
export class OrdersProxyController {
  constructor(private readonly httpClient: HttpClientService) {}

  @All('*')
  @ApiOperation({ summary: 'Proxy requests to orders service' })
  async proxyToOrdersService(
    @Req() req: Request,
    @Res() res: Response,
    @Headers() headers: Record<string, string>,
    @Query() query: Record<string, any>
  ) {
    const path = `/api${req.url}`;
    const method = req.method;
    const data = req.body;

    try {
      const result = await this.httpClient.forwardRequest(
        'orders',
        path,
        method,
        data,
        headers,
        query
      );

      return res.json(result);
    } catch (error) {
      return res.status(error.getStatus()).json(error.getResponse());
    }
  }
}