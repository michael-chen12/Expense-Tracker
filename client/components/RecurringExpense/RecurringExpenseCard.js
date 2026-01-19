'use client';

import { formatCurrency, formatDate } from '@/lib/format';
import './RecurringExpense.css';

export default function RecurringExpenseCard({ recurringExpense, onDelete, onEdit }) {
  const getFrequencyLabel = (freq, dayOfWeek, dayOfMonth, monthOfYear) => {
    const daysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const months = ['', 'January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

    switch (freq) {
      case 'daily':
        return 'Daily';
      case 'weekly':
        return `Weekly on ${daysOfWeek[dayOfWeek]}`;
      case 'monthly':
        return `Monthly on day ${dayOfMonth}`;
      case 'yearly':
        return `Yearly on ${months[monthOfYear]} ${dayOfMonth}`;
      default:
        return freq;
    }
  };

  const handleDelete = () => {
    const confirmed = window.confirm(`Delete recurring expense: ${recurringExpense.category}?`);
    if (confirmed) {
      onDelete(recurringExpense.id);
    }
  };

  return (
    <div className="recurring-expense-card">
      <div className="recurring-expense-card__header">
        <div>
          <h3 className="recurring-expense-card__title">{recurringExpense.category}</h3>
          <p className="subtle recurring-expense-card__frequency">
            {getFrequencyLabel(
              recurringExpense.frequency,
              recurringExpense.dayOfWeek,
              recurringExpense.dayOfMonth,
              recurringExpense.monthOfYear
            )}
          </p>
        </div>
        <div className="recurring-expense-card__amount">
          {formatCurrency(recurringExpense.amount)}
        </div>
      </div>

      {recurringExpense.note && (
        <p className="subtle recurring-expense-card__note">
          {recurringExpense.note}
        </p>
      )}

      <div className="recurring-expense-card__footer">
        <div>
          <p className="subtle recurring-expense-card__date">Next: {formatDate(recurringExpense.nextDate)}</p>
          {recurringExpense.endDate && (
            <p className="subtle recurring-expense-card__date recurring-expense-card__date--end">
              Ends: {formatDate(recurringExpense.endDate)}
            </p>
          )}
        </div>
        <div className="recurring-expense-card__actions">
          <button
            type="button"
            className="button ghost button--icon"
            onClick={() => onEdit(recurringExpense)}
            aria-label={`Edit ${recurringExpense.category}`}
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
          </button>
          <button
            type="button"
            className="button ghost button--icon"
            onClick={handleDelete}
            aria-label={`Delete ${recurringExpense.category}`}
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
    </div>
  );
}
