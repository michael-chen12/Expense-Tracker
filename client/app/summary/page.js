'use client';

import { useEffect, useState } from 'react';
import AuthGate from '@/components/AuthGate';
import { getExpenses } from '@/lib/api-backend';
import { formatCurrency, formatDate } from '@/lib/format';

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
  const [months, setMonths] = useState([]);
  const [groupedExpenses, setGroupedExpenses] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [expandedKey, setExpandedKey] = useState('');

  useEffect(() => {
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
  }, []);

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
          <p className="subtle">Loading summary...</p>
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
                  </button>

                  {isExpanded ? (
                    <div className="expense-list" style={{ marginTop: '12px' }}>
                      {monthExpenses.map((expense) => (
                        <div key={expense.id} className="expense-row">
                          <div>
                            <h3>{expense.category}</h3>
                            <p>{expense.note || 'No note'} • {formatDate(expense.date)}</p>
                          </div>
                          <div className="expense-amount">{formatCurrency(expense.amount)}</div>
                        </div>
                      ))}
                      {!monthExpenses.length ? (
                        <p className="subtle">No expenses recorded this month.</p>
                      ) : null}
                    </div>
                  ) : null}
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
