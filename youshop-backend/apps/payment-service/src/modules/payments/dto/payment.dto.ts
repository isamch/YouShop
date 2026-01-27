export class CreatePaymentIntentDto {
  orderId: string;
  amount: number;
  currency?: string = 'usd';
}

export class ConfirmPaymentDto {
  paymentIntentId: string;
  paymentMethodId?: string;
}

export class RefundPaymentDto {
  paymentIntentId: string;
  amount?: number;
  reason?: string;
}