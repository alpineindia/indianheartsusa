import { NextRequest } from 'next/server'
import { stripe, TIER_PRICES } from '@/lib/stripe'
import { getSession } from '@/lib/session'
import { prisma } from '@/lib/prisma'
import type { MembershipTier } from '@/generated/prisma/client'

export async function POST(request: NextRequest) {
  const session = await getSession()
  const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? 'http://localhost:3000'

  const formData = await request.formData()
  const tier = formData.get('tier') as MembershipTier

  if (!['PREMIUM', 'ELITE'].includes(tier)) {
    return Response.json({ error: 'Invalid tier' }, { status: 400 })
  }

  if (!session) {
    return Response.redirect(new URL('/register', appUrl))
  }

  const user = await prisma.user.findUnique({ where: { id: session.userId } })
  if (!user) return Response.json({ error: 'User not found' }, { status: 404 })

  let customerId = user.stripeCustomerId

  if (!customerId) {
    const customer = await stripe.customers.create({
      email: user.email,
      metadata: { userId: user.id },
    })
    customerId = customer.id
    await prisma.user.update({ where: { id: user.id }, data: { stripeCustomerId: customerId } })
  }

  const priceData = TIER_PRICES[tier as keyof typeof TIER_PRICES]

  const checkoutSession = await stripe.checkout.sessions.create({
    customer: customerId,
    mode: 'subscription',
    line_items: [{
      price_data: {
        currency: 'usd',
        product_data: {
          name: `IndianHearts USA — ${tier} Membership`,
          description: `Monthly ${tier} membership giving access to premium matrimonial features.`,
        },
        unit_amount: priceData.amount,
        recurring: { interval: 'month' },
      },
      quantity: 1,
    }],
    metadata: { userId: user.id, tier },
    success_url: `${appUrl}/dashboard?payment=success`,
    cancel_url: `${appUrl}/membership`,
  })

  return Response.redirect(checkoutSession.url!)
}
