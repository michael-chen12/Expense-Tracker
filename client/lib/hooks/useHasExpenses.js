'use client';

import { useEffect, useState } from 'react';
import { getExpenses } from '@/lib/api-backend';

export function useHasExpenses() {
  const [hasExpenses, setHasExpenses] = useState(null); // null = loading, true/false = result
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    const checkExpenses = async () => {
      try {
        const data = await getExpenses({ pageSize: 1 });
        if (isMounted) {
          setHasExpenses((data.items || []).length > 0);
        }
      } catch (error) {
        console.error('Error checking expenses:', error);
        if (isMounted) {
          setHasExpenses(false);
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    checkExpenses();

    return () => {
      isMounted = false;
    };
  }, []);

  return { hasExpenses, isLoading };
}
