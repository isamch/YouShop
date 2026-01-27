import Stripe from 'stripe';

interface StripeConfig {
  apiKey: string;
  /**
   * Optional because you might not configure webhooks in some environments.
   * The webhook handler will validate this at runtime.
   */
  webhookSecret?: string;
}

const apiKey = process.env.STRIPE_SECRET_KEY || 'sk_test_dummy_key';

export const stripeConfig: StripeConfig = {
  apiKey,
  webhookSecret: process.env.STRIPE_WEBHOOK_SECRET,
};

if (process.env.STRIPE_SECRET_KEY == null || process.env.STRIPE_SECRET_KEY === '') {
  // Dev-friendly warning: service can still start, but real Stripe calls will fail.
  // eslint-disable-next-line no-console
  console.warn(
    '[payment-service] STRIPE_SECRET_KEY is not set. Using a dummy key; ' +
    'Stripe requests will fail until you configure a real secret key.'
  );
}

export const stripe = new Stripe(stripeConfig.apiKey, {
  apiVersion: '2025-12-15.clover',
});

