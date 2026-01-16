'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { getExpenses, getSummary } from '@/lib/api';
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

export default function Dashboard() {
  const [summary, setSummary] = useState(null);
  const [recent, setRecent] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const { from, to } = getMonthRange();

    Promise.all([getSummary({ from, to }), getExpenses({ pageSize: 5 })])
      .then(([summaryData, expenseData]) => {
        setSummary(summaryData);
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

  const month = getMonthRange().label;
  const topCategory = summary?.byCategory?.[0];

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

      <div className="grid two">
        <section className="card">
          <div className="card-header">
            <h2>This month</h2>
            <span className="badge">Live</span>
          </div>
          <h3>{formatCurrency(summary?.total || 0)}</h3>
          <p className="subtle">Total spend across all categories.</p>
          <div className="grid">
            {(summary?.byCategory || []).slice(0, 3).map((item) => (
              <div key={item.category} className="expense-row">
                <div>
                  <h3>{item.category}</h3>
                  <p>{formatCurrency(item.total)}</p>
                </div>
                <div className="badge">Top</div>
              </div>
            ))}
            {summary && summary.byCategory.length === 0 ? (
              <p className="subtle">No expenses tracked yet.</p>
            ) : null}
          </div>
        </section>

        <section className="card">
          <div className="card-header">
            <h2>Highlights</h2>
            <span className="badge">Insight</span>
          </div>
          <div>
            <p className="subtle">Most active category</p>
            <h3>{topCategory ? topCategory.category : 'No data yet'}</h3>
            <p className="subtle">
              {topCategory ? `${formatCurrency(topCategory.total)} total this month.` : 'Start logging expenses to see trends.'}
            </p>
          </div>
          <div className="card" style={{ background: 'var(--accent-soft)', border: 'none', boxShadow: 'none' }}>
            <h3>Quick actions</h3>
            <p className="subtle">Log a new expense or review the full list.</p>
            <div className="inline-actions">
              <Link className="button primary" href="/expenses/new">New expense</Link>
              <Link className="button ghost" href="/expenses">View all</Link>
            </div>
          </div>
        </section>
      </div>

      <section className="card" style={{ marginTop: '24px' }}>
        <div className="card-header">
          <h2>Recent expenses</h2>
          <Link className="button ghost" href="/expenses">View all</Link>
        </div>

        {loading ? (
          <p className="subtle">Loading recent expenses...</p>
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
    </div>
  );
}
