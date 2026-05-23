import 'server-only'
import Stripe from 'stripe'

export const TIER_PRICES = {
  PREMIUM: { amount: 3900, label: '$39/month' },
  ELITE: { amount: 8900, label: '$89/month' },
} as const

export function getStripe(): Stripe {
  return new Stripe(process.env.STRIPE_SECRET_KEY!, {
    apiVersion: '2026-04-22.dahlia',
  })
}
