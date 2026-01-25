'use client';

import { useState, useCallback, useRef, useEffect } from 'react';

/**
 * Custom hook for managing auto-dismissing notifications
 * Reduces code duplication for error/success message patterns
 * 
 * @param {Object} options - Configuration options
 * @param {number} options.duration - Auto-dismiss duration in ms (default: 3000)
 * @returns {Object} Notification state and control functions
 * 
 * @example
 * const { error, success, showError, showSuccess, clearAll } = useNotifications();
 * 
 * // Show error (auto-dismisses after 3s)
 * showError('Failed to save');
 * 
 * // Show success (auto-dismisses after 3s)
 * showSuccess('Saved successfully!');
 * 
 * // Manual clear
 * clearAll();
 */
export function useNotifications({ duration = 3000 } = {}) {
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const timeoutRef = useRef(null);

  // Clear any existing timeout on unmount
  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  const showError = useCallback((message) => {
    // Clear existing timeout
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    setError(message);
    setSuccess('');

    if (duration > 0) {
      timeoutRef.current = setTimeout(() => {
        setError('');
      }, duration);
    }
  }, [duration]);

  const showSuccess = useCallback((message) => {
    // Clear existing timeout
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    setSuccess(message);
    setError('');

    if (duration > 0) {
      timeoutRef.current = setTimeout(() => {
        setSuccess('');
      }, duration);
    }
  }, [duration]);

  const clearAll = useCallback(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    setError('');
    setSuccess('');
  }, []);

  return {
    error,
    success,
    showError,
    showSuccess,
    clearAll
  };
}
