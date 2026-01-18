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
export function useChartData(expenses, allowanceData, isLoadingExpenses = false, dateRange = null) {
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
  }, [expenses, allowanceData, isLoadingExpenses]);

  // Filter expenses by date range
  const filteredExpenses = useMemo(() => {
    if (!expenses || expenses.length === 0 || !dateRange) return expenses;

    return expenses.filter((expense) => {
      const expenseDate = expense.date;
      return expenseDate >= dateRange.from && expenseDate <= dateRange.to;
    });
  }, [expenses, dateRange]);

  // Calculate monthly trend data (based on filtered expenses)
  const monthlyTrendData = useMemo(() => {
    if (!filteredExpenses || filteredExpenses.length === 0) return [];

    // Calculate number of months in the selected range
    if (dateRange) {
      const fromDate = new Date(dateRange.from);
      const toDate = new Date(dateRange.to);
      const monthsDiff = (toDate.getFullYear() - fromDate.getFullYear()) * 12 +
                         (toDate.getMonth() - fromDate.getMonth()) + 1;
      const monthsToShow = Math.min(Math.max(monthsDiff, 1), 12); // Cap at 12 months for readability
      return aggregateExpensesByMonth(filteredExpenses, monthsToShow);
    }

    return aggregateExpensesByMonth(filteredExpenses, 6);
  }, [filteredExpenses, dateRange]);

  // Calculate category breakdown data (for selected date range)
  const categoryData = useMemo(() => {
    if (!filteredExpenses || filteredExpenses.length === 0) return [];
    return aggregateExpensesByCategory(filteredExpenses, false); // Don't filter to current month - already filtered
  }, [filteredExpenses]);

  // Calculate overview card metrics
  const overviewMetrics = useMemo(() => {
    if (!filteredExpenses || !allowanceData) {
      return {
        totalSpentThisMonth: '$0.00',
        allowanceRemaining: '$0.00',
        totalSpentCents: 0,
        allowanceCents: 0,
      };
    }

    // Calculate total spent in selected period
    const totalSpentCents = filteredExpenses.reduce(
      (sum, expense) => sum + (expense.amountCents || expense.amount * 100),
      0
    );

    // Calculate allowance remaining
    // allowanceData contains: settings { amount, cadence }, remaining, totalSpent, etc.
    // We need to use the settings.amount (in dollars) to calculate remaining
    const allowanceAmount = allowanceData?.settings?.amount || 0;
    const allowanceAmountCents = Math.round(allowanceAmount * 100);
    const remainingCents = Math.max(allowanceAmountCents - totalSpentCents, 0);

    return {
      totalSpentThisMonth: formatCurrency(totalSpentCents),
      allowanceRemaining: formatCurrency(remainingCents),
      totalSpentCents,
      allowanceCents: allowanceAmountCents,
    };
  }, [filteredExpenses, allowanceData]);

  // Check if there's any data
  const hasData = filteredExpenses && filteredExpenses.length > 0;

  return {
    monthlyTrendData,
    categoryData,
    overviewMetrics,
    hasData,
    isLoading,
    error,
  };
}
