'use server'

import { revalidatePath } from 'next/cache'
import { prisma } from '@/lib/prisma'
import { verifySession } from '@/lib/dal'
import { sendInterestEmail, sendMessageEmail, sendInterestAcceptedEmail, sendMutualFavoriteEmail } from '@/lib/resend'
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
  const interest = await prisma.interest.update({
    where: { id: interestId, receiverId: session.userId },
    data: { status: accept ? 'ACCEPTED' : 'REJECTED' },
    include: { sender: { include: { profile: true } } },
  })

  if (accept && interest.sender) {
    const senderName = `${interest.sender.profile?.firstName} ${interest.sender.profile?.lastName}`
    await sendInterestAcceptedEmail(interest.sender.email, senderName).catch(console.error)
  }

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

export async function toggleFavorite(profileId: string) {
  const session = await verifySession()

  const existing = await prisma.favorite.findUnique({
    where: { userId_profileId: { userId: session.userId, profileId } },
  })

  if (existing) {
    await prisma.favorite.delete({ where: { id: existing.id } })
  } else {
    const newFav = await prisma.favorite.create({
      data: { userId: session.userId, profileId },
    })

    // Check for mutual favorite
    const mutualFav = await prisma.favorite.findUnique({
      where: { userId_profileId: { userId: profileId, profileId: session.userId } },
    })

    if (mutualFav) {
      const [user, favoriteUser] = await Promise.all([
        prisma.user.findUnique({ where: { id: session.userId }, include: { profile: true } }),
        prisma.user.findUnique({ where: { id: profileId }, include: { profile: true } }),
      ])

      if (user && favoriteUser) {
        const userName = `${user.profile?.firstName} ${user.profile?.lastName}`
        await sendMutualFavoriteEmail(favoriteUser.email, userName).catch(console.error)
      }
    }
  }

  revalidatePath('/browse')
  revalidatePath('/search')
  revalidatePath('/dashboard/favorites')
  revalidatePath('/profile/' + profileId)
}

export async function blockUser(blockedId: string) {
  const session = await verifySession()

  const existing = await prisma.block.findUnique({
    where: { blockerId_blockedId: { blockerId: session.userId, blockedId } },
  })

  if (!existing) {
    await prisma.block.create({
      data: { blockerId: session.userId, blockedId },
    })
  }

  revalidatePath('/browse')
  revalidatePath('/search')
  revalidatePath('/profile/' + blockedId)
}

export async function unblockUser(blockedId: string) {
  const session = await verifySession()

  await prisma.block.deleteMany({
    where: { blockerId: session.userId, blockedId },
  })

  revalidatePath('/browse')
  revalidatePath('/search')
}

export async function reportUser(reportedId: string, reason: string, details?: string) {
  const session = await verifySession()

  await prisma.report.create({
    data: {
      reporterId: session.userId,
      reportedId,
      reason,
      details,
    },
  })

  revalidatePath('/profile/' + reportedId)
  return { success: true }
}

export async function submitSuccessStory(coupleNames: string, story: string, marriedOn?: string) {
  const session = await verifySession()

  // Only APPROVED members can submit stories
  const user = await prisma.user.findUnique({
    where: { id: session.userId },
  })

  if (user?.status !== 'APPROVED') {
    return { error: 'Only approved members can submit success stories.' }
  }

  await prisma.successStory.create({
    data: {
      coupleNames,
      story,
      marriedOn: marriedOn ? new Date(marriedOn) : undefined,
    },
  })

  return { success: true }
}

export async function inviteFamilyManager(memberEmail: string, relation: string) {
  const session = await verifySession()

  const member = await prisma.user.findUnique({
    where: { email: memberEmail },
  })

  if (!member) {
    return { error: 'User not found' }
  }

  const existing = await prisma.familyManager.findUnique({
    where: { managerUserId_memberId: { managerUserId: session.userId, memberId: member.id } },
  })

  if (existing) {
    return { error: 'This person already has access to your profile' }
  }

  await prisma.familyManager.create({
    data: {
      managerUserId: session.userId,
      memberId: member.id,
      relation,
    },
  })

  revalidatePath('/dashboard/family')
  return { success: true }
}

export async function revokeFamilyManager(managerId: string) {
  const session = await verifySession()

  await prisma.familyManager.deleteMany({
    where: { managerUserId: managerId, memberId: session.userId },
  })

  revalidatePath('/dashboard/family')
  return { success: true }
}
