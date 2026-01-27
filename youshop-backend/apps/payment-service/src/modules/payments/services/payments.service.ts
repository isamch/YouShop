import { Injectable, BadRequestException } from '@nestjs/common';
import { stripe, stripeConfig } from '../../../config/stripe.config';
import { CreatePaymentIntentDto, ConfirmPaymentDto, RefundPaymentDto } from '../dto/payment.dto';

@Injectable()
export class PaymentsService {

  async createPaymentIntent(createPaymentDto: CreatePaymentIntentDto) {
    try {
      const paymentIntent = await stripe.paymentIntents.create({
        amount: Math.round(createPaymentDto.amount * 100), // Convert to cents
        currency: createPaymentDto.currency || 'usd',
        metadata: {
          orderId: createPaymentDto.orderId,
        },
        automatic_payment_methods: {
          enabled: true,
        },
      });

      return {
        success: true,
        paymentIntentId: paymentIntent.id,
        clientSecret: paymentIntent.client_secret,
        amount: createPaymentDto.amount,
        currency: createPaymentDto.currency || 'usd',
      };
    } catch (error) {
      throw new BadRequestException(`Payment intent creation failed: ${error.message}`);
    }
  }

  async confirmPayment(confirmPaymentDto: ConfirmPaymentDto) {
    try {
      const paymentIntent = await stripe.paymentIntents.confirm(
        confirmPaymentDto.paymentIntentId,
        confirmPaymentDto.paymentMethodId ? {
          payment_method: confirmPaymentDto.paymentMethodId,
        } : {}
      );

      return {
        success: true,
        status: paymentIntent.status,
        paymentIntentId: paymentIntent.id,
        amount: paymentIntent.amount / 100,
      };
    } catch (error) {
      throw new BadRequestException(`Payment confirmation failed: ${error.message}`);
    }
  }

  async getPaymentStatus(paymentIntentId: string) {
    try {
      const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);

      return {
        success: true,
        paymentIntentId: paymentIntent.id,
        status: paymentIntent.status,
        amount: paymentIntent.amount / 100,
        currency: paymentIntent.currency,
        orderId: paymentIntent.metadata?.orderId,
      };
    } catch (error) {
      throw new BadRequestException(`Failed to get payment status: ${error.message}`);
    }
  }

  async refundPayment(refundPaymentDto: RefundPaymentDto) {
    try {
      const refundData: any = {
        payment_intent: refundPaymentDto.paymentIntentId,
      };

      if (refundPaymentDto.amount) {
        refundData.amount = Math.round(refundPaymentDto.amount * 100);
      }

      if (refundPaymentDto.reason) {
        refundData.reason = refundPaymentDto.reason;
      }

      const refund = await stripe.refunds.create(refundData);

      return {
        success: true,
        refundId: refund.id,
        amount: refund.amount / 100,
        status: refund.status,
        reason: refund.reason,
      };
    } catch (error) {
      throw new BadRequestException(`Refund failed: ${error.message}`);
    }
  }

  async handleWebhook(signature: string, payload: any) {
    try {
      const event = stripe.webhooks.constructEvent(
        payload,
        signature,
        stripeConfig.webhookSecret
      );

      console.log(`🔔 Webhook received: ${event.type}`);

      switch (event.type) {
        case 'payment_intent.succeeded':
          const paymentIntent = event.data.object;
          console.log(`💰 Payment succeeded: ${paymentIntent.id}`);
          // Here you can update order status, send confirmation email, etc.
          break;

        case 'payment_intent.payment_failed':
          const failedPayment = event.data.object;
          console.log(`❌ Payment failed: ${failedPayment.id}`);
          // Handle failed payment
          break;

        default:
          console.log(`🤷‍♂️ Unhandled event type: ${event.type}`);
      }

      return { received: true };
    } catch (error) {
      throw new BadRequestException(`Webhook error: ${error.message}`);
    }
  }
}