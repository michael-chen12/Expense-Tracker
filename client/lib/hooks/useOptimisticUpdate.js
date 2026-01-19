import { useState, useCallback } from 'react';

/**
 * Hook for optimistic updates
 * Immediately updates UI, then syncs with server
 * Rolls back on error
 */
export function useOptimisticUpdate(initialData = []) {
  const [data, setData] = useState(initialData);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const optimisticUpdate = useCallback(async (updateFn, rollbackData) => {
    const previousData = data;

    try {
      setIsLoading(true);
      setError(null);

      // Immediately update UI
      setData(rollbackData || updateFn(data));

      // Sync with server
      const result = await updateFn();

      return result;
    } catch (err) {
      // Roll back on error
      setData(previousData);
      setError(err.message || 'Update failed');
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [data]);

  const setOptimisticData = useCallback((newData) => {
    setData(newData);
  }, []);

  return {
    data,
    setData: setOptimisticData,
    optimisticUpdate,
    isLoading,
    error
  };
}
