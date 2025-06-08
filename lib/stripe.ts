import Stripe from 'stripe'

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2024-12-18.acacia',
  typescript: true,
})

export const PRICES = {
  // One-time credit purchases
  credits: {
    single: {
      amount: 4900, // £49
      credits: 1,
      name: 'Single Report Credit',
    },
    pack5: {
      amount: 22000, // £220 (£44 each)
      credits: 5,
      name: '5 Report Credits',
    },
    pack10: {
      amount: 40000, // £400 (£40 each)
      credits: 10,
      name: '10 Report Credits',
    },
    pack20: {
      amount: 70000, // £700 (£35 each)
      credits: 20,
      name: '20 Report Credits',
    },
  },
  // Subscriptions
  subscriptions: {
    basic: {
      priceId: process.env.STRIPE_BASIC_PRICE_ID || '',
      credits: 3,
      name: 'Basic Plan',
    },
    pro: {
      priceId: process.env.STRIPE_PRO_PRICE_ID || '',
      credits: 10,
      name: 'Pro Plan',
    },
    enterprise: {
      priceId: process.env.STRIPE_ENTERPRISE_PRICE_ID || '',
      credits: 30,
      name: 'Enterprise Plan',
    },
  },
}