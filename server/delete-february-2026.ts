import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.join(__dirname, '..', '.env') });

import { prisma } from './lib/prisma';

async function deleteFebruary2026Expenses() {
  try {
    console.log('🗑️  Deleting February 2026 expenses...\n');

    // First, let's find all February 2026 expenses
    const expensesToDelete = await prisma.expense.findMany({
      where: {
        date: {
          startsWith: '2026-02'
        }
      },
      select: {
        id: true,
        date: true,
        category: true,
        amountCents: true
      }
    });

    console.log(`Found ${expensesToDelete.length} expenses from February 2026:`);
    expensesToDelete.forEach((expense) => {
      console.log(`  - ${expense.date}: ${expense.category} - $${(expense.amountCents / 100).toFixed(2)}`);
    });

    // Delete all expenses from February 2026
    const result = await prisma.expense.deleteMany({
      where: {
        date: {
          startsWith: '2026-02'
        }
      }
    });

    console.log(`\n✅ Successfully deleted ${result.count} expenses from February 2026!`);

    await prisma.$disconnect();
  } catch (error) {
    console.error('❌ Error deleting expenses:', error);
    await prisma.$disconnect();
    process.exit(1);
  }
}

deleteFebruary2026Expenses();
