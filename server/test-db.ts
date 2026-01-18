import dotenv from 'dotenv';
import path from 'path';

// Load .env from the root directory
dotenv.config({ path: path.join(__dirname, '..', '.env') });

import { prisma } from './lib/prisma';

async function testConnection() {
  try {
    console.log('Testing database connection...');

    // Try to query the database
    const result = await prisma.$queryRaw`SELECT current_database(), current_user`;
    console.log('✓ Connection successful!');
    console.log('Database info:', result);

    // Try to count users
    const userCount = await prisma.user.count();
    console.log(`✓ User table accessible. Current users: ${userCount}`);

    await prisma.$disconnect();
    console.log('✓ Test completed successfully!');
  } catch (error) {
    console.error('✗ Connection failed:', error);
    await prisma.$disconnect();
    process.exit(1);
  }
}

testConnection();
