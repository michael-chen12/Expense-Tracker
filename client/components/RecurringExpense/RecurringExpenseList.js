'use client';

import RecurringExpenseCard from './RecurringExpenseCard';
import Spinner from '@/components/Spinner';
import './RecurringExpense.css';

export default function RecurringExpenseList({ recurringExpenses, isLoading, onDelete, onEdit }) {
  if (isLoading) {
    return (
      <div className="loading-center">
        <Spinner size="large" color="primary" />
      </div>
    );
  }

  if (!recurringExpenses || recurringExpenses.length === 0) {
    return (
      <div className="card card-centered">
        <p className="subtle">No recurring expenses yet. Create one to get started!</p>
      </div>
    );
  }

  return (
    <div className="recurring-grid">
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
