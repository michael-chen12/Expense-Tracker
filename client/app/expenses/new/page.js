'use client';

import { useRouter } from 'next/navigation';
import AuthGate from '@/components/AuthGate';
import ExpenseForm from '@/components/ExpenseForm';
import { createExpense } from '@/lib/api-backend';

export default function NewExpensePage() {
  const router = useRouter();
  const today = new Date().toISOString().slice(0, 10);

  const handleSubmit = async (payload) => {
    await createExpense(payload);
    router.push('/expenses');
  };

  return (
    <AuthGate redirectTo="/login">
      <div>
        <div className="page-header">
          <div>
            <h1>New expense</h1>
            <p className="subtle">Log a fresh expense in seconds.</p>
          </div>
        </div>
        <ExpenseForm initialValues={{ date: today }} submitLabel="Add expense" onSubmit={handleSubmit} />
      </div>
    </AuthGate>
  );
}
