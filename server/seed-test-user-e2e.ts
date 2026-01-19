import dotenv from 'dotenv';
import path from 'path';
import bcrypt from 'bcrypt';

dotenv.config({ path: path.join(__dirname, '..', '.env') });

import { prisma } from './lib/prisma';

const E2E_USER_ID = 'e2e-test-user-id';
const E2E_EMAIL = 'e2e-test@example.com';
const E2E_PASSWORD = 'TestPass123!';
const SALT_ROUNDS = 10;

async function seedE2ETestUser() {
  try {
    console.log('🧹 Cleaning up existing E2E test user data...');

    // Delete existing test user (cascade will delete related data)
    const existingUser = await prisma.user.findUnique({
      where: { id: E2E_USER_ID }
    });

    if (existingUser) {
      await prisma.user.delete({
        where: { id: E2E_USER_ID }
      });
      console.log('✓ Deleted existing E2E test user and related data');
    }

    console.log('🔑 Hashing password...');
    const hashedPassword = await bcrypt.hash(E2E_PASSWORD, SALT_ROUNDS);

    console.log('👤 Creating E2E test user...');
    const user = await prisma.user.create({
      data: {
        id: E2E_USER_ID,
        email: E2E_EMAIL,
        password: hashedPassword,
        name: 'E2E Test User'
      }
    });

    console.log('✓ E2E test user created successfully:');
    console.log(`  - ID: ${user.id}`);
    console.log(`  - Email: ${user.email}`);
    console.log(`  - Name: ${user.name}`);
    console.log(`  - Password: ${E2E_PASSWORD} (hashed)`);

    await prisma.$disconnect();
  } catch (error) {
    console.error('❌ Error seeding E2E test user:', error);
    await prisma.$disconnect();
    process.exit(1);
  }
}

seedE2ETestUser();
