import { Controller, Post, Get, Body, Param, Headers, RawBody } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { PaymentsService } from '../services/payments.service';
import { CreatePaymentIntentDto, ConfirmPaymentDto, RefundPaymentDto } from '../dto/payment.dto';

@ApiTags('payments')
@Controller('payments')
export class PaymentsController {
  constructor(private readonly paymentsService: PaymentsService) {}

  @Post('create-intent')
  @ApiOperation({ summary: 'Create payment intent' })
  async createPaymentIntent(@Body() createPaymentDto: CreatePaymentIntentDto) {
    return this.paymentsService.createPaymentIntent(createPaymentDto);
  }

  @Post('confirm')
  @ApiOperation({ summary: 'Confirm payment' })
  async confirmPayment(@Body() confirmPaymentDto: ConfirmPaymentDto) {
    return this.paymentsService.confirmPayment(confirmPaymentDto);
  }

  @Get('status/:paymentIntentId')
  @ApiOperation({ summary: 'Get payment status' })
  async getPaymentStatus(@Param('paymentIntentId') paymentIntentId: string) {
    return this.paymentsService.getPaymentStatus(paymentIntentId);
  }

  @Post('refund')
  @ApiOperation({ summary: 'Refund payment' })
  async refundPayment(@Body() refundPaymentDto: RefundPaymentDto) {
    return this.paymentsService.refundPayment(refundPaymentDto);
  }

  @Post('webhook')
  @ApiOperation({ summary: 'Stripe webhook endpoint' })
  async handleWebhook(
    @Headers('stripe-signature') signature: string,
    @RawBody() payload: any
  ) {
    return this.paymentsService.handleWebhook(signature, payload);
  }

  @Get('health')
  @ApiOperation({ summary: 'Health check' })
  getHealth() {
    return { status: 'ok', service: 'payment-service', timestamp: new Date().toISOString() };
  }
}