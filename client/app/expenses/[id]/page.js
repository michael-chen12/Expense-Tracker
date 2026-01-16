'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import ExpenseForm from '@/components/ExpenseForm';
import { deleteExpense, getExpense, updateExpense } from '@/lib/api';

export default function EditExpensePage() {
  const params = useParams();
  const router = useRouter();
  const [expense, setExpense] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!params.id) {
      return;
    }

    setLoading(true);
    getExpense(params.id)
      .then((data) => {
        setExpense(data.item);
        setError('');
      })
      .catch((fetchError) => {
        setError(fetchError.message || 'Unable to load expense.');
      })
      .finally(() => {
        setLoading(false);
      });
  }, [params.id]);

  const handleSubmit = async (payload) => {
    await updateExpense(params.id, payload);
    router.push('/expenses');
  };

  const handleDelete = async () => {
    await deleteExpense(params.id);
    router.push('/expenses');
  };

  return (
    <div>
      <div className="page-header">
        <div>
          <h1>Edit expense</h1>
          <p className="subtle">Update or remove this entry.</p>
        </div>
      </div>

      {error ? <div className="error">{error}</div> : null}
      {loading ? (
        <p className="subtle">Loading expense...</p>
      ) : expense ? (
        <ExpenseForm
          initialValues={expense}
          submitLabel="Save changes"
          onSubmit={handleSubmit}
          onDelete={handleDelete}
        />
      ) : (
        <p className="subtle">Expense not found.</p>
      )}
    </div>
  );
}
