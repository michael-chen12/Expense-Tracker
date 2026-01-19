'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import AuthGate from '@/components/AuthGate';
import { ExpenseForm } from '@/components/ExpenseForm';
import { createExpense } from '@/lib/api-backend';

export default function NewExpensePage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const today = new Date().toISOString().slice(0, 10);

  // Check for pre-filled values from duplicate action
  const isDuplicate = searchParams.has('category') || searchParams.has('amount');
  const initialValues = {
    date: today,
    category: searchParams.get('category') || '',
    amount: searchParams.get('amount') || '',
    note: searchParams.get('note') || ''
  };

  const handleSubmit = async (payload) => {
    await createExpense(payload);
    router.push('/expenses');
  };

  return (
    <AuthGate redirectTo="/login">
      <div>
        <div className="page-header">
          <div>
            <h1>{isDuplicate ? 'Duplicate expense' : 'New expense'}</h1>
            <p className="subtle">
              {isDuplicate
                ? 'Review and save this duplicated expense.'
                : 'Log a fresh expense in seconds.'}
            </p>
          </div>
        </div>
        <ExpenseForm initialValues={initialValues} submitLabel="Add expense" onSubmit={handleSubmit} />
      </div>
    </AuthGate>
  );
}
