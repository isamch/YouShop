import { Controller, Post, Get, Body, Param, Headers } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { SimpleHttpService } from '../services/http.service';

@ApiTags('payments')
@Controller('payments')
export class PaymentsController {
  constructor(private readonly httpService: SimpleHttpService) {}

  @Post('create-intent')
  @ApiOperation({ summary: 'Create payment intent' })
  async createPaymentIntent(@Body() createPaymentDto: any, @Headers('authorization') auth: string) {
    return this.httpService.post('payment-service/payments/create-intent', createPaymentDto, { authorization: auth });
  }

  @Post('confirm')
  @ApiOperation({ summary: 'Confirm payment' })
  async confirmPayment(@Body() confirmPaymentDto: any, @Headers('authorization') auth: string) {
    return this.httpService.post('payment-service/payments/confirm', confirmPaymentDto, { authorization: auth });
  }

  @Get('status/:paymentIntentId')
  @ApiOperation({ summary: 'Get payment status' })
  async getPaymentStatus(@Param('paymentIntentId') paymentIntentId: string, @Headers('authorization') auth: string) {
    return this.httpService.get(`payment-service/payments/status/${paymentIntentId}`, { authorization: auth });
  }

  @Post('refund')
  @ApiOperation({ summary: 'Refund payment' })
  async refundPayment(@Body() refundPaymentDto: any, @Headers('authorization') auth: string) {
    return this.httpService.post('payment-service/payments/refund', refundPaymentDto, { authorization: auth });
  }

  @Post('webhook')
  @ApiOperation({ summary: 'Stripe webhook' })
  async handleWebhook(@Body() payload: any, @Headers() headers: any) {
    return this.httpService.post('payment-service/payments/webhook', payload, headers);
  }
}