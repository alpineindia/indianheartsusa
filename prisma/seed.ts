import { config } from 'dotenv'
config({ path: '.env.local' })
import { PrismaPg } from '@prisma/adapter-pg'
import { PrismaClient } from '../src/generated/prisma/client'
import { hash } from 'bcryptjs'

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL! })
const prisma = new PrismaClient({ adapter })

const TEST_PASSWORD = 'Test@1234'

const MALE_PROFILES = [
  {
    email: 'arjun.sharma@example.com',
    firstName: 'Arjun', lastName: 'Sharma',
    dob: new Date('1992-03-15'),
    religion: 'Hindu', caste: 'Brahmin', motherTongue: 'Hindi',
    height: "5'11\"", maritalStatus: 'Never Married',
    education: 'M.S. Computer Science, Stanford University',
    occupation: 'Senior Software Engineer', annualIncome: '$150,000 - $200,000',
    city: 'San Jose', state: 'California',
    aboutMe: 'I am a software engineer at a top tech company in Silicon Valley. I love hiking, cooking Indian food on weekends, and playing cricket with friends. Looking for a partner who values family, is career-driven, and has a good sense of humor. My family is from Delhi and we follow Hindu traditions.',
    familyType: 'Nuclear', familyStatus: 'Middle Class',
    isFeatured: true, tier: 'ELITE' as const,
    photo: 'https://randomuser.me/api/portraits/men/32.jpg',
  },
  {
    email: 'rahul.patel@example.com',
    firstName: 'Rahul', lastName: 'Patel',
    dob: new Date('1990-07-22'),
    religion: 'Hindu', caste: 'Patel', motherTongue: 'Gujarati',
    height: "5'10\"", maritalStatus: 'Never Married',
    education: 'M.D., University of Pennsylvania',
    occupation: 'Cardiologist', annualIncome: '$250,000+',
    city: 'Houston', state: 'Texas',
    aboutMe: 'Board-certified cardiologist practicing in Houston. I grew up in a joint Gujarati family with strong values. Outside medicine, I enjoy garba, traveling to national parks, and reading. I am looking for a life partner who is family-oriented and shares traditional values while being independent and educated.',
    familyType: 'Joint', familyStatus: 'Upper Middle Class',
    isFeatured: true, tier: 'ELITE' as const,
    photo: 'https://randomuser.me/api/portraits/men/41.jpg',
  },
  {
    email: 'vikram.singh@example.com',
    firstName: 'Vikram', lastName: 'Singh',
    dob: new Date('1991-11-08'),
    religion: 'Sikh', caste: 'Jat', motherTongue: 'Punjabi',
    height: "6'1\"", maritalStatus: 'Never Married',
    education: 'MBA, Kellogg School of Management',
    occupation: 'Management Consultant', annualIncome: '$200,000 - $250,000',
    city: 'Chicago', state: 'Illinois',
    aboutMe: 'Consultant at McKinsey, originally from Chandigarh. I am passionate about fitness, bhangra, and traveling (visited 30+ countries). I believe in strong family bonds and am looking for a partner who is ambitious, kind-hearted, and shares the Punjabi spirit of celebrating life.',
    familyType: 'Nuclear', familyStatus: 'Upper Middle Class',
    isFeatured: true, tier: 'PREMIUM' as const,
    photo: 'https://randomuser.me/api/portraits/men/52.jpg',
  },
  {
    email: 'nikhil.gupta@example.com',
    firstName: 'Nikhil', lastName: 'Gupta',
    dob: new Date('1993-05-30'),
    religion: 'Hindu', caste: 'Agarwal', motherTongue: 'Hindi',
    height: "5'9\"", maritalStatus: 'Never Married',
    education: 'J.D., Columbia Law School',
    occupation: 'Corporate Attorney', annualIncome: '$200,000 - $250,000',
    city: 'New York', state: 'New York',
    aboutMe: 'Attorney at a prestigious Manhattan law firm specializing in M&A. I am a foodie who loves exploring NYC\'s diverse restaurant scene. My family is from Jaipur. Looking for someone who values both career and family, and would be open to building a beautiful life together in New York.',
    familyType: 'Nuclear', familyStatus: 'Upper Middle Class',
    isFeatured: false, tier: 'PREMIUM' as const,
    photo: 'https://randomuser.me/api/portraits/men/28.jpg',
  },
  {
    email: 'rohan.mehta@example.com',
    firstName: 'Rohan', lastName: 'Mehta',
    dob: new Date('1989-09-14'),
    religion: 'Jain', caste: 'Shrimal', motherTongue: 'Gujarati',
    height: "5'10\"", maritalStatus: 'Never Married',
    education: 'MBA, Wharton School of Business',
    occupation: 'Investment Banker', annualIncome: '$250,000+',
    city: 'New York', state: 'New York',
    aboutMe: 'VP at Goldman Sachs. Raised in a traditional Jain family — vegetarian, value non-violence and simplicity. Despite a busy career, I make time for family every weekend. Looking for a Jain partner who respects our religious values and is ready to build a life together.',
    familyType: 'Joint', familyStatus: 'Upper Class',
    isFeatured: false, tier: 'PREMIUM' as const,
    photo: 'https://randomuser.me/api/portraits/men/67.jpg',
  },
  {
    email: 'karan.joshi@example.com',
    firstName: 'Karan', lastName: 'Joshi',
    dob: new Date('1994-01-25'),
    religion: 'Hindu', caste: 'Brahmin', motherTongue: 'Marathi',
    height: "5'11\"", maritalStatus: 'Never Married',
    education: 'Ph.D. Data Science, MIT',
    occupation: 'Data Scientist', annualIncome: '$150,000 - $200,000',
    city: 'Boston', state: 'Massachusetts',
    aboutMe: 'Data scientist at a biotech startup in Cambridge. I am passionate about using AI to solve healthcare problems. In free time I enjoy classical Indian music, badminton, and cooking. My family is from Pune. Seeking a partner who is intellectually curious and loves deep conversations.',
    familyType: 'Nuclear', familyStatus: 'Middle Class',
    isFeatured: false, tier: 'FREE' as const,
    photo: 'https://randomuser.me/api/portraits/men/18.jpg',
  },
  {
    email: 'aditya.kumar@example.com',
    firstName: 'Aditya', lastName: 'Kumar',
    dob: new Date('1988-06-17'),
    religion: 'Hindu', caste: 'Yadav', motherTongue: 'Hindi',
    height: "5'10\"", maritalStatus: 'Divorced',
    education: 'B.E. Mechanical, IIT Bombay; MS Engineering, Georgia Tech',
    occupation: 'Engineering Manager', annualIncome: '$150,000 - $200,000',
    city: 'Atlanta', state: 'Georgia',
    aboutMe: 'Engineering manager at a Fortune 500 company. Divorced amicably, no children. I have grown a lot from my past and am ready for a fresh start with someone understanding and mature. I enjoy road trips, watching cricket, and volunteering at the local temple.',
    familyType: 'Nuclear', familyStatus: 'Middle Class',
    isFeatured: false, tier: 'FREE' as const,
    photo: 'https://randomuser.me/api/portraits/men/76.jpg',
  },
  {
    email: 'sanjay.iyer@example.com',
    firstName: 'Sanjay', lastName: 'Iyer',
    dob: new Date('1991-04-03'),
    religion: 'Hindu', caste: 'Iyer', motherTongue: 'Tamil',
    height: "5'8\"", maritalStatus: 'Never Married',
    education: 'M.D. Neurology, UCSF',
    occupation: 'Neurologist', annualIncome: '$250,000+',
    city: 'San Francisco', state: 'California',
    aboutMe: 'Neurologist in the Bay Area with deep Tamilian roots. I am vegetarian by choice and practice yoga daily. I enjoy Carnatic music, chess, and reading philosophy. Looking for a Tamil Brahmin partner who respects our culture and is ready to build a loving household.',
    familyType: 'Joint', familyStatus: 'Upper Middle Class',
    isFeatured: false, tier: 'PREMIUM' as const,
    photo: 'https://randomuser.me/api/portraits/men/44.jpg',
  },
  {
    email: 'amit.reddy@example.com',
    firstName: 'Amit', lastName: 'Reddy',
    dob: new Date('1992-12-09'),
    religion: 'Hindu', caste: 'Kamma', motherTongue: 'Telugu',
    height: "5'11\"", maritalStatus: 'Never Married',
    education: 'M.S. Electrical Engineering, University of Texas',
    occupation: 'Product Manager', annualIncome: '$150,000 - $200,000',
    city: 'Dallas', state: 'Texas',
    aboutMe: 'Product manager at a leading tech firm in Dallas. I am an Andhra Telugu who loves spicy food, watching Telugu movies, and playing fantasy cricket. My family is simple and values education above all. Looking for a Telugu girl who is educated, independent, and family-loving.',
    familyType: 'Nuclear', familyStatus: 'Middle Class',
    isFeatured: false, tier: 'FREE' as const,
    photo: 'https://randomuser.me/api/portraits/men/55.jpg',
  },
  {
    email: 'deepak.malhotra@example.com',
    firstName: 'Deepak', lastName: 'Malhotra',
    dob: new Date('1990-08-28'),
    religion: 'Hindu', caste: 'Khatri', motherTongue: 'Punjabi',
    height: "6'0\"", maritalStatus: 'Never Married',
    education: 'BBA Finance, NYU Stern; CFA Charterholder',
    occupation: 'Hedge Fund Analyst', annualIncome: '$200,000 - $250,000',
    city: 'Edison', state: 'New Jersey',
    aboutMe: 'Finance professional working in NYC and living in Edison NJ. Big foodie, gym enthusiast, and huge Bollywood fan. Very close to my parents who live with me. Looking for a Punjabi or North Indian match who is comfortable with a joint family setup and loves our culture.',
    familyType: 'Joint', familyStatus: 'Upper Middle Class',
    isFeatured: false, tier: 'FREE' as const,
    photo: 'https://randomuser.me/api/portraits/men/62.jpg',
  },
]

const FEMALE_PROFILES = [
  {
    email: 'priya.sharma@example.com',
    firstName: 'Priya', lastName: 'Sharma',
    dob: new Date('1993-02-18'),
    religion: 'Hindu', caste: 'Brahmin', motherTongue: 'Hindi',
    height: "5'5\"", maritalStatus: 'Never Married',
    education: 'M.D., Johns Hopkins University',
    occupation: 'Internal Medicine Physician', annualIncome: '$200,000 - $250,000',
    city: 'Baltimore', state: 'Maryland',
    aboutMe: 'Physician completing fellowship at Johns Hopkins. I am a Delhi girl at heart but have built my life in the USA through hard work. I love Bollywood dance, painting, and cooking. I come from a very loving Brahmin family. Seeking a well-educated, family-oriented man who will respect my career.',
    familyType: 'Nuclear', familyStatus: 'Upper Middle Class',
    isFeatured: true, tier: 'ELITE' as const,
    photo: 'https://randomuser.me/api/portraits/women/33.jpg',
  },
  {
    email: 'ananya.patel@example.com',
    firstName: 'Ananya', lastName: 'Patel',
    dob: new Date('1994-10-05'),
    religion: 'Hindu', caste: 'Patel', motherTongue: 'Gujarati',
    height: "5'4\"", maritalStatus: 'Never Married',
    education: 'MBA, Harvard Business School',
    occupation: 'Strategy Consultant', annualIncome: '$150,000 - $200,000',
    city: 'Boston', state: 'Massachusetts',
    aboutMe: 'Harvard MBA graduate working at BCG in Boston. I am a proud Gujarati who loves garba, dhokla, and traveling back to Ahmedabad every year. My family is very close-knit. Looking for an ambitious Gujarati man with strong family values who is ready to build something meaningful together.',
    familyType: 'Joint', familyStatus: 'Upper Middle Class',
    isFeatured: true, tier: 'ELITE' as const,
    photo: 'https://randomuser.me/api/portraits/women/44.jpg',
  },
  {
    email: 'deepika.singh@example.com',
    firstName: 'Deepika', lastName: 'Singh',
    dob: new Date('1991-07-14'),
    religion: 'Sikh', caste: 'Jat', motherTongue: 'Punjabi',
    height: "5'6\"", maritalStatus: 'Never Married',
    education: 'J.D., University of Chicago Law School',
    occupation: 'Attorney — Immigration Law', annualIncome: '$150,000 - $200,000',
    city: 'Chicago', state: 'Illinois',
    aboutMe: 'Immigration lawyer in Chicago helping the South Asian community. I am Punjabi and proud — love listening to gurbani, cooking sarson da saag, and spending weekends with family. Looking for a Sikh man who is grounded, ambitious, and has a good heart. Love over everything.',
    familyType: 'Nuclear', familyStatus: 'Middle Class',
    isFeatured: false, tier: 'PREMIUM' as const,
    photo: 'https://randomuser.me/api/portraits/women/55.jpg',
  },
  {
    email: 'kavya.gupta@example.com',
    firstName: 'Kavya', lastName: 'Gupta',
    dob: new Date('1995-03-22'),
    religion: 'Hindu', caste: 'Agarwal', motherTongue: 'Hindi',
    height: "5'3\"", maritalStatus: 'Never Married',
    education: 'PharmD, University of Illinois Chicago',
    occupation: 'Clinical Pharmacist', annualIncome: '$120,000 - $150,000',
    city: 'Chicago', state: 'Illinois',
    aboutMe: 'Clinical pharmacist at a top Chicago hospital. I am a Rajasthani girl with a love for mehndi, classical dance, and reading. Very close to my parents. I am looking for a caring and stable partner who values family above career and is ready to start a family in the near future.',
    familyType: 'Joint', familyStatus: 'Middle Class',
    isFeatured: false, tier: 'PREMIUM' as const,
    photo: 'https://randomuser.me/api/portraits/women/22.jpg',
  },
  {
    email: 'meera.nair@example.com',
    firstName: 'Meera', lastName: 'Nair',
    dob: new Date('1992-11-30'),
    religion: 'Hindu', caste: 'Nair', motherTongue: 'Malayalam',
    height: "5'5\"", maritalStatus: 'Never Married',
    education: 'M.S. Nursing, Vanderbilt University; Nurse Practitioner',
    occupation: 'Nurse Practitioner', annualIncome: '$120,000 - $150,000',
    city: 'Nashville', state: 'Tennessee',
    aboutMe: 'Nurse practitioner specializing in cardiac care. I am from Kerala originally and treasure Malayalam culture, Onam celebrations, and traditional cooking. I am spiritual but not rigid. Looking for a kind, educated Malayali man or open-minded Hindu who respects our culture.',
    familyType: 'Nuclear', familyStatus: 'Middle Class',
    isFeatured: false, tier: 'FREE' as const,
    photo: 'https://randomuser.me/api/portraits/women/66.jpg',
  },
  {
    email: 'sunita.joshi@example.com',
    firstName: 'Sunita', lastName: 'Joshi',
    dob: new Date('1990-05-08'),
    religion: 'Hindu', caste: 'Brahmin', motherTongue: 'Marathi',
    height: "5'4\"", maritalStatus: 'Divorced',
    education: 'Ph.D. Biochemistry, Ohio State University',
    occupation: 'Research Scientist', annualIncome: '$100,000 - $120,000',
    city: 'Columbus', state: 'Ohio',
    aboutMe: 'Research scientist at a biotech company. Divorced after a short marriage — no children. I have healed and learned a lot about myself. I am looking for a mature, understanding man who can see me for who I am today. I love hiking, yoga, and long conversations over chai.',
    familyType: 'Nuclear', familyStatus: 'Middle Class',
    isFeatured: false, tier: 'FREE' as const,
    photo: 'https://randomuser.me/api/portraits/women/78.jpg',
  },
  {
    email: 'riya.kumar@example.com',
    firstName: 'Riya', lastName: 'Kumar',
    dob: new Date('1996-08-15'),
    religion: 'Hindu', caste: 'Yadav', motherTongue: 'Bhojpuri',
    height: "5'3\"", maritalStatus: 'Never Married',
    education: 'B.S. Computer Science, UT Austin; M.S. Software Engineering',
    occupation: 'Software Engineer', annualIncome: '$120,000 - $150,000',
    city: 'Austin', state: 'Texas',
    aboutMe: 'Software engineer at a growing startup in Austin. I am young, ambitious, and love what I do. Outside work I enjoy painting, Zumba classes, and exploring Austin\'s live music scene. My family is from Bihar but I am very open-minded. Looking for someone who is honest and ready to grow together.',
    familyType: 'Nuclear', familyStatus: 'Middle Class',
    isFeatured: false, tier: 'FREE' as const,
    photo: 'https://randomuser.me/api/portraits/women/15.jpg',
  },
  {
    email: 'anita.iyer@example.com',
    firstName: 'Anita', lastName: 'Iyer',
    dob: new Date('1991-01-20'),
    religion: 'Hindu', caste: 'Iyer', motherTongue: 'Tamil',
    height: "5'2\"", maritalStatus: 'Never Married',
    education: 'M.D. Pediatrics, UCSF Medical Center',
    occupation: 'Pediatrician', annualIncome: '$200,000 - $250,000',
    city: 'San Francisco', state: 'California',
    aboutMe: 'Pediatrician at UCSF with a passion for child wellness. I am a traditional Tamil Brahmin — vegetarian, love Carnatic music, and practice Bharatanatyam. My family is in Chennai and I visit twice a year. Seeking a Tamil or South Indian man who is vegetarian, educated, and spiritually inclined.',
    familyType: 'Joint', familyStatus: 'Upper Middle Class',
    isFeatured: false, tier: 'PREMIUM' as const,
    photo: 'https://randomuser.me/api/portraits/women/37.jpg',
  },
  {
    email: 'sneha.reddy@example.com',
    firstName: 'Sneha', lastName: 'Reddy',
    dob: new Date('1993-09-12'),
    religion: 'Hindu', caste: 'Reddy', motherTongue: 'Telugu',
    height: "5'5\"", maritalStatus: 'Never Married',
    education: 'D.D.S., University of Texas Health Science Center',
    occupation: 'Dentist', annualIncome: '$150,000 - $200,000',
    city: 'Dallas', state: 'Texas',
    aboutMe: 'Dentist and small practice owner in the Dallas DFW area. I love Telugu culture, spicy Andhra food, and Tollywood movies. My family is from Hyderabad. I am independent but very family-focused. Looking for a Telugu man who is settled in the USA and values our culture.',
    familyType: 'Nuclear', familyStatus: 'Upper Middle Class',
    isFeatured: false, tier: 'PREMIUM' as const,
    photo: 'https://randomuser.me/api/portraits/women/48.jpg',
  },
  {
    email: 'pooja.malhotra@example.com',
    firstName: 'Pooja', lastName: 'Malhotra',
    dob: new Date('1994-04-26'),
    religion: 'Hindu', caste: 'Khatri', motherTongue: 'Punjabi',
    height: "5'6\"", maritalStatus: 'Never Married',
    education: 'B.A. Economics, UCLA; MBA, USC Marshall',
    occupation: 'Financial Analyst', annualIncome: '$120,000 - $150,000',
    city: 'Los Angeles', state: 'California',
    aboutMe: 'Financial analyst living the LA life — but very much a desi girl at heart. Love cooking Punjabi food, doing sangeet at every wedding, and following cricket. My family moved from Amritsar to New Jersey and now I am on the West Coast. Looking for a Punjabi man who is fun, loving, and family-first.',
    familyType: 'Nuclear', familyStatus: 'Middle Class',
    isFeatured: false, tier: 'FREE' as const,
    photo: 'https://randomuser.me/api/portraits/women/60.jpg',
  },
]

async function main() {
  // ── Admin user ──────────────────────────────────────────────────────────────
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

  // ── Tier pricing ────────────────────────────────────────────────────────────
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

  // ── Success stories ─────────────────────────────────────────────────────────
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

  // ── Sample profiles ─────────────────────────────────────────────────────────
  const passwordHash = await hash(TEST_PASSWORD, 12)

  for (const p of MALE_PROFILES) {
    const exists = await prisma.user.findUnique({ where: { email: p.email } })
    if (exists) {
      console.log(`ℹ️  Profile already exists: ${p.email}`)
      continue
    }
    await prisma.user.create({
      data: {
        email: p.email,
        passwordHash,
        status: 'APPROVED',
        membershipTier: p.tier,
        profile: {
          create: {
            firstName: p.firstName,
            lastName: p.lastName,
            gender: 'MALE',
            dob: p.dob,
            religion: p.religion,
            caste: p.caste,
            motherTongue: p.motherTongue,
            height: p.height,
            maritalStatus: p.maritalStatus,
            education: p.education,
            occupation: p.occupation,
            annualIncome: p.annualIncome,
            city: p.city,
            state: p.state,
            aboutMe: p.aboutMe,
            familyType: p.familyType,
            familyStatus: p.familyStatus,
            isFeatured: p.isFeatured,
            photoUrls: [p.photo],
          },
        },
        preferences: {
          create: {
            ageMin: 24,
            ageMax: 36,
            religion: [p.religion],
            caste: [],
            motherTongue: [],
            maritalStatus: ['Never Married'],
            education: [],
            state: [],
          },
        },
      },
    })
    console.log(`✅ Male profile created: ${p.firstName} ${p.lastName}`)
  }

  for (const p of FEMALE_PROFILES) {
    const exists = await prisma.user.findUnique({ where: { email: p.email } })
    if (exists) {
      console.log(`ℹ️  Profile already exists: ${p.email}`)
      continue
    }
    await prisma.user.create({
      data: {
        email: p.email,
        passwordHash,
        status: 'APPROVED',
        membershipTier: p.tier,
        profile: {
          create: {
            firstName: p.firstName,
            lastName: p.lastName,
            gender: 'FEMALE',
            dob: p.dob,
            religion: p.religion,
            caste: p.caste,
            motherTongue: p.motherTongue,
            height: p.height,
            maritalStatus: p.maritalStatus,
            education: p.education,
            occupation: p.occupation,
            annualIncome: p.annualIncome,
            city: p.city,
            state: p.state,
            aboutMe: p.aboutMe,
            familyType: p.familyType,
            familyStatus: p.familyStatus,
            isFeatured: p.isFeatured,
            photoUrls: [p.photo],
          },
        },
        preferences: {
          create: {
            ageMin: 26,
            ageMax: 42,
            religion: [p.religion],
            caste: [],
            motherTongue: [],
            maritalStatus: ['Never Married'],
            education: [],
            state: [],
          },
        },
      },
    })
    console.log(`✅ Female profile created: ${p.firstName} ${p.lastName}`)
  }

  console.log('\n🎉 Seed complete. Login with any profile email + password: Test@1234')
}

main()
  .catch((e) => { console.error(e); process.exit(1) })
  .finally(() => prisma.$disconnect())
