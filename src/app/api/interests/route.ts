import { NextRequest } from 'next/server'
import { getSession } from '@/lib/session'
import { prisma } from '@/lib/prisma'
import { sendInterestEmail } from '@/lib/resend'
import { notifyNewInterest } from '@/lib/twilio'
import { revalidatePath } from 'next/cache'

export async function POST(request: NextRequest) {
  const session = await getSession()
  if (!session) {
    return Response.redirect(new URL('/login', request.url))
  }

  const formData = await request.formData()
  const receiverId = formData.get('receiverId') as string

  if (!receiverId) {
    return Response.json({ error: 'Missing receiverId' }, { status: 400 })
  }

  // Prevent duplicate interests
  const existing = await prisma.interest.findUnique({
    where: { senderId_receiverId: { senderId: session.userId, receiverId } },
  })
  if (existing) {
    // Redirect back with a message (already sent)
    const referer = request.headers.get('referer') ?? '/browse'
    return Response.redirect(new URL(`${referer}?interest=already_sent`, request.url))
  }

  await prisma.interest.create({
    data: { senderId: session.userId, receiverId },
  })

  const [sender, receiver] = await Promise.all([
    prisma.user.findUnique({ where: { id: session.userId }, include: { profile: true } }),
    prisma.user.findUnique({ where: { id: receiverId } }),
  ])

  if (receiver) {
    const senderName = `${sender?.profile?.firstName ?? ''} ${sender?.profile?.lastName ?? ''}`.trim()
    await sendInterestEmail(receiver.email, senderName).catch(console.error)
    if (receiver.whatsapp) {
      await notifyNewInterest(receiver.whatsapp, sender?.profile?.firstName ?? 'Someone').catch(console.error)
    }
  }

  const referer = request.headers.get('referer') ?? '/browse'
  return Response.redirect(new URL(`${referer}?interest=sent`, request.url))
}
