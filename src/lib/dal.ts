import 'server-only'
import { cache } from 'react'
import { redirect } from 'next/navigation'
import { getSession } from './session'
import { prisma } from './prisma'

export const verifySession = cache(async () => {
  const session = await getSession()
  if (!session?.userId) redirect('/login')
  if (session.status === 'PENDING') redirect('/pending-approval')
  if (session.status === 'SUSPENDED') redirect('/suspended')
  if (session.status === 'REJECTED') redirect('/rejected')
  return session
})

export const verifyAdmin = cache(async () => {
  const session = await getSession()
  if (!session?.userId || session.role !== 'ADMIN') redirect('/login')
  return session
})

export const getCurrentUser = cache(async () => {
  const session = await getSession()
  if (!session?.userId) return null
  return prisma.user.findUnique({
    where: { id: session.userId },
    include: { profile: true, subscription: true },
  })
})
