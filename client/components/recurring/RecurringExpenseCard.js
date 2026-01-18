'use client';

import { formatCurrency, formatDate } from '@/lib/format';

export default function RecurringExpenseCard({ recurringExpense, onDelete }) {
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
    <div className="card" style={{ padding: '16px', transition: 'transform 0.2s, box-shadow 0.2s' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
        <div>
          <h3 style={{ margin: '0 0 4px 0' }}>{recurringExpense.category}</h3>
          <p className="subtle" style={{ margin: 0, fontSize: '14px' }}>
            {getFrequencyLabel(
              recurringExpense.frequency,
              recurringExpense.dayOfWeek,
              recurringExpense.dayOfMonth,
              recurringExpense.monthOfYear
            )}
          </p>
        </div>
        <div style={{ fontSize: '20px', fontWeight: '700', color: '#ff7a00' }}>
          {formatCurrency(recurringExpense.amount)}
        </div>
      </div>

      {recurringExpense.note && (
        <p className="subtle" style={{ margin: '0 0 12px 0', fontSize: '14px' }}>
          {recurringExpense.note}
        </p>
      )}

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '12px', paddingTop: '12px', borderTop: '1px solid #e5dccf' }}>
        <div>
          <p className="subtle" style={{ margin: 0, fontSize: '12px' }}>Next: {formatDate(recurringExpense.nextDate)}</p>
          {recurringExpense.endDate && (
            <p className="subtle" style={{ margin: '4px 0 0 0', fontSize: '12px' }}>
              Ends: {formatDate(recurringExpense.endDate)}
            </p>
          )}
        </div>
        <button
          type="button"
          className="button ghost"
          onClick={handleDelete}
          aria-label={`Delete ${recurringExpense.category}`}
          style={{ padding: '8px' }}
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
  );
}
