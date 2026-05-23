import { config } from 'dotenv'
config({ path: '.env.local' })
import { PrismaPg } from '@prisma/adapter-pg'
import { PrismaClient } from '../src/generated/prisma/client'
import { hash } from 'bcryptjs'

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL! })
const prisma = new PrismaClient({ adapter })

async function main() {
  // Admin user
  const adminEmail = process.env.ADMIN_EMAIL ?? 'admin@indianheartsusa.com'
  const adminPassword = process.env.ADMIN_PASSWORD ?? 'Admin@123!'

  const existingAdmin = await prisma.user.findUnique({ where: { email: adminEmail } })
  if (!existingAdmin) {
    const passwordHash = await hash(adminPassword, 12)
    const admin = await prisma.user.create({
      data: {
        email: adminEmail,
        passwordHash,
        role: 'ADMIN',
        status: 'APPROVED',
        membershipTier: 'ELITE',
        profile: {
          create: {
            firstName: 'Site',
            lastName: 'Admin',
            gender: 'MALE',
            dob: new Date('1985-01-01'),
            religion: 'Hindu',
            city: 'New York',
            state: 'New York',
          },
        },
      },
    })
    console.log(`✅ Admin user created: ${admin.email}`)
  } else {
    console.log(`ℹ️  Admin user already exists: ${adminEmail}`)
  }

  // Tier pricing
  const tiers = [
    {
      tier: 'PREMIUM' as const,
      priceUsd: 39,
      durationDays: 30,
      contactLimit: 30,
      dailyMessageLimit: 50,
      profileBoostPerMonth: 1,
      features: [
        'View up to 30 contact details per month',
        'Send up to 50 messages per day',
        'WhatsApp intro relay',
        'Full horoscope matching',
        '1 profile boost per month',
      ],
    },
    {
      tier: 'ELITE' as const,
      priceUsd: 89,
      durationDays: 30,
      contactLimit: 999999,
      dailyMessageLimit: 999999,
      profileBoostPerMonth: 3,
      features: [
        'Unlimited contact details',
        'Unlimited messages',
        'WhatsApp intro relay',
        'Featured profile listing',
        'Dedicated matchmaker',
        'Full horoscope matching',
        '3 profile boosts per month',
      ],
    },
  ]

  for (const t of tiers) {
    await prisma.tierPricing.upsert({
      where: { tier: t.tier },
      update: t,
      create: t,
    })
    console.log(`✅ TierPricing upserted: ${t.tier} @ $${t.priceUsd}/mo`)
  }

  // Sample success stories
  const stories = [
    {
      coupleNames: 'Priya & Rahul',
      story: 'We connected through IndianHearts USA after both relocating to the Bay Area for work. What started as a simple message turned into endless phone calls, and within a year we were married in a beautiful ceremony in San Jose. This platform truly understands what NRI families are looking for.',
      marriedOn: new Date('2024-02-14'),
      approved: true,
    },
    {
      coupleNames: 'Ananya & Vikram',
      story: 'As a Tamil Brahmin girl living in New Jersey, finding a compatible match felt daunting. IndianHearts USA filtered exactly what mattered to my family — religion, mother tongue, and education. Vikram messaged me, we met for coffee in Manhattan, and the rest is history. Married 8 months later!',
      marriedOn: new Date('2023-11-18'),
      approved: true,
    },
    {
      coupleNames: 'Meera & Arjun',
      story: 'My parents were worried about finding a match for me while I was completing my residency in Chicago. IndianHearts USA gave them peace of mind — every profile was verified. Arjun and I are both doctors, both from Gujarat, and both passionate about Indian classical music. It felt like the universe had planned this.',
      marriedOn: new Date('2024-06-01'),
      approved: true,
    },
  ]

  for (const s of stories) {
    const exists = await prisma.successStory.findFirst({ where: { coupleNames: s.coupleNames } })
    if (!exists) {
      await prisma.successStory.create({ data: s })
      console.log(`✅ Success story added: ${s.coupleNames}`)
    }
  }

  console.log('\n🎉 Seed complete.')
}

main()
  .catch((e) => { console.error(e); process.exit(1) })
  .finally(() => prisma.$disconnect())
