'use client';

import { useMemo, useState, useEffect } from 'react';
import {
  aggregateExpensesByMonth,
  aggregateExpensesByCategory,
  formatCurrency,
} from '@/lib/chart-utils';

/**
 * Custom hook to process expense data for charts
 * Aggregates and formats data for different chart components
 */
export function useChartData(expenses, allowanceData, fixedCosts, isLoadingExpenses = false) {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Track loading state based on data availability
  useEffect(() => {
    try {
      // If we're still loading expenses from the API, keep loading state
      if (isLoadingExpenses) {
        setIsLoading(true);
        setError(null);
        return;
      }

      // Once we have data (even if empty), processing is complete
      setIsLoading(false);
      setError(null);
    } catch (err) {
      setIsLoading(false);
      setError(err.message || 'Failed to process chart data');
    }
  }, [expenses, allowanceData, fixedCosts, isLoadingExpenses]);
  // Calculate monthly trend data (last 6 months)
  const monthlyTrendData = useMemo(() => {
    if (!expenses || expenses.length === 0) return [];
    return aggregateExpensesByMonth(expenses, 6);
  }, [expenses]);

  // Calculate category breakdown data (current month only)
  const categoryData = useMemo(() => {
    if (!expenses || expenses.length === 0) return [];
    return aggregateExpensesByCategory(expenses, true);
  }, [expenses]);

  // Calculate overview card metrics
  const overviewMetrics = useMemo(() => {
    if (!expenses || !allowanceData) {
      return {
        totalSpentThisMonth: '$0.00',
        allowanceRemaining: '$0.00',
        monthlyFixedCosts: '$0.00',
      };
    }

    // Calculate total spent this month
    const now = new Date();
    const currentMonth = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;

    const thisMonthExpenses = expenses.filter((expense) => {
      const expenseDate = new Date(expense.date);
      const expenseMonth = `${expenseDate.getFullYear()}-${String(expenseDate.getMonth() + 1).padStart(2, '0')}`;
      return expenseMonth === currentMonth;
    });

    const totalSpentCents = thisMonthExpenses.reduce(
      (sum, expense) => sum + (expense.amountCents || expense.amount * 100),
      0
    );

    // Calculate allowance remaining
    // allowanceData contains: settings { amount, cadence }, remaining, totalSpent, etc.
    // We need to use the settings.amount (in dollars) to calculate remaining
    const allowanceAmount = allowanceData?.settings?.amount || 0;
    const allowanceAmountCents = Math.round(allowanceAmount * 100);
    const remainingCents = Math.max(allowanceAmountCents - totalSpentCents, 0);

    // Calculate total fixed costs
    const totalFixedCostsCents = fixedCosts
      ? fixedCosts.reduce((sum, cost) => sum + (cost.amountCents || cost.amount * 100), 0)
      : 0;

    return {
      totalSpentThisMonth: formatCurrency(totalSpentCents),
      allowanceRemaining: formatCurrency(remainingCents),
      monthlyFixedCosts: formatCurrency(totalFixedCostsCents),
      totalSpentCents,
      allowanceCents: allowanceAmountCents,
    };
  }, [expenses, allowanceData, fixedCosts]);

  // Check if there's any data
  const hasData = expenses && expenses.length > 0;

  return {
    monthlyTrendData,
    categoryData,
    overviewMetrics,
    hasData,
    isLoading,
    error,
  };
}
