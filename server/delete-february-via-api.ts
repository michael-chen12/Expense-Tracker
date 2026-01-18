import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.join(__dirname, '..', '.env') });

const API_URL = 'http://localhost:4000';

interface Expense {
  id: number;
  amount: number;
  category: string;
  date: string;
  note: string;
  userId: string;
}

interface ExpenseListResponse {
  items: Expense[];
  page: number;
  pageSize: number;
  totalCount: number;
}

async function deleteFebruary2026Expenses() {
  try {
    console.log('🗑️  Fetching all expenses...\n');

    // Fetch all expenses (using a large page size)
    const response = await fetch(`${API_URL}/api/expenses?pageSize=10000`);
    if (!response.ok) {
      throw new Error(`Failed to fetch expenses: ${response.statusText}`);
    }

    const data = await response.json() as ExpenseListResponse;

    // Filter for February 2026 expenses
    const februaryExpenses = data.items.filter(expense =>
      expense.date.startsWith('2026-02')
    );

    console.log(`Found ${februaryExpenses.length} expenses from February 2026:\n`);

    if (februaryExpenses.length === 0) {
      console.log('✅ No February 2026 expenses to delete.');
      return;
    }

    februaryExpenses.forEach((expense) => {
      console.log(`  - ID ${expense.id}: ${expense.date} - ${expense.category} - $${expense.amount}`);
    });

    console.log(`\n🗑️  Deleting ${februaryExpenses.length} expenses...\n`);

    // Delete each expense
    let deleted = 0;
    let failed = 0;

    for (const expense of februaryExpenses) {
      try {
        const deleteResponse = await fetch(`${API_URL}/api/expenses/${expense.id}`, {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
            'X-User-Id': expense.userId || ''
          }
        });

        if (deleteResponse.ok) {
          deleted++;
          console.log(`  ✓ Deleted expense ${expense.id}`);
        } else {
          failed++;
          console.error(`  ✗ Failed to delete expense ${expense.id}: ${deleteResponse.statusText}`);
        }
      } catch (error) {
        failed++;
        console.error(`  ✗ Error deleting expense ${expense.id}:`, error);
      }
    }

    console.log(`\n✅ Deletion complete!`);
    console.log(`   - Successfully deleted: ${deleted}`);
    if (failed > 0) {
      console.log(`   - Failed: ${failed}`);
    }

  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
}

deleteFebruary2026Expenses();
