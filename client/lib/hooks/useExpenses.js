'use client';

import { useState, useEffect, useCallback } from 'react';
import { getExpenses, deleteExpense } from '@/lib/api-backend';

/**
 * Custom hook for managing expenses data
 * Extracts expense fetching and deletion logic from components
 * Follows Single Responsibility Principle
 * 
 * @param {Object} options - Configuration options
 * @param {number} options.recentLimit - Number of recent expenses to fetch (default: 5)
 * @param {number} options.allLimit - Number of all expenses to fetch (default: 1000)
 * @returns {Object} Expenses state and control functions
 * 
 * @example
 * const { 
 *   recent, 
 *   allExpenses, 
 *   loading, 
 *   error, 
 *   refreshExpenses, 
 *   deleteExpenseById 
 * } = useExpenses();
 */
export function useExpenses({ recentLimit = 5, allLimit = 1000 } = {}) {
  const [recent, setRecent] = useState([]);
  const [allExpenses, setAllExpenses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Fetch expenses
  const fetchExpenses = useCallback(async () => {
    setLoading(true);
    
    try {
      // Fetch recent and all expenses in parallel
      const [recentData, allData] = await Promise.all([
        getExpenses({ pageSize: recentLimit }),
        getExpenses({ pageSize: allLimit })
      ]);

      setRecent(recentData.items || []);
      setAllExpenses(allData.items || []);
      setError('');
    } catch (fetchError) {
      setError(fetchError.message || 'Unable to load expenses.');
      console.error('Failed to fetch expenses:', fetchError);
    } finally {
      setLoading(false);
    }
  }, [recentLimit, allLimit]);

  // Initial fetch
  useEffect(() => {
    fetchExpenses();
  }, [fetchExpenses]);

  // Delete expense and refresh
  const deleteExpenseById = useCallback(async (expenseId) => {
    try {
      await deleteExpense(expenseId);
      // Refresh both lists after deletion
      await fetchExpenses();
      return { success: true };
    } catch (deleteError) {
      setError(deleteError.message || 'Unable to delete expense.');
      return { success: false, error: deleteError.message };
    }
  }, [fetchExpenses]);

  // Manual refresh
  const refreshExpenses = useCallback(() => {
    return fetchExpenses();
  }, [fetchExpenses]);

  return {
    recent,
    allExpenses,
    loading,
    error,
    setError,
    refreshExpenses,
    deleteExpenseById
  };
}
