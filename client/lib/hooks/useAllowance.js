'use client';

import { useState, useEffect, useCallback } from 'react';
import {
  getAllowanceSettings,
  getAllowanceStatus,
  setAllowanceSettings
} from '@/lib/api-backend';
import { validateAllowance } from '@/lib/validators';

/**
 * Custom hook for managing allowance settings and status
 * Extracts allowance logic from Dashboard component
 * Reduces cognitive load and improves testability
 * 
 * @param {string} userId - User ID for fetching allowance data
 * @returns {Object} Allowance state and control functions
 * 
 * @example
 * const {
 *   allowance,
 *   allowanceStatus,
 *   loading,
 *   error,
 *   saving,
 *   handleChange,
 *   handleSubmit,
 *   refreshAllowance
 * } = useAllowance(userId);
 */
export function useAllowance(userId) {
  const [allowance, setAllowance] = useState({ amount: '', cadence: 'month' });
  const [allowanceStatus, setAllowanceStatus] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);

  // Fetch allowance data
  const fetchAllowance = useCallback(async () => {
    if (!userId) {
      setLoading(false);
      return;
    }

    setLoading(true);

    try {
      const [settings, status] = await Promise.all([
        getAllowanceSettings(),
        getAllowanceStatus()
      ]);

      setAllowance({
        amount: String(settings.amount),
        cadence: settings.cadence
      });
      setAllowanceStatus(status);
      setError('');
    } catch (fetchError) {
      console.error('[useAllowance] Error loading allowance:', fetchError);
      setError(fetchError.message || 'Unable to load allowance settings.');
    } finally {
      setLoading(false);
    }
  }, [userId]);

  // Initial fetch
  useEffect(() => {
    fetchAllowance();
  }, [fetchAllowance]);

  // Handle form field changes
  const handleChange = useCallback((event) => {
    const { name, value } = event.target;
    setAllowance((prev) => ({
      ...prev,
      [name]: value
    }));
  }, []);

  // Handle form submission
  const handleSubmit = useCallback(async (event) => {
    event.preventDefault();
    setError('');

    // Validate before submission
    const validationError = validateAllowance(allowance);
    if (validationError) {
      setError(validationError);
      return { success: false };
    }

    setSaving(true);

    try {
      const saved = await setAllowanceSettings({
        amount: allowance.amount,
        cadence: allowance.cadence
      });

      setAllowance({
        amount: String(saved.amount),
        cadence: saved.cadence
      });

      const status = await getAllowanceStatus();
      setAllowanceStatus(status);

      return { success: true };
    } catch (submitError) {
      const errorMessage = submitError.message || 'Unable to save allowance.';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setSaving(false);
    }
  }, [allowance]);

  // Manual refresh
  const refreshAllowance = useCallback(() => {
    return fetchAllowance();
  }, [fetchAllowance]);

  return {
    allowance,
    allowanceStatus,
    loading,
    error,
    setError,
    saving,
    handleChange,
    handleSubmit,
    refreshAllowance
  };
}
