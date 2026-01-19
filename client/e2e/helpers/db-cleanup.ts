import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import { Pool } from 'pg';

const E2E_USER_ID = 'e2e-test-user-id';

/**
 * Clean all test user data from the database
 * This ensures a clean slate before running E2E tests
 */
export async function cleanTestUserData() {
  const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
  });

  const adapter = new PrismaPg(pool);
  const prisma = new PrismaClient({ adapter });

  try {
    console.log('🧹 Cleaning test user data...');

    // Delete all expenses for the test user
    const deletedExpenses = await prisma.expense.deleteMany({
      where: { userId: E2E_USER_ID }
    });
    console.log(`  ✓ Deleted ${deletedExpenses.count} expenses`);

    // Delete all recurring expenses for the test user
    const deletedRecurring = await prisma.recurringExpense.deleteMany({
      where: { userId: E2E_USER_ID }
    });
    console.log(`  ✓ Deleted ${deletedRecurring.count} recurring expenses`);

    // Delete allowance for the test user
    const deletedAllowance = await prisma.allowance.deleteMany({
      where: { userId: E2E_USER_ID }
    });
    console.log(`  ✓ Deleted ${deletedAllowance.count} allowance record(s)`);

    console.log('✓ Test user data cleaned successfully');
  } catch (error) {
    console.error('❌ Error cleaning test user data:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
    await pool.end();
  }
}

/**
 * Verify the test user exists in the database
 */
export async function verifyTestUser() {
  const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
  });

  const adapter = new PrismaPg(pool);
  const prisma = new PrismaClient({ adapter });

  try {
    const user = await prisma.user.findUnique({
      where: { id: E2E_USER_ID }
    });

    if (!user) {
      throw new Error(`E2E test user not found. Please run: cd server && npm run seed:e2e-user`);
    }

    console.log('✓ E2E test user verified');
    return user;
  } catch (error) {
    console.error('❌ Error verifying test user:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
    await pool.end();
  }
}
