'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { getRecurringExpenses } from '@/lib/api-backend';
import { formatCurrency } from '@/lib/format';
import Spinner from '@/components/Spinner';

export default function UpcomingRecurringExpenses() {
  const [upcoming, setUpcoming] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const loadUpcoming = async () => {
      try {
        setIsLoading(true);
        const all = await getRecurringExpenses();

        // Filter to next 7 days
        const today = new Date();
        const weekFromNow = new Date(today);
        weekFromNow.setDate(today.getDate() + 7);

        const filtered = all.filter(expense => {
          const nextDate = new Date(expense.nextDate);
          return nextDate >= today && nextDate <= weekFromNow;
        });

        // Sort by nextDate
        filtered.sort((a, b) => new Date(a.nextDate) - new Date(b.nextDate));

        setUpcoming(filtered);
        setError('');
      } catch (err) {
        setError(err.message || 'Failed to load upcoming expenses');
      } finally {
        setIsLoading(false);
      }
    };

    loadUpcoming();
  }, []);

  const getDaysUntil = (dateString) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const targetDate = new Date(dateString);
    targetDate.setHours(0, 0, 0, 0);
    const diffTime = targetDate - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 0) return 'Today';
    if (diffDays === 1) return 'Tomorrow';
    return `In ${diffDays} days`;
  };

  const getFrequencyLabel = (freq) => {
    switch (freq) {
      case 'daily': return 'Daily';
      case 'weekly': return 'Weekly';
      case 'monthly': return 'Monthly';
      case 'yearly': return 'Yearly';
      default: return freq;
    }
  };

  if (isLoading) {
    return (
      <section className="card section-card">
        <div className="card-header">
          <h2>Upcoming Recurring</h2>
        </div>
        <div className="loading-center">
          <Spinner size="medium" color="primary" />
        </div>
      </section>
    );
  }

  if (error) {
    return null; // Silently fail to not clutter the dashboard
  }

  if (upcoming.length === 0) {
    return null; // Don't show if no upcoming expenses
  }

  return (
    <section className="card section-card">
      <div className="card-header">
        <h2>Upcoming Recurring</h2>
        <Link className="button primary" href="/recurring">Manage</Link>
      </div>

      <div className="expense-list">
        {upcoming.map(expense => (
          <div key={expense.id} className="expense-row">
            <div>
              <h3>{expense.category}</h3>
              <p className="subtle">{getFrequencyLabel(expense.frequency)} • {getDaysUntil(expense.nextDate)}</p>
            </div>
            <div className="expense-amount">{formatCurrency(expense.amount)}</div>
          </div>
        ))}
      </div>
    </section>
  );
}
