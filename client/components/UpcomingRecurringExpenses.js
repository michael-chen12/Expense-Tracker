'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { getRecurringExpenses } from '@/lib/api-backend';

const FREQUENCY_LABELS = {
  daily: 'Daily',
  weekly: 'Weekly',
  monthly: 'Monthly',
  yearly: 'Yearly',
};

export default function UpcomingRecurringExpenses() {
  const [upcoming, setUpcoming] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    loadUpcomingRecurring();
  }, []);

  const loadUpcomingRecurring = async () => {
    try {
      const data = await getRecurringExpenses();
      // Get upcoming expenses (next 7 days)
      const today = new Date();
      const nextWeek = new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000);
      
      const upcomingItems = data
        .filter(item => {
          const nextDate = new Date(item.nextDate + 'T00:00:00');
          return nextDate >= today && nextDate <= nextWeek;
        })
        .sort((a, b) => new Date(a.nextDate) - new Date(b.nextDate))
        .slice(0, 5);

      setUpcoming(upcomingItems);
      setError('');
    } catch (err) {
      setError('Failed to load recurring expenses');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const formatDate = (dateStr) => {
    return new Date(dateStr + 'T00:00:00').toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
    });
  };

  const getDaysUntil = (dateStr) => {
    const today = new Date();
    const targetDate = new Date(dateStr + 'T00:00:00');
    const diffTime = targetDate - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) return 'Today';
    if (diffDays === 1) return 'Tomorrow';
    return `In ${diffDays} days`;
  };

  if (isLoading) {
    return (
      <div className="card">
        <h2>Upcoming Recurring</h2>
        <div className="space-y-2">
          {[...Array(2)].map((_, i) => (
            <div key={i} className="h-4 bg-gray-200 rounded animate-pulse"></div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="card">
        <h2>Upcoming Recurring</h2>
        <p className="text-sm text-red-600">{error}</p>
      </div>
    );
  }

  if (upcoming.length === 0) {
    return (
      <div className="card">
        <h2>Upcoming Recurring</h2>
        <p className="subtle text-sm">No recurring expenses due in the next 7 days.</p>
        <Link className="button primary text-sm mt-3" href="/recurring">
          Manage Recurring
        </Link>
      </div>
    );
  }

  return (
    <div className="card">
      <div className="flex justify-between items-center mb-3">
        <h2>Upcoming Recurring</h2>
        <Link className="button secondary text-xs" href="/recurring">
          Manage
        </Link>
      </div>
      <div className="space-y-3">
        {upcoming.map((item) => (
          <div key={item.id} className="flex justify-between items-center p-2 bg-orange-50 rounded-lg">
            <div className="flex-1">
              <p className="font-medium text-gray-900">{item.category}</p>
              <p className="text-xs text-gray-600">{FREQUENCY_LABELS[item.frequency]}</p>
            </div>
            <div className="text-right">
              <p className="font-semibold text-gray-900">${item.amount.toFixed(2)}</p>
              <p className="text-xs text-gray-600">{getDaysUntil(item.nextDate)}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
