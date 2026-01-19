'use client';

import RecurringExpenseCard from './RecurringExpenseCard';
import Spinner from '@/components/Spinner';
import './RecurringExpense.css';

export default function RecurringExpenseList({ recurringExpenses, isLoading, onDelete, onEdit }) {
  if (isLoading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', padding: '40px' }}>
        <Spinner size="large" color="primary" />
      </div>
    );
  }

  if (!recurringExpenses || recurringExpenses.length === 0) {
    return (
      <div className="card" style={{ padding: '40px', textAlign: 'center' }}>
        <p className="subtle">No recurring expenses yet. Create one to get started!</p>
      </div>
    );
  }

  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '16px' }}>
      {recurringExpenses.map(expense => (
        <RecurringExpenseCard
          key={expense.id}
          recurringExpense={expense}
          onDelete={onDelete}
          onEdit={onEdit}
        />
      ))}
    </div>
  );
}
