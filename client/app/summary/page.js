'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import AuthGate from '@/components/AuthGate';
import Spinner from '@/components/Spinner';
import { Button } from '@/components/Button';
import { Modal, ModalActions } from '@/components/Modal';
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
  const [confirmExpense, setConfirmExpense] = useState(null);
  const [deleting, setDeleting] = useState(false);

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

  const requestDelete = (expense) => {
    setConfirmExpense(expense);
  };

  const handleDelete = async () => {
    if (!confirmExpense) return;

    setDeleting(true);

    try {
      await deleteExpense(confirmExpense.id);
      
      // Check if this was the last expense
      const allExpenses = Object.values(groupedExpenses).flat();
      const remainingExpenses = allExpenses.filter((expense) => expense.id !== confirmExpense.id);
      
      if (remainingExpenses.length === 0) {
        // If no expenses remain after deletion, redirect to dashboard
        router.replace('/');
      } else {
        // Otherwise reload expenses
        loadExpenses();
      }
    } catch (deleteError) {
      setError(deleteError.message || 'Unable to delete expense.');
    } finally {
      setDeleting(false);
      setConfirmExpense(null);
    }
  };

  // Show loading while checking if user has expenses
  if (checkingExpenses) {
    return (
      <AuthGate>
        <div className="loading-state-centered">
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
          <div className="loading-state">
            <Spinner size="medium" color="primary" />
            <p className="subtle no-margin">Loading summary...</p>
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
                      className={`summary-expand-icon ${isExpanded ? 'summary-expand-icon--expanded' : ''}`}
                    >
                      <polyline points="6 9 12 15 18 9" />
                    </svg>
                  </button>

                  <div className={`summary-expense-list ${isExpanded ? 'summary-expense-list--expanded' : ''}`}>
                    <div className="expense-list summary-expense-list-inner">
                      {monthExpenses.map((expense) => (
                        <div key={expense.id} className="expense-row">
                          <div>
                            <h3>{expense.category}</h3>
                            <p>{expense.note || 'No note'} • {formatDate(expense.date)}</p>
                          </div>
                          <div className="expense-amount">{formatCurrency(expense.amount)}</div>
                          <div className="inline-actions">
                            <Link
                              className="button ghost button--icon"
                              href={`/expenses/${expense.id}`}
                              aria-label={`Edit ${expense.category}`}
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
                                <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                                <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
                              </svg>
                            </Link>
                            <button
                              className="button ghost button--icon"
                              type="button"
                              aria-label={`Delete ${expense.category}`}
                              onClick={() => requestDelete(expense)}
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

        <Modal
          open={Boolean(confirmExpense)}
          onClose={() => setConfirmExpense(null)}
          title="Delete expense"
          description="This will permanently remove the selected expense."
        >
          {confirmExpense ? (
            <div className="modal-detail-card">
              <div className="modal-detail-header">
                <div>
                  <p className="modal-detail-title">{confirmExpense.category || 'Uncategorized'}</p>
                  <p className="modal-detail-meta">Date: {confirmExpense.date ? formatDate(confirmExpense.date) : '—'}</p>
                </div>
                <p className="modal-detail-amount">{formatCurrency(confirmExpense.amount || 0)}</p>
              </div>
              <p className="modal-detail-note">{confirmExpense.note || 'No note provided.'}</p>
            </div>
          ) : null}

          <p className="modal-message">Delete expense?</p>
          <ModalActions>
            <button
              type="button"
              className="button ghost"
              onClick={() => setConfirmExpense(null)}
              disabled={deleting}
            >
              Cancel
            </button>
            <button
              type="button"
              className="button primary"
              onClick={handleDelete}
              disabled={deleting}
            >
              {deleting ? (
                <span className="button-loading-content">
                  <Spinner size="small" color="white" />
                  Deleting...
                </span>
              ) : 'Delete expense'}
            </button>
          </ModalActions>
        </Modal>
      </div>
    </AuthGate>
  );
}
