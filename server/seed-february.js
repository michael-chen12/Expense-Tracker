const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const fs = require('fs');

const DB_DIR = path.join(__dirname, 'data');
const DB_PATH = path.join(DB_DIR, 'expenses.db');

if (!fs.existsSync(DB_DIR)) {
  fs.mkdirSync(DB_DIR, { recursive: true });
}

const db = new sqlite3.Database(DB_PATH);

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

function parseAmountToCents(value) {
  const amount = Number(value);
  return Math.round(amount * 100);
}

db.serialize(() => {
  // Ensure table exists
  db.run(
    `CREATE TABLE IF NOT EXISTS expenses (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      amount_cents INTEGER NOT NULL,
      category TEXT NOT NULL,
      date TEXT NOT NULL,
      note TEXT,
      created_at TEXT NOT NULL
    )`,
    (err) => {
      if (err) {
        console.error('Error creating table:', err);
        return;
      }
      console.log('Table ready');
    }
  );

  // Insert February expenses
  const stmt = db.prepare(
    `INSERT INTO expenses (amount_cents, category, date, note, created_at)
     VALUES (?, ?, ?, ?, ?)`
  );

  let inserted = 0;
  februaryExpenses.forEach((expense) => {
    const amountCents = parseAmountToCents(expense.amount);
    const createdAt = new Date().toISOString();

    stmt.run(
      [amountCents, expense.category, expense.date, expense.note, createdAt],
      (err) => {
        if (err) {
          console.error('Error inserting expense:', err);
        } else {
          inserted++;
          console.log(`✓ Added: ${expense.date} - ${expense.category} - $${expense.amount}`);
        }
      }
    );
  });

  stmt.finalize(() => {
    console.log(`\n✅ Successfully seeded ${inserted} expenses for February 2026!`);
    console.log('Total amount:', februaryExpenses.reduce((sum, e) => sum + e.amount, 0).toFixed(2));
    db.close();
  });
});
