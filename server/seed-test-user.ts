import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.join(__dirname, '..', '.env') });

import { prisma } from './lib/prisma';

async function createTestUser() {
  try {
    const existingUser = await prisma.user.findUnique({
      where: { id: 'temp-user-id' }
    });

    if (existingUser) {
      console.log('✓ Test user already exists:', existingUser);
      return;
    }

    const user = await prisma.user.create({
      data: {
        id: 'temp-user-id',
        email: 'test@example.com',
        name: 'Test User'
      }
    });

    console.log('✓ Test user created:', user);
    await prisma.$disconnect();
  } catch (error) {
    console.error('Error creating test user:', error);
    await prisma.$disconnect();
    process.exit(1);
  }
}

createTestUser();
