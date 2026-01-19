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

function groupByDate(expenses) {
  return expenses.reduce((acc, expense) => {
    if (!acc[expense.date]) {
      acc[expense.date] = [];
    }
    acc[expense.date].push(expense);
    return acc;
  }, {});
}

export default function ExpensesPage() {
  const router = useRouter();
  const { hasExpenses, isLoading: checkingExpenses } = useHasExpenses();
  const today = new Date().toISOString().slice(0, 10);
  const [filters, setFilters] = useState({
    from: '',
    to: '',
    category: ''
  });
  const [expenses, setExpenses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [confirmExpense, setConfirmExpense] = useState(null);
  const [deleting, setDeleting] = useState(false);

  // Redirect to dashboard if user has no expenses
  useEffect(() => {
    if (!checkingExpenses && hasExpenses === false) {
      router.replace('/');
    }
  }, [hasExpenses, checkingExpenses, router]);

  const loadExpenses = async () => {
    setLoading(true);
    setError('');

    try {
      const data = await getExpenses({
        ...filters,
        pageSize: 50
      });
      setExpenses(data.items || []);
    } catch (fetchError) {
      setError(fetchError.message || 'Unable to load expenses.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadExpenses();
  }, []);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFilters((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  const requestDelete = (expense) => {
    setConfirmExpense(expense);
  };

  const handleConfirmDelete = async () => {
    if (!confirmExpense) return;

    setDeleting(true);

    try {
      await deleteExpense(confirmExpense.id);
      const updatedExpenses = expenses.filter((expense) => expense.id !== confirmExpense.id);
      setExpenses(updatedExpenses);

      // If no expenses remain after deletion, redirect to dashboard
      if (updatedExpenses.length === 0) {
        router.replace('/');
      }
    } catch (deleteError) {
      setError(deleteError.message || 'Unable to delete expense.');
    } finally {
      setDeleting(false);
      setConfirmExpense(null);
    }
  };

  const groupedExpenses = groupByDate(expenses);
  const dates = Object.keys(groupedExpenses).sort((a, b) => (a > b ? -1 : 1));

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
          <h1>Expenses</h1>
          <p className="subtle">Filter, scan, and jump into edits.</p>
        </div>
        <Button variant="primary" href="/expenses/new">New expense</Button>
      </div>

      <section className="card card-form">
        <div className="card-header">
          <h2>Filters</h2>
          <button className="button ghost" type="button" onClick={loadExpenses}>
            Apply filters
          </button>
        </div>
        <div className="filter-grid">
          <div>
            <label htmlFor="from">From</label>
            <input id="from" name="from" type="date" value={filters.from} onChange={handleChange} max={today} />
          </div>
          <div>
            <label htmlFor="to">To</label>
            <input
              id="to"
              name="to"
              type="date"
              value={filters.to}
              onChange={handleChange}
              max={today}
              min={filters.from || undefined}
              disabled={!filters.from}
              title={filters.from ? '' : 'Select a From date first'}
            />
          </div>
          <div>
            <label htmlFor="category">Category</label>
            <select id="category" name="category" value={filters.category} onChange={handleChange}>
              <option value="">All categories</option>
              <option value="Transportation">Transportation</option>
              <option value="Food">Food</option>
              <option value="Clothing">Clothing</option>
              <option value="Housing">Housing</option>
              <option value="Utilities">Utilities</option>
              <option value="Subscriptions">Subscriptions</option>
              <option value="Health">Health</option>
              <option value="Entertainment">Entertainment</option>
              <option value="Education">Education</option>
              <option value="Travel">Travel</option>
              <option value="Other">Other</option>
            </select>
          </div>
        </div>
      </section>

      {error ? <div className="error">{error}</div> : null}

      {loading ? (
        <div className="loading-state">
          <Spinner size="medium" color="primary" />
          <p className="subtle no-margin">Loading expenses...</p>
        </div>
      ) : dates.length ? (
        <div className="grid">
          {dates.map((dateKey) => {
            const dailyTotal = groupedExpenses[dateKey].reduce((sum, expense) => sum + expense.amount, 0);
            return (
              <section key={dateKey} className="card">
                <div className="card-header">
                  <div>
                    <h2>{formatDate(dateKey)}</h2>
                    <p className="subtle no-margin">Total: {formatCurrency(dailyTotal)}</p>
                  </div>
                  <span className="badge">{groupedExpenses[dateKey].length} entries</span>
                </div>
                <div className="expense-list">
                  {groupedExpenses[dateKey].map((expense) => (
                  <div key={expense.id} className="expense-row">
                    <div>
                      <h3>{expense.category}</h3>
                      <p>{expense.note || 'No note'}</p>
                    </div>
                    <div className="expense-amount">{formatCurrency(expense.amount)}</div>
                    <div className="inline-actions">
                      <Button variant="ghost" href={`/expenses/${expense.id}`}>Edit</Button>
                      <button
                        className="button ghost"
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
              </div>
            </section>
          );
          })}

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
              onClick={handleConfirmDelete}
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
      ) : (
        <p className="subtle">No expenses match those filters.</p>
      )}
    </div>
    </AuthGate>
  );
}
