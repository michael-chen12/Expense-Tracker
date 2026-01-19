'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import AuthGate from '@/components/AuthGate';
import Spinner from '@/components/Spinner';
import { deleteExpense, getExpenses } from '@/lib/api-backend';
import { formatCurrency, formatDate } from '@/lib/format';
import { useHasExpenses } from '@/lib/hooks/useHasExpenses';

function getMonthKey(dateValue) {
  const date = new Date(dateValue);
  if (Number.isNaN(date.getTime())) {
    return null;
  }
  const month = String(date.getMonth() + 1).padStart(2, '0');
  return `${date.getFullYear()}-${month}`;
}

function formatMonthLabel(monthKey) {
  const [year, month] = monthKey.split('-').map(Number);
  if (!year || !month) {
    return monthKey;
  }
  const date = new Date(year, month - 1, 1);
  return date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
}

export default function MonthlySummaryPage() {
  const router = useRouter();
  const { hasExpenses, isLoading: checkingExpenses } = useHasExpenses();
  const [months, setMonths] = useState([]);
  const [groupedExpenses, setGroupedExpenses] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [expandedKey, setExpandedKey] = useState('');

  // Redirect to dashboard if user has no expenses
  useEffect(() => {
    if (!checkingExpenses && hasExpenses === false) {
      router.replace('/');
    }
  }, [hasExpenses, checkingExpenses, router]);

  const loadExpenses = () => {
    setLoading(true);
    getExpenses({ page: 1, pageSize: 10000 })
      .then((data) => {
        const totals = new Map();
        const counts = new Map();
        const grouped = {};

        (data.items || []).forEach((expense) => {
          const key = getMonthKey(expense.date);
          if (!key) {
            return;
          }
          if (!grouped[key]) {
            grouped[key] = [];
          }
          grouped[key].push(expense);
          totals.set(key, (totals.get(key) || 0) + expense.amount);
          counts.set(key, (counts.get(key) || 0) + 1);
        });

        const result = Array.from(totals.entries()).map(([key, total]) => ({
          key,
          label: formatMonthLabel(key),
          total: Number(total.toFixed(2)),
          count: counts.get(key) || 0
        }));

        result.sort((a, b) => (a.key > b.key ? -1 : 1));
        setMonths(result);
        setGroupedExpenses(grouped);
        setError('');
      })
      .catch((fetchError) => {
        setError(fetchError.message || 'Unable to load monthly summary.');
      })
      .finally(() => {
        setLoading(false);
      });
  };

  useEffect(() => {
    loadExpenses();
  }, []);

  const handleDelete = async (expenseId) => {
    const confirmed = window.confirm('Delete this expense?');
    if (!confirmed) {
      return;
    }

    try {
      await deleteExpense(expenseId);
      
      // Check if this was the last expense
      const allExpenses = Object.values(groupedExpenses).flat();
      const remainingExpenses = allExpenses.filter((expense) => expense.id !== expenseId);
      
      if (remainingExpenses.length === 0) {
        // If no expenses remain after deletion, redirect to dashboard
        router.replace('/');
      } else {
        // Otherwise reload expenses
        loadExpenses();
      }
    } catch (deleteError) {
      setError(deleteError.message || 'Unable to delete expense.');
    }
  };

  // Show loading while checking if user has expenses
  if (checkingExpenses) {
    return (
      <AuthGate>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '60px 20px' }}>
          <Spinner size="large" color="primary" />
        </div>
      </AuthGate>
    );
  }

  // If user has no expenses, don't render (will redirect)
  if (hasExpenses === false) {
    return null;
  }

  return (
    <AuthGate>
      <div>
        <div className="page-header">
          <div>
            <h1>Monthly summary</h1>
            <p className="subtle">Totals for each month of recorded expenses.</p>
          </div>
        </div>

        {error ? <div className="error">{error}</div> : null}

        {loading ? (
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '20px' }}>
            <Spinner size="medium" color="primary" />
            <p className="subtle" style={{ margin: 0 }}>Loading summary...</p>
          </div>
        ) : months.length ? (
          <div className="expense-list">
            {months.map((month) => {
              const isExpanded = expandedKey === month.key;
              const monthExpenses = groupedExpenses[month.key] || [];

              return (
                <div key={month.key} className="card">
                  <button
                    className="expense-row summary-row"
                    type="button"
                    onClick={() => setExpandedKey(isExpanded ? '' : month.key)}
                  >
                    <div>
                      <h3>{month.label}</h3>
                      <p>{month.count} entries</p>
                    </div>
                    <div className="expense-amount">{formatCurrency(month.total)}</div>
                    <svg
                      width="20"
                      height="20"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      style={{
                        transition: 'transform 0.2s ease',
                        transform: isExpanded ? 'rotate(180deg)' : 'rotate(0deg)',
                        marginLeft: '12px'
                      }}
                    >
                      <polyline points="6 9 12 15 18 9" />
                    </svg>
                  </button>

                  <div
                    style={{
                      maxHeight: isExpanded ? '2000px' : '0',
                      overflow: 'hidden',
                      transition: 'max-height 0.5s ease-in-out, opacity 0.5s ease-in-out',
                      opacity: isExpanded ? 1 : 0
                    }}
                  >
                    <div className="expense-list" style={{ marginTop: '12px' }}>
                      {monthExpenses.map((expense) => (
                        <div key={expense.id} className="expense-row">
                          <div>
                            <h3>{expense.category}</h3>
                            <p>{expense.note || 'No note'} • {formatDate(expense.date)}</p>
                          </div>
                          <div className="expense-amount">{formatCurrency(expense.amount)}</div>
                          <div className="inline-actions">
                            <Link className="button ghost" href={`/expenses/${expense.id}`}>Edit</Link>
                            <button
                              className="button ghost"
                              type="button"
                              aria-label={`Delete ${expense.category}`}
                              onClick={() => handleDelete(expense.id)}
                            >
                              <svg
                                aria-hidden="true"
                                width="16"
                                height="16"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                              >
                                <polyline points="3 6 5 6 21 6" />
                                <path d="M8 6V4a1 1 0 0 1 1-1h6a1 1 0 0 1 1 1v2" />
                                <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" />
                                <line x1="10" y1="11" x2="10" y2="17" />
                                <line x1="14" y1="11" x2="14" y2="17" />
                              </svg>
                            </button>
                          </div>
                        </div>
                      ))}
                      {!monthExpenses.length ? (
                        <p className="subtle">No expenses recorded this month.</p>
                      ) : null}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <p className="subtle">No expenses yet. Add your first entry.</p>
        )}
      </div>
    </AuthGate>
  );
}
