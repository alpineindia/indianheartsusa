'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import { verifyAdmin } from '@/lib/dal'
import { sendApprovalEmail, sendRejectionEmail } from '@/lib/resend'
import { notifyMemberApproved } from '@/lib/twilio'
import type { MembershipTier } from '@/generated/prisma/client'

export async function approveMember(userId: string) {
  await verifyAdmin()
  const user = await prisma.user.update({
    where: { id: userId },
    data: { status: 'APPROVED' },
    include: { profile: true },
  })
  await sendApprovalEmail(user.email, user.profile?.firstName ?? 'Member').catch(console.error)
  if (user.whatsapp) {
    await notifyMemberApproved(user.whatsapp, user.profile?.firstName ?? 'Member').catch(console.error)
  }
  revalidatePath('/admin/members')
}

export async function rejectMember(userId: string, reason: string) {
  await verifyAdmin()
  const user = await prisma.user.update({
    where: { id: userId },
    data: { status: 'REJECTED' },
    include: { profile: true },
  })
  await sendRejectionEmail(user.email, user.profile?.firstName ?? 'Member', reason).catch(console.error)
  revalidatePath('/admin/members')
}

export async function suspendMember(userId: string) {
  await verifyAdmin()
  await prisma.user.update({ where: { id: userId }, data: { status: 'SUSPENDED' } })
  revalidatePath('/admin/members')
}

export async function changeMemberTier(userId: string, tier: MembershipTier) {
  await verifyAdmin()
  await prisma.user.update({ where: { id: userId }, data: { membershipTier: tier } })
  revalidatePath('/admin/members')
}

export async function updateTierPricing(
  tier: MembershipTier,
  data: { priceUsd: number; contactLimit: number; dailyMessageLimit: number; profileBoostPerMonth: number; features: string[] }
) {
  await verifyAdmin()
  await prisma.tierPricing.upsert({
    where: { tier },
    create: { tier, durationDays: 30, ...data, updatedAt: new Date() },
    update: { ...data, updatedAt: new Date() },
  })
  revalidatePath('/admin/pricing')
  revalidatePath('/membership')
}

export async function approveSuccessStory(storyId: string) {
  await verifyAdmin()
  await prisma.successStory.update({ where: { id: storyId }, data: { approved: true } })
  revalidatePath('/admin/content')
  revalidatePath('/success-stories')
}

export async function deleteSuccessStory(storyId: string) {
  await verifyAdmin()
  await prisma.successStory.delete({ where: { id: storyId } })
  revalidatePath('/admin/content')
}

export async function setFeaturedProfile(profileId: string, featured: boolean) {
  await verifyAdmin()
  await prisma.profile.update({ where: { id: profileId }, data: { isFeatured: featured } })
  revalidatePath('/admin/members')
  revalidatePath('/')
}
