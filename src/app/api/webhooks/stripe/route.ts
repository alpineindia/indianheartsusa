import { headers } from 'next/headers'
import { getStripe } from '@/lib/stripe'
import { prisma } from '@/lib/prisma'
import { sendSubscriptionEmail } from '@/lib/resend'
import { notifyAdminPayment } from '@/lib/twilio'
import type { MembershipTier } from '@/generated/prisma/client'

export async function POST(request: Request) {
  const body = await request.text()
  const headersList = await headers()
  const signature = headersList.get('stripe-signature')

  if (!signature) return Response.json({ error: 'No signature' }, { status: 400 })

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let event: any

  try {
    event = getStripe().webhooks.constructEvent(body, signature, process.env.STRIPE_WEBHOOK_SECRET!)
  } catch {
    return Response.json({ error: 'Invalid signature' }, { status: 400 })
  }

  switch (event.type) {
    case 'checkout.session.completed': {
      const session = event.data.object
      const userId = session.metadata?.userId
      const tier = session.metadata?.tier as MembershipTier
      const subscriptionId = session.subscription as string

      if (userId && tier) {
        const [user] = await Promise.all([
          prisma.user.update({
            where: { id: userId },
            data: { membershipTier: tier },
            include: { profile: true },
          }),
          prisma.subscription.upsert({
            where: { userId },
            create: {
              userId,
              tier,
              stripeSubscriptionId: subscriptionId,
              stripeStatus: 'active',
              currentPeriodEnd: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
            },
            update: {
              tier,
              stripeSubscriptionId: subscriptionId,
              stripeStatus: 'active',
              currentPeriodEnd: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
            },
          }),
          prisma.payment.create({
            data: {
              userId,
              amountUsd: (session.amount_total ?? 0) / 100,
              stripePaymentId: session.payment_intent as string,
              tier,
              status: 'succeeded',
            },
          }),
        ])

        const amount = `$${((session.amount_total ?? 0) / 100).toFixed(2)}`
        await sendSubscriptionEmail(user.email, user.profile?.firstName ?? 'Member', tier).catch(console.error)
        await notifyAdminPayment(`${user.profile?.firstName} ${user.profile?.lastName}`, tier, amount).catch(console.error)
      }
      break
    }

    case 'customer.subscription.deleted': {
      const sub = event.data.object
      const subscription = await prisma.subscription.findFirst({
        where: { stripeSubscriptionId: sub.id },
      })
      if (subscription) {
        await Promise.all([
          prisma.user.update({ where: { id: subscription.userId }, data: { membershipTier: 'FREE' } }),
          prisma.subscription.update({ where: { userId: subscription.userId }, data: { stripeStatus: 'canceled' } }),
        ])
      }
      break
    }

    case 'customer.subscription.updated': {
      const sub = event.data.object
      const subscription = await prisma.subscription.findFirst({
        where: { stripeSubscriptionId: sub.id },
      })
      if (subscription) {
        await prisma.subscription.update({
          where: { userId: subscription.userId },
          data: {
            stripeStatus: sub.status,
            currentPeriodEnd: new Date((sub as unknown as { current_period_end: number }).current_period_end * 1000),
          },
        })
      }
      break
    }
  }

  return Response.json({ received: true })
}
