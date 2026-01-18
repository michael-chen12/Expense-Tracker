/**
 * Clear all data from the database
 * WARNING: This will delete ALL data! Use with caution.
 */

import dotenv from 'dotenv';
import path from 'path';

// Load .env from root directory
dotenv.config({ path: path.join(__dirname, '..', '.env') });

import { prisma } from './lib/prisma';

async function clearDatabase() {
  console.log('🗑️  Starting database cleanup...\n');

  try {
    // Delete all expenses
    const deletedExpenses = await prisma.expense.deleteMany({});
    console.log(`✅ Deleted ${deletedExpenses.count} expenses`);

    // Delete all fixed costs
    const deletedFixedCosts = await prisma.fixedCost.deleteMany({});
    console.log(`✅ Deleted ${deletedFixedCosts.count} fixed costs`);

    // Delete all allowances
    const deletedAllowances = await prisma.allowance.deleteMany({});
    console.log(`✅ Deleted ${deletedAllowances.count} allowances`);

    // Delete all users
    const deletedUsers = await prisma.user.deleteMany({});
    console.log(`✅ Deleted ${deletedUsers.count} users`);

    console.log('\n🎉 Database cleanup complete!');
    console.log('All tables are now empty.\n');

  } catch (error) {
    console.error('❌ Error clearing database:', error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

clearDatabase();
