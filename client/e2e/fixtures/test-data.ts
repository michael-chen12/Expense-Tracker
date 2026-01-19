/**
 * Test data fixtures for E2E tests
 */

// Test user credentials
export const TEST_USER = {
  id: 'e2e-test-user-id',
  email: 'e2e-test@example.com',
  password: 'TestPass123!',
  name: 'E2E Test User'
};

// Sample expense data
export const SAMPLE_EXPENSES = {
  groceries: {
    amountCents: 5000, // $50.00
    category: 'Food & Dining',
    note: 'Weekly groceries',
    date: '2026-01-15'
  },
  coffee: {
    amountCents: 450, // $4.50
    category: 'Food & Dining',
    note: 'Morning coffee',
    date: '2026-01-16'
  },
  gasoline: {
    amountCents: 4500, // $45.00
    category: 'Transportation',
    note: 'Gas station',
    date: '2026-01-16'
  },
  movieTicket: {
    amountCents: 1500, // $15.00
    category: 'Entertainment',
    note: 'Movie night',
    date: '2026-01-17'
  },
  utilities: {
    amountCents: 12000, // $120.00
    category: 'Bills & Utilities',
    note: 'Electricity bill',
    date: '2026-01-18'
  }
};

// Sample recurring expense data
export const SAMPLE_RECURRING_EXPENSES = {
  daily: {
    amountCents: 300, // $3.00
    category: 'Food & Dining',
    note: 'Daily coffee subscription',
    frequency: 'daily',
    nextDate: '2026-01-20'
  },
  weekly: {
    amountCents: 2000, // $20.00
    category: 'Health & Fitness',
    note: 'Gym membership weekly',
    frequency: 'weekly',
    dayOfWeek: 1, // Monday
    nextDate: '2026-01-20'
  },
  monthly: {
    amountCents: 999, // $9.99
    category: 'Entertainment',
    note: 'Streaming service',
    frequency: 'monthly',
    dayOfMonth: 1,
    nextDate: '2026-02-01'
  },
  yearly: {
    amountCents: 5000, // $50.00
    category: 'Shopping',
    note: 'Annual membership',
    frequency: 'yearly',
    dayOfMonth: 1,
    monthOfYear: 1,
    nextDate: '2027-01-01'
  }
};

// Sample allowance data
export const SAMPLE_ALLOWANCES = {
  daily: {
    amountCents: 5000, // $50.00
    cadence: 'day'
  },
  weekly: {
    amountCents: 30000, // $300.00
    cadence: 'week'
  },
  monthly: {
    amountCents: 100000, // $1,000.00
    cadence: 'month'
  }
};

// Helper function to get current date in YYYY-MM-DD format
export function getCurrentDate(): string {
  const now = new Date();
  return now.toISOString().split('T')[0];
}

// Helper function to get date N days ago
export function getDaysAgo(days: number): string {
  const date = new Date();
  date.setDate(date.getDate() - days);
  return date.toISOString().split('T')[0];
}

// Helper function to get date N days from now
export function getDaysFromNow(days: number): string {
  const date = new Date();
  date.setDate(date.getDate() + days);
  return date.toISOString().split('T')[0];
}

// Categories available in the app
export const CATEGORIES = [
  'Food & Dining',
  'Transportation',
  'Shopping',
  'Entertainment',
  'Bills & Utilities',
  'Health & Fitness',
  'Travel',
  'Personal Care',
  'Education',
  'Other'
];
