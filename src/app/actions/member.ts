'use server'

import { revalidatePath } from 'next/cache'
import { prisma } from '@/lib/prisma'
import { verifySession } from '@/lib/dal'
import { sendInterestEmail, sendMessageEmail } from '@/lib/resend'
import { notifyNewInterest, notifyNewMessage } from '@/lib/twilio'

export async function sendInterest(receiverId: string, message?: string) {
  const session = await verifySession()

  const existing = await prisma.interest.findUnique({
    where: { senderId_receiverId: { senderId: session.userId, receiverId } },
  })
  if (existing) return { error: 'Interest already sent.' }

  await prisma.interest.create({
    data: { senderId: session.userId, receiverId, message },
  })

  const [sender, receiver] = await Promise.all([
    prisma.user.findUnique({ where: { id: session.userId }, include: { profile: true } }),
    prisma.user.findUnique({ where: { id: receiverId } }),
  ])

  if (receiver) {
    await sendInterestEmail(receiver.email, `${sender?.profile?.firstName} ${sender?.profile?.lastName}`).catch(console.error)
    if (receiver.whatsapp) {
      await notifyNewInterest(receiver.whatsapp, `${sender?.profile?.firstName}`).catch(console.error)
    }
  }

  revalidatePath('/dashboard')
}

export async function respondToInterest(interestId: string, accept: boolean) {
  const session = await verifySession()
  await prisma.interest.update({
    where: { id: interestId, receiverId: session.userId },
    data: { status: accept ? 'ACCEPTED' : 'REJECTED' },
  })
  revalidatePath('/dashboard')
}

export async function sendMessage(receiverId: string, body: string) {
  const session = await verifySession()

  const user = await prisma.user.findUnique({ where: { id: session.userId } })
  const tier = user?.membershipTier

  if (tier === 'FREE') {
    const todayStart = new Date(); todayStart.setHours(0, 0, 0, 0)
    const count = await prisma.message.count({
      where: { senderId: session.userId, createdAt: { gte: todayStart } },
    })
    if (count >= 3) return { error: 'Free tier daily message limit reached. Upgrade to Premium.' }
  }

  if (tier === 'PREMIUM') {
    const todayStart = new Date(); todayStart.setHours(0, 0, 0, 0)
    const count = await prisma.message.count({
      where: { senderId: session.userId, createdAt: { gte: todayStart } },
    })
    if (count >= 50) return { error: 'Daily message limit reached.' }
  }

  await prisma.message.create({ data: { senderId: session.userId, receiverId, body } })

  const [sender, receiver] = await Promise.all([
    prisma.user.findUnique({ where: { id: session.userId }, include: { profile: true } }),
    prisma.user.findUnique({ where: { id: receiverId } }),
  ])

  if (receiver) {
    await sendMessageEmail(receiver.email, `${sender?.profile?.firstName}`).catch(console.error)
    if (receiver.whatsapp) {
      await notifyNewMessage(receiver.whatsapp, `${sender?.profile?.firstName}`).catch(console.error)
    }
  }

  revalidatePath('/dashboard/messages')
}

export async function markMessagesRead(senderId: string) {
  const session = await verifySession()
  await prisma.message.updateMany({
    where: { senderId, receiverId: session.userId, readAt: null },
    data: { readAt: new Date() },
  })
  revalidatePath('/dashboard/messages')
}

export async function updateProfile(data: Record<string, unknown>) {
  const session = await verifySession()
  await prisma.profile.update({
    where: { userId: session.userId },
    data,
  })
  revalidatePath('/dashboard')
}
