'use client';

import { Button } from '@/components/Button';
import { formatCurrency, formatDate } from '@/lib/format';

export default function RecentExpenses({ expenses, onDelete, error }) {
  return (
    <section className="card section-card">
      <div className="card-header">
        <h2>Recent expenses</h2>
        <Button variant="ghost" href="/expenses">View all</Button>
      </div>

      <div className="expense-list">
        {expenses.map((expense) => (
          <div key={expense.id} className="expense-row">
            <div>
              <h3>{expense.category}</h3>
              <p>{expense.note || 'No note'} • {formatDate(expense.date)}</p>
            </div>
            <div className="expense-amount">{formatCurrency(expense.amount)}</div>
            <div className="inline-actions">
              <Button variant="ghost" href={`/expenses/${expense.id}`}>Edit</Button>
              <button
                className="button ghost"
                type="button"
                aria-label={`Delete ${expense.category} expense`}
                onClick={() => onDelete(expense.id)}
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
        {!expenses.length && !error ? <p className="subtle">No expenses yet. Add your first entry.</p> : null}
      </div>
    </section>
  );
}
