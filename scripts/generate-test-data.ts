/**
 * Test Data Generator for IndianHearts USA
 * Generates sample users and data for testing
 *
 * Run with: npx ts-node scripts/generate-test-data.ts
 * Or: npx tsx scripts/generate-test-data.ts
 */

import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

interface TestUser {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  gender: 'MALE' | 'FEMALE';
  dob: Date;
  religion: string;
  city: string;
  state: string;
  photoUrls: string[];
}

const RELIGIONS = ['Hindu', 'Muslim', 'Christian', 'Sikh', 'Jain'];
const CITIES = ['San Francisco', 'New York', 'Chicago', 'Houston', 'Phoenix', 'Los Angeles'];
const STATES = ['California', 'New York', 'Illinois', 'Texas', 'Arizona'];
const EDUCATION = ['Bachelor', 'Master', 'MBA', 'PhD'];
const PROFESSIONS = [
  'Software Engineer',
  'Doctor',
  'Lawyer',
  'Accountant',
  'Consultant',
  'Manager',
  'Designer',
  'Analyst',
];
const FOOD_PREFS = ['vegetarian', 'non-vegetarian', 'vegan'];

async function generateTestData() {
  console.log('🧪 Generating test data for IndianHearts USA...\n');

  try {
    // Create 10 test users
    const testUsers: TestUser[] = [];

    for (let i = 1; i <= 10; i++) {
      const isMale = i % 2 === 0;
      testUsers.push({
        email: `testuser${i}@matrimonial.test`,
        password: 'TestPassword123!',
        firstName: isMale ? `Raj${i}` : `Priya${i}`,
        lastName: 'TestUser',
        gender: isMale ? 'MALE' : 'FEMALE',
        dob: new Date(1995 + Math.floor(Math.random() * 5), Math.floor(Math.random() * 12), 1),
        religion: RELIGIONS[i % RELIGIONS.length],
        city: CITIES[i % CITIES.length],
        state: STATES[i % STATES.length],
        photoUrls: [
          `https://i.pravatar.cc/400?u=testuser${i}@matrimonial.test&s=150`,
        ],
      });
    }

    // Create users in database
    const createdUsers = [];

    for (const testUser of testUsers) {
      try {
        // Check if user already exists
        const existing = await prisma.user.findUnique({
          where: { email: testUser.email },
        });

        if (existing) {
          console.log(`⏭️  User ${testUser.email} already exists, skipping...`);
          createdUsers.push(existing);
          continue;
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(testUser.password, 10);

        // Create user
        const user = await prisma.user.create({
          data: {
            email: testUser.email,
            passwordHash: hashedPassword,
            status: 'APPROVED', // Auto-approve test users
            role: 'USER',
            membershipTier: ['FREE', 'PREMIUM', 'ELITE'][Math.floor(Math.random() * 3)] as any,
            profile: {
              create: {
                firstName: testUser.firstName,
                lastName: testUser.lastName,
                gender: testUser.gender,
                dob: testUser.dob,
                religion: testUser.religion,
                caste: 'Test Caste',
                motherTongue: 'Hindi',
                height: '5\'8"',
                education: EDUCATION[Math.floor(Math.random() * EDUCATION.length)],
                profession: PROFESSIONS[Math.floor(Math.random() * PROFESSIONS.length)],
                salary: Math.floor(Math.random() * 200) * 1000 + 30000,
                city: testUser.city,
                state: testUser.state,
                photoUrls: testUser.photoUrls,
                aboutMe: `Hi, I'm ${testUser.firstName}! Looking for a meaningful connection.`,
                foodPreference: FOOD_PREFS[Math.floor(Math.random() * FOOD_PREFS.length)],
                willingToRelocate: Math.random() > 0.5,
                expectations: 'Honest, kind, and family-oriented partner',
                isFeatured: Math.random() > 0.7, // 30% chance of being featured
              },
            },
            preferences: {
              create: {
                ageMin: 20,
                ageMax: 40,
                religion: [RELIGIONS[Math.floor(Math.random() * RELIGIONS.length)]],
                educationMin: 'Bachelor',
              },
            },
          },
          include: { profile: true },
        });

        createdUsers.push(user);
        console.log(`✅ Created user: ${testUser.email}`);
      } catch (error) {
        console.error(`❌ Error creating user ${testUser.email}:`, error);
      }
    }

    console.log(`\n📝 Created ${createdUsers.length} users\n`);

    // Create relationships between users
    console.log('🔗 Creating test relationships...\n');

    // Create some interests
    if (createdUsers.length >= 2) {
      const user1 = createdUsers[0];
      const user2 = createdUsers[1];
      const user3 = createdUsers[2];

      // User 1 sends interest to User 2
      try {
        await prisma.interest.create({
          data: {
            senderId: user1.id,
            receiverId: user2.id,
            message: 'Hello! I found your profile interesting.',
            status: 'PENDING',
          },
        });
        console.log(`✅ Created interest: ${user1.email} → ${user2.email}`);
      } catch (error) {
        console.log(`ℹ️  Interest already exists or error occurred`);
      }

      // User 2 sends interest to User 1 (mutual)
      try {
        await prisma.interest.create({
          data: {
            senderId: user2.id,
            receiverId: user1.id,
            message: 'Hi! Nice to meet you.',
            status: 'ACCEPTED',
          },
        });
        console.log(`✅ Created mutual interest (accepted): ${user2.email} → ${user1.email}`);
      } catch (error) {
        console.log(`ℹ️  Mutual interest already exists`);
      }

      // Create some favorites
      try {
        await prisma.favorite.create({
          data: {
            userId: user1.id,
            profileId: user3.profile!.id,
          },
        });
        console.log(`✅ Created favorite: ${user1.email} saved ${user3.email}`);
      } catch (error) {
        console.log(`ℹ️  Favorite already exists`);
      }

      // Create messages
      try {
        await prisma.message.create({
          data: {
            senderId: user1.id,
            receiverId: user2.id,
            body: 'Hi! How are you doing?',
          },
        });
        console.log(`✅ Created message: ${user1.email} → ${user2.email}`);
      } catch (error) {
        console.log(`ℹ️  Message creation error`);
      }

      // Create profile views
      if (user1.profile && user2.profile) {
        try {
          await prisma.profileView.create({
            data: {
              viewerId: user1.id,
              profileId: user2.profile.id,
            },
          });
          console.log(`✅ Created profile view: ${user1.email} viewed ${user2.email}`);

          // Update profile view count
          await prisma.profile.update({
            where: { id: user2.profile.id },
            data: { profileViews: { increment: 1 } },
          });
        } catch (error) {
          console.log(`ℹ️  Profile view already exists`);
        }
      }
    }

    // Create success stories
    console.log('\n📖 Creating success stories...\n');

    const stories = [
      {
        coupleNames: 'Raj & Priya',
        story:
          'We met on the platform and instantly connected. After 6 months of chatting and dating, Raj proposed with the family blessing. Now happily married!',
        marriedOn: new Date(2024, 5, 15),
      },
      {
        coupleNames: 'Amit & Deepika',
        story:
          'Started as friends, fell in love. The platform gave us the courage to share our feelings. Getting married next month!',
        marriedOn: new Date(2025, 0, 20),
      },
      {
        coupleNames: 'Arjun & Isha',
        story:
          'Long-distance relationship that finally worked out. Thank you IndianHearts for bringing us together across states!',
        marriedOn: new Date(2024, 10, 10),
      },
    ];

    for (const story of stories) {
      try {
        const existing = await prisma.successStory.findFirst({
          where: { coupleNames: story.coupleNames },
        });

        if (existing) {
          console.log(`⏭️  Story for ${story.coupleNames} already exists`);
          continue;
        }

        await prisma.successStory.create({
          data: {
            coupleNames: story.coupleNames,
            story: story.story,
            marriedOn: story.marriedOn,
            approved: true,
          },
        });

        console.log(`✅ Created success story: ${story.coupleNames}`);
      } catch (error) {
        console.error(`❌ Error creating story:`, error);
      }
    }

    // Print summary
    console.log('\n\n📊 TEST DATA GENERATION SUMMARY');
    console.log('═══════════════════════════════════════════');
    console.log(`✅ Created ${createdUsers.length} test users`);
    console.log('\n🔑 Test User Credentials:');
    console.log('───────────────────────────────────────────');

    for (let i = 1; i <= Math.min(3, createdUsers.length); i++) {
      console.log(`   Email: testuser${i}@matrimonial.test`);
      console.log(`   Password: TestPassword123!`);
      console.log(`   Tier: ${createdUsers[i - 1]?.membershipTier || 'FREE'}`);
      console.log();
    }

    console.log('📍 Available URLs to test:');
    console.log('───────────────────────────────────────────');
    console.log('   http://localhost:3000/login');
    console.log('   http://localhost:3000/browse');
    console.log('   http://localhost:3000/search');
    console.log('   http://localhost:3000/success-stories');
    console.log('   http://localhost:3000/dashboard');
    console.log('   http://localhost:3000/dashboard/analytics');
    console.log('   http://localhost:3000/dashboard/favorites');
    console.log('   http://localhost:3000/dashboard/messages');
    console.log('   http://localhost:3000/dashboard/family');
    console.log();

    console.log('🧪 Run tests with:');
    console.log('───────────────────────────────────────────');
    console.log('   npx playwright test');
    console.log('   npx playwright test --headed (with UI)');
    console.log('   npx playwright test --debug (with inspector)');
    console.log();

    console.log('✨ Test data generation complete!');
  } catch (error) {
    console.error('❌ Error generating test data:', error);
  } finally {
    await prisma.$disconnect();
  }
}

generateTestData().catch((error) => {
  console.error(error);
  process.exit(1);
});
