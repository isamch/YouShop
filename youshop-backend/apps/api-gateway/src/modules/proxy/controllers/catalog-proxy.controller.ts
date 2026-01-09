import { Controller, All, Req, Res, Headers, Query } from '@nestjs/common';
import type { Request, Response } from 'express';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { HttpClientService } from '../services/http-client.service';

@ApiTags('catalog')
@Controller('catalog')
export class CatalogProxyController {
  constructor(private readonly httpClient: HttpClientService) {}

  @All('categories*')
  @ApiOperation({ summary: 'Proxy requests to catalog service - categories' })
  async proxyCategoriesRequests(
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
        'catalog',
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

  @All('products*')
  @ApiOperation({ summary: 'Proxy requests to catalog service - products' })
  async proxyProductsRequests(
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
        'catalog',
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