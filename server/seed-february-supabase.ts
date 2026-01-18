import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.join(__dirname, '..', '.env') });

import { prisma } from './lib/prisma';

// Sample expenses for February 2026
const februaryExpenses = [
  { amount: 45.50, category: 'Groceries', date: '2026-02-01', note: 'Weekly shopping' },
  { amount: 12.99, category: 'Coffee', date: '2026-02-02', note: 'Morning coffee' },
  { amount: 85.00, category: 'Utilities', date: '2026-02-03', note: 'Electricity bill' },
  { amount: 25.00, category: 'Entertainment', date: '2026-02-05', note: 'Movie tickets' },
  { amount: 120.00, category: 'Groceries', date: '2026-02-07', note: 'Bulk shopping' },
  { amount: 8.50, category: 'Coffee', date: '2026-02-08', note: 'Afternoon latte' },
  { amount: 55.00, category: 'Dining', date: '2026-02-10', note: 'Restaurant dinner' },
  { amount: 30.00, category: 'Transportation', date: '2026-02-12', note: 'Gas fill-up' },
  { amount: 15.99, category: 'Entertainment', date: '2026-02-14', note: 'Streaming service' },
  { amount: 95.00, category: 'Groceries', date: '2026-02-15', note: 'Weekly shopping' },
  { amount: 42.00, category: 'Dining', date: '2026-02-17', note: 'Lunch with friends' },
  { amount: 18.00, category: 'Coffee', date: '2026-02-18', note: 'Coffee beans' },
  { amount: 75.00, category: 'Health', date: '2026-02-20', note: 'Pharmacy' },
  { amount: 150.00, category: 'Shopping', date: '2026-02-21', note: 'New clothes' },
  { amount: 65.00, category: 'Groceries', date: '2026-02-22', note: 'Weekend shopping' },
  { amount: 28.50, category: 'Transportation', date: '2026-02-24', note: 'Gas' },
  { amount: 90.00, category: 'Dining', date: '2026-02-25', note: 'Date night' },
  { amount: 35.00, category: 'Entertainment', date: '2026-02-27', note: 'Concert tickets' },
  { amount: 22.00, category: 'Coffee', date: '2026-02-28', note: 'Coffee shop visit' }
];

function parseAmountToCents(value: number): number {
  return Math.round(value * 100);
}

async function seedFebruaryExpenses(userId?: string) {
  try {
    // If no userId provided, get the first user or allow manual input
    let targetUserId = userId;

    if (!targetUserId) {
      console.log('No user ID provided. Finding users in database...\n');

      const users = await prisma.user.findMany({
        select: {
          id: true,
          email: true,
          name: true,
          githubId: true
        },
        take: 10
      });

      if (users.length === 0) {
        console.error('❌ No users found in database. Please create a user first.');
        process.exit(1);
      }

      console.log('Available users:');
      users.forEach((user, index) => {
        console.log(`${index + 1}. ${user.email || 'No email'} (${user.name || 'No name'}) - ID: ${user.id}`);
      });

      // Use the first user by default
      targetUserId = users[0].id;
      console.log(`\nUsing first user: ${users[0].email || users[0].name || users[0].id}\n`);
    }

    // Verify user exists
    const user = await prisma.user.findUnique({
      where: { id: targetUserId }
    });

    if (!user) {
      console.error(`❌ User with ID ${targetUserId} not found`);
      process.exit(1);
    }

    console.log(`📝 Seeding February 2026 expenses for: ${user.email || user.name || user.id}\n`);

    // Insert expenses
    let inserted = 0;
    for (const expense of februaryExpenses) {
      const created = await prisma.expense.create({
        data: {
          userId: targetUserId,
          amountCents: parseAmountToCents(expense.amount),
          category: expense.category,
          date: expense.date,
          note: expense.note
        }
      });

      inserted++;
      console.log(`✓ Added: ${expense.date} - ${expense.category} - $${expense.amount}`);
    }

    const total = februaryExpenses.reduce((sum, e) => sum + e.amount, 0);
    console.log(`\n✅ Successfully seeded ${inserted} expenses for February 2026!`);
    console.log(`Total amount: $${total.toFixed(2)}`);

    await prisma.$disconnect();
  } catch (error) {
    console.error('❌ Error seeding expenses:', error);
    await prisma.$disconnect();
    process.exit(1);
  }
}

// Allow passing user ID as command line argument
const userIdArg = process.argv[2];
seedFebruaryExpenses(userIdArg);
