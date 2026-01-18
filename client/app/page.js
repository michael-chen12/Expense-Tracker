'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import AuthGate from '@/components/AuthGate';
import LandingPage from '@/components/LandingPage';
import LoadingScreen from '@/components/LoadingScreen';
import Spinner from '@/components/Spinner';
import {
  getExpenses,
  createFixedCost,
  deleteFixedCost,
  getAllowanceSettings,
  getAllowanceStatus,
  getFixedCosts,
  setAllowanceSettings
} from '@/lib/api-backend';
import { formatCurrency, formatDate } from '@/lib/format';

function getMonthRange() {
  const today = new Date();
  const from = new Date(today.getFullYear(), today.getMonth(), 1);
  const to = new Date(today.getFullYear(), today.getMonth() + 1, 0);

  return {
    from: from.toISOString().slice(0, 10),
    to: to.toISOString().slice(0, 10),
    label: today.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })
  };
}

function Dashboard() {
  const { data: session } = useSession();
  const userId = session?.user?.id || session?.userId;
  const [recent, setRecent] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [allowance, setAllowance] = useState({ amount: '', cadence: 'month' });
  const [allowanceStatus, setAllowanceStatus] = useState(null);
  const [allowanceError, setAllowanceError] = useState('');
  const [savingAllowance, setSavingAllowance] = useState(false);
  const [fixedCosts, setFixedCosts] = useState([]);
  const [fixedCostForm, setFixedCostForm] = useState({ name: '', amount: '' });
  const [fixedCostError, setFixedCostError] = useState('');
  const [savingFixedCost, setSavingFixedCost] = useState(false);

  useEffect(() => {
    getExpenses({ pageSize: 5 })
      .then((expenseData) => {
        setRecent(expenseData.items || []);
        setError('');
      })
      .catch((fetchError) => {
        setError(fetchError.message || 'Unable to load dashboard.');
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    if (!userId) return;

    // Load allowance settings from backend
    getAllowanceSettings()
      .then((settings) => {
        setAllowance({
          amount: String(settings.amount),
          cadence: settings.cadence
        });
      })
      .catch((fetchError) => {
        setAllowanceError(fetchError.message || 'Unable to load allowance settings.');
      });

    getAllowanceStatus()
      .then((status) => {
        setAllowanceStatus(status);
      })
      .catch((fetchError) => {
        setAllowanceError(fetchError.message || 'Unable to load allowance.');
      });
  }, [userId]);

  useEffect(() => {
    if (!userId) return;

    getFixedCosts()
      .then((items) => {
        setFixedCosts(items);
        setFixedCostError('');
      })
      .catch((fetchError) => {
        setFixedCostError(fetchError.message || 'Unable to load fixed costs.');
      });
  }, [userId]);

  const handleAllowanceChange = (event) => {
    const { name, value } = event.target;
    setAllowance((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  const handleAllowanceSubmit = async (event) => {
    event.preventDefault();
    setAllowanceError('');
    setSavingAllowance(true);

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
    } catch (submitError) {
      setAllowanceError(submitError.message || 'Unable to save allowance.');
    } finally {
      setSavingAllowance(false);
    }
  };

  const handleFixedCostChange = (event) => {
    const { name, value } = event.target;
    setFixedCostForm((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  const handleFixedCostSubmit = async (event) => {
    event.preventDefault();
    setFixedCostError('');
    setSavingFixedCost(true);

    try {
      await createFixedCost({
        name: fixedCostForm.name,
        amount: Number(fixedCostForm.amount)
      });
      const items = await getFixedCosts();
      setFixedCosts(items);
      setFixedCostForm({ name: '', amount: '' });
    } catch (submitError) {
      setFixedCostError(submitError.message || 'Unable to save fixed cost.');
    } finally {
      setSavingFixedCost(false);
    }
  };

  const handleFixedCostDelete = async (itemId) => {
    const confirmed = window.confirm('Delete this fixed cost?');
    if (!confirmed) {
      return;
    }

    try {
      await deleteFixedCost(itemId);
      const items = await getFixedCosts();
      setFixedCosts(items);
    } catch (deleteError) {
      setFixedCostError(deleteError.message || 'Unable to delete fixed cost.');
    }
  };

  const month = getMonthRange().label;
  return (
    <div>
      <div className="page-header">
        <div>
          <h1>Dashboard</h1>
          <p className="subtle">{month} snapshot of your spending.</p>
        </div>
      <Link className="button primary" href="/expenses/new">Add expense</Link>
    </div>

    {error ? <div className="error">{error}</div> : null}

    <section className="card" style={{ marginTop: '24px' }}>
      <div className="card-header">
        <h2>Recent expenses</h2>
        <Link className="button ghost" href="/expenses">View all</Link>
      </div>

      {loading ? (
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '20px' }}>
          <Spinner size="medium" color="primary" />
          <p className="subtle" style={{ margin: 0 }}>Loading recent expenses...</p>
        </div>
      ) : (
        <div className="expense-list">
          {recent.map((expense) => (
            <div key={expense.id} className="expense-row">
              <div>
                <h3>{expense.category}</h3>
                <p>{expense.note || 'No note'} • {formatDate(expense.date)}</p>
              </div>
              <div className="expense-amount">{formatCurrency(expense.amount)}</div>
              <div className="inline-actions">
                <Link className="button ghost" href={`/expenses/${expense.id}`}>Edit</Link>
              </div>
            </div>
          ))}
          {!recent.length && !error ? <p className="subtle">No expenses yet. Add your first entry.</p> : null}
        </div>
      )}
    </section>

    <section className="card" style={{ marginTop: '24px' }}>
      <div className="card-header">
        <h2>Allowance top-up</h2>
        <span className="badge">{allowanceStatus?.label || 'Period'}</span>
      </div>

      <div className="grid two fixed-costs-grid">
        <div>
          <h3>{formatCurrency(allowanceStatus?.remaining || 0)}</h3>
          <p className="subtle">Remaining for the current period.</p>
          <p className="subtle">Spent: {formatCurrency(allowanceStatus?.totalSpent || 0)}</p>
          <p className="subtle">Next top-up: {allowanceStatus?.nextTopUp || '—'}</p>
        </div>

        <form onSubmit={handleAllowanceSubmit}>
          <div>
            <label htmlFor="allowanceAmount">Allowance amount</label>
            <input
              id="allowanceAmount"
              name="amount"
              type="number"
              min="0"
              step="0.01"
              value={allowance.amount}
              onChange={handleAllowanceChange}
              placeholder="0.00"
              required
            />
          </div>
          <div>
            <label htmlFor="allowanceCadence">Top-up cadence</label>
            <select
              id="allowanceCadence"
              name="cadence"
              value={allowance.cadence}
              onChange={handleAllowanceChange}
            >
              <option value="day">Daily</option>
              <option value="week">Weekly</option>
              <option value="month">Monthly</option>
            </select>
          </div>

          {allowanceError ? <div className="error">{allowanceError}</div> : null}

          <div className="inline-actions">
            <button className="button primary" type="submit" disabled={savingAllowance}>
              {savingAllowance ? (
                <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Spinner size="small" color="white" />
                  Saving...
                </span>
              ) : 'Save allowance'}
            </button>
          </div>
        </form>
      </div>
    </section>

    <section className="card" style={{ marginTop: '24px' }}>
      <div className="card-header">
        <h2>Monthly fixed costs</h2>
        <span className="badge">
          {formatCurrency(fixedCosts.reduce((sum, item) => sum + item.amount, 0))} / month
        </span>
      </div>

      <div className="grid two">
        <form className="fixed-costs-form" onSubmit={handleFixedCostSubmit}>
          <div>
            <label htmlFor="fixedCostName">Name</label>
            <input
              id="fixedCostName"
              name="name"
              type="text"
              value={fixedCostForm.name}
              onChange={handleFixedCostChange}
              placeholder="Rent, Spotify, Wi-Fi"
              required
            />
          </div>
          <div>
            <label htmlFor="fixedCostAmount">Monthly amount</label>
            <input
              id="fixedCostAmount"
              name="amount"
              type="number"
              min="0"
              step="0.01"
              value={fixedCostForm.amount}
              onChange={handleFixedCostChange}
              placeholder="0.00"
              required
            />
          </div>

          {fixedCostError ? <div className="error">{fixedCostError}</div> : null}

          <div className="inline-actions">
            <button className="button primary fixed-costs-button" type="submit" disabled={savingFixedCost}>
              {savingFixedCost ? (
                <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Spinner size="small" color="white" />
                  Saving...
                </span>
              ) : 'Add fixed cost'}
            </button>
          </div>
        </form>

        <div className="expense-list scroll-list">
          {fixedCosts.length ? (
            fixedCosts.map((item) => (
              <div key={item.id} className="expense-row">
                <div>
                  <h3>{item.name}</h3>
                  <p className="subtle">Monthly</p>
                </div>
                <div className="expense-amount">{formatCurrency(item.amount)}</div>
                <div className="inline-actions">
                  <button
                    className="button ghost"
                    type="button"
                    aria-label={`Delete ${item.name}`}
                    onClick={() => handleFixedCostDelete(item.id)}
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
            ))
          ) : (
            <p className="subtle">No fixed costs yet. Add recurring bills here.</p>
          )}
        </div>
      </div>
    </section>
  </div>
  );
}

export default function Home() {
  const { data: session, status } = useSession();

  // Show loading state
  if (status === 'loading') {
    return <LoadingScreen message="Loading your dashboard..." />;
  }

  // Show landing page if not authenticated
  if (!session) {
    return <LandingPage />;
  }

  // Show dashboard if authenticated
  return (
    <AuthGate>
      <Dashboard />
    </AuthGate>
  );
}
