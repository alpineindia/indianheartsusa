'use server'

import { redirect } from 'next/navigation'
import { revalidatePath } from 'next/cache'
import bcrypt from 'bcryptjs'
import { z } from 'zod'
import { prisma } from '@/lib/prisma'
import { createSession, deleteSession } from '@/lib/session'
import { sendWelcomeEmail } from '@/lib/resend'
import { notifyAdminNewRegistration } from '@/lib/twilio'

const RegisterSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
  firstName: z.string().min(2),
  lastName: z.string().min(2),
  gender: z.enum(['MALE', 'FEMALE']),
  dob: z.string(),
  religion: z.string().min(1),
  profession: z.string().min(1),
  displayPicture: z.enum(['yes', 'no']),
  willingToRelocate: z.enum(['yes', 'no']),
  foodPreference: z.string().min(1),
  aboutYou: z.string().min(1),
  city: z.string().min(1),
  state: z.string().min(1),
  phone: z.string().optional(),
  whatsapp: z.string().optional(),
  salary: z.string().optional(),
  medicalConcerns: z.string().optional(),
  expectations: z.string().optional(),
})

const LoginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
})

export type AuthFormState = {
  errors?: Record<string, string[]>
  message?: string
} | undefined

export async function register(state: AuthFormState, formData: FormData): Promise<AuthFormState> {
  const raw = Object.fromEntries(formData)
  const validated = RegisterSchema.safeParse(raw)

  if (!validated.success) {
    return { errors: validated.error.flatten().fieldErrors }
  }

  const {
    email, password, firstName, lastName, gender, dob, religion, city, state: userState, phone, whatsapp,
    profession, salary, medicalConcerns, displayPicture, willingToRelocate, foodPreference, aboutYou, expectations
  } = validated.data

  const existing = await prisma.user.findUnique({ where: { email } })
  if (existing) return { message: 'An account with this email already exists.' }

  const passwordHash = await bcrypt.hash(password, 12)

  const user = await prisma.user.create({
    data: {
      email,
      passwordHash,
      phone,
      whatsapp,
      profile: {
        create: {
          firstName,
          lastName,
          gender: gender as 'MALE' | 'FEMALE',
          dob: new Date(dob),
          religion,
          profession,
          salary,
          medicalConcerns,
          displayPicture: displayPicture === 'yes',
          willingToRelocate: willingToRelocate === 'yes',
          foodPreference,
          aboutMe: aboutYou,
          expectations,
          city,
          state: userState,
        },
      },
      preferences: { create: {} },
    },
  })

  await sendWelcomeEmail(email, firstName).catch(console.error)
  await notifyAdminNewRegistration(`${firstName} ${lastName}`, email).catch(console.error)

  redirect('/pending-approval')
}

export async function login(state: AuthFormState, formData: FormData): Promise<AuthFormState> {
  const raw = Object.fromEntries(formData)
  const validated = LoginSchema.safeParse(raw)

  if (!validated.success) return { errors: validated.error.flatten().fieldErrors }

  const { email, password } = validated.data

  const user = await prisma.user.findUnique({ where: { email } })
  if (!user || !user.passwordHash) return { message: 'Invalid email or password.' }

  const valid = await bcrypt.compare(password, user.passwordHash)
  if (!valid) return { message: 'Invalid email or password.' }

  await createSession({
    userId: user.id,
    role: user.role,
    status: user.status,
    tier: user.membershipTier,
    expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
  })

  if (user.role === 'ADMIN') redirect('/admin')
  if (user.status === 'APPROVED') redirect('/dashboard')
  if (user.status === 'PENDING') redirect('/pending-approval')
  redirect('/suspended')
}

export async function logout() {
  await deleteSession()
  revalidatePath('/')
  redirect('/login')
}
