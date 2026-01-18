/**
 * Utility functions for processing and aggregating expense data for charts
 */

export interface Expense {
  id: number;
  amountCents?: number;
  amount?: number;
  category: string;
  note?: string;
  date: string;
  createdAt: string;
}

export interface MonthlyData {
  month: string;
  monthLabel: string;
  total: number;
  count: number;
}

export interface CategoryData {
  category: string;
  total: number;
  percentage: number;
  color: string;
}

/**
 * Aggregates expenses by month for the spending trend chart
 * @param expenses - Array of expense objects
 * @param monthsToShow - Number of months to include (default: 6)
 * @returns Array of monthly aggregated data sorted chronologically
 */
export function aggregateExpensesByMonth(
  expenses: Expense[],
  monthsToShow: number = 6
): MonthlyData[] {
  if (!expenses || expenses.length === 0) {
    return [];
  }

  // Group expenses by month
  const monthlyMap = new Map<string, { total: number; count: number }>();

  expenses.forEach((expense) => {
    const date = new Date(expense.date);
    const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
    const amountCents = expense.amountCents ?? (expense.amount ? expense.amount * 100 : 0);

    if (monthlyMap.has(monthKey)) {
      const existing = monthlyMap.get(monthKey)!;
      monthlyMap.set(monthKey, {
        total: existing.total + amountCents,
        count: existing.count + 1,
      });
    } else {
      monthlyMap.set(monthKey, {
        total: amountCents,
        count: 1,
      });
    }
  });

  // Get the last N months
  const now = new Date();
  const monthsData: MonthlyData[] = [];

  for (let i = monthsToShow - 1; i >= 0; i--) {
    const targetDate = new Date(now.getFullYear(), now.getMonth() - i, 1);
    const monthKey = `${targetDate.getFullYear()}-${String(targetDate.getMonth() + 1).padStart(2, '0')}`;

    const data = monthlyMap.get(monthKey) || { total: 0, count: 0 };

    monthsData.push({
      month: monthKey,
      monthLabel: formatMonthLabel(monthKey),
      total: data.total / 100, // Convert cents to dollars
      count: data.count,
    });
  }

  return monthsData;
}

/**
 * Aggregates expenses by category for the category breakdown chart
 * @param expenses - Array of expense objects
 * @param currentMonthOnly - If true, only include expenses from current month
 * @returns Array of category aggregated data with percentages
 */
export function aggregateExpensesByCategory(
  expenses: Expense[],
  currentMonthOnly: boolean = true
): CategoryData[] {
  if (!expenses || expenses.length === 0) {
    return [];
  }

  // Filter to current month if specified
  let filteredExpenses = expenses;
  if (currentMonthOnly) {
    const now = new Date();
    const currentMonth = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;

    filteredExpenses = expenses.filter((expense) => {
      const expenseDate = new Date(expense.date);
      const expenseMonth = `${expenseDate.getFullYear()}-${String(expenseDate.getMonth() + 1).padStart(2, '0')}`;
      return expenseMonth === currentMonth;
    });
  }

  if (filteredExpenses.length === 0) {
    return [];
  }

  // Group by category
  const categoryMap = new Map<string, number>();
  let totalAmount = 0;

  filteredExpenses.forEach((expense) => {
    const category = expense.category || 'Other';
    const currentTotal = categoryMap.get(category) || 0;
    const amountCents = expense.amountCents ?? (expense.amount ? expense.amount * 100 : 0);
    categoryMap.set(category, currentTotal + amountCents);
    totalAmount += amountCents;
  });

  // Convert to array with percentages and colors
  const categoryData: CategoryData[] = [];
  const categoryColors = generateCategoryColors();

  categoryMap.forEach((total, category) => {
    categoryData.push({
      category,
      total: total / 100, // Convert cents to dollars
      percentage: calculatePercentage(total, totalAmount),
      color: categoryColors[category] || '#6b645b',
    });
  });

  // Sort by total (descending)
  categoryData.sort((a, b) => b.total - a.total);

  return categoryData;
}

/**
 * Generates consistent colors for categories
 * @returns Object mapping category names to color hex codes
 */
export function generateCategoryColors(): Record<string, string> {
  return {
    Food: '#ff7a00',
    Transportation: '#4299e1',
    Housing: '#48bb78',
    Utilities: '#ed8936',
    Entertainment: '#9f7aea',
    Health: '#f56565',
    Shopping: '#f6ad55',
    Education: '#38b2ac',
    Other: '#6b645b',
  };
}

/**
 * Formats month key (YYYY-MM) to readable label
 * @param monthKey - Month in YYYY-MM format
 * @returns Formatted month label (e.g., "Jan 2026" or "January 2026")
 */
export function formatMonthLabel(monthKey: string, short: boolean = true): string {
  const [year, month] = monthKey.split('-');
  const date = new Date(parseInt(year), parseInt(month) - 1, 1);

  const monthName = date.toLocaleString('en-US', {
    month: short ? 'short' : 'long',
  });

  return `${monthName} ${year}`;
}

/**
 * Calculates percentage with proper rounding
 * @param value - The part value
 * @param total - The total value
 * @returns Percentage rounded to 1 decimal place
 */
export function calculatePercentage(value: number, total: number): number {
  if (total === 0) return 0;
  return Math.round((value / total) * 1000) / 10; // Round to 1 decimal
}

/**
 * Formats currency amount
 * @param cents - Amount in cents
 * @returns Formatted currency string (e.g., "$1,234.56")
 */
export function formatCurrency(cents: number): string {
  const dollars = cents / 100;
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(dollars);
}

/**
 * Formats large numbers with K/M suffix
 * @param value - Number to format
 * @returns Formatted string (e.g., "1.2K", "3.4M")
 */
export function formatCompactNumber(value: number): string {
  if (value >= 1000000) {
    return `${(value / 1000000).toFixed(1)}M`;
  } else if (value >= 1000) {
    return `${(value / 1000).toFixed(1)}K`;
  }
  return value.toFixed(0);
}
