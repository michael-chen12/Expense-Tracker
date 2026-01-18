/**
 * Add password column to User table
 */

import dotenv from 'dotenv';
import path from 'path';

// Load .env from root directory
dotenv.config({ path: path.join(__dirname, '..', '.env') });

import { prisma } from './lib/prisma';

async function addPasswordColumn() {
  console.log('🔧 Adding password column to User table...\n');

  try {
    // Execute raw SQL to add password column
    await prisma.$executeRaw`ALTER TABLE "User" ADD COLUMN IF NOT EXISTS "password" TEXT;`;

    console.log('✅ Password column added successfully!\n');
  } catch (error) {
    console.error('❌ Error adding password column:', error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

addPasswordColumn();
