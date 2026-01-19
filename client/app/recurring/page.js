'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import AuthGate from '@/components/AuthGate';
import LoadingScreen from '@/components/LoadingScreen';
import Spinner from '@/components/Spinner';
import RecurringExpenseForm from '@/components/recurring/RecurringExpenseForm';
import RecurringExpenseList from '@/components/recurring/RecurringExpenseList';
import {
  getRecurringExpenses,
  createRecurringExpense,
  updateRecurringExpense,
  deleteRecurringExpense,
  processRecurringExpenses
} from '@/lib/api-backend';
import { useSession } from 'next-auth/react';

function RecurringExpensesPage() {
  const { data: session } = useSession();
  const [recurringExpenses, setRecurringExpenses] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editingExpense, setEditingExpense] = useState(null);
  const [processing, setProcessing] = useState(false);

  const loadRecurringExpenses = async () => {
    try {
      setIsLoading(true);
      const expenses = await getRecurringExpenses();
      setRecurringExpenses(expenses);
      setError('');
    } catch (err) {
      setError(err.message || 'Failed to load recurring expenses');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (session) {
      loadRecurringExpenses();
    }
  }, [session]);

  const handleSubmit = async (payload) => {
    try {
      if (editingExpense) {
        await updateRecurringExpense(editingExpense.id, payload);
        setSuccess('Recurring expense updated successfully!');
      } else {
        await createRecurringExpense(payload);
        setSuccess('Recurring expense created successfully!');
      }
      setShowForm(false);
      setEditingExpense(null);
      await loadRecurringExpenses();
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      throw new Error(err.message || `Failed to ${editingExpense ? 'update' : 'create'} recurring expense`);
    }
  };

  const handleEdit = (expense) => {
    setEditingExpense(expense);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    try {
      await deleteRecurringExpense(id);
      setSuccess('Recurring expense deleted successfully!');
      await loadRecurringExpenses();
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError(err.message || 'Failed to delete recurring expense');
      setTimeout(() => setError(''), 3000);
    }
  };

  const handleProcess = async () => {
    try {
      setProcessing(true);
      const result = await processRecurringExpenses();
      setSuccess(`Processed! Created ${result.processed.created} expenses, updated ${result.processed.updated} templates.`);
      await loadRecurringExpenses();
      setTimeout(() => setSuccess(''), 5000);
    } catch (err) {
      setError(err.message || 'Failed to process recurring expenses');
      setTimeout(() => setError(''), 3000);
    } finally {
      setProcessing(false);
    }
  };

  return (
    <div>
      <div className="page-header">
        <div>
          <h1>Recurring Expenses</h1>
          <p className="subtle">Manage your recurring bills and subscriptions</p>
        </div>
        <div className="inline-actions">
          <button
            type="button"
            className="button ghost"
            onClick={handleProcess}
            disabled={processing}
          >
            {processing ? (
              <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Spinner size="small" color="primary" />
                Processing...
              </span>
            ) : 'Process Now'}
          </button>
          <button
            type="button"
            className="button primary"
            onClick={() => {
              setShowForm(!showForm);
              if (showForm) {
                setEditingExpense(null);
              }
            }}
          >
            {showForm ? 'Cancel' : 'Add Recurring'}
          </button>
        </div>
      </div>

      {success && (
        <div style={{ background: '#d4edda', color: '#155724', padding: '12px 16px', borderRadius: '8px', marginBottom: '24px' }}>
          {success}
        </div>
      )}

      {error && (
        <div className="error" style={{ marginBottom: '24px' }}>
          {error}
        </div>
      )}

      <div className="card" style={{ marginBottom: '24px', background: '#f8f6f2' }}>
        <h3 style={{ marginTop: 0 }}>How it works</h3>
        <ul style={{ margin: 0, paddingLeft: '20px' }}>
          <li>Create recurring expenses for bills, subscriptions, and regular payments</li>
          <li>Choose the frequency: daily, weekly, monthly, or yearly</li>
          <li>Click "Process Now" to generate expenses from your recurring templates</li>
          <li>Generated expenses will appear in your dashboard and affect your budget</li>
        </ul>
      </div>

      {showForm && (
        <RecurringExpenseForm
          onSubmit={handleSubmit}
          onCancel={() => {
            setShowForm(false);
            setEditingExpense(null);
          }}
          editingExpense={editingExpense}
        />
      )}

      <RecurringExpenseList
        recurringExpenses={recurringExpenses}
        isLoading={isLoading}
        onDelete={handleDelete}
        onEdit={handleEdit}
      />
    </div>
  );
}

export default function RecurringExpensesPageWrapper() {
  const { data: session, status } = useSession();

  if (status === 'loading') {
    return <LoadingScreen message="" />;
  }

  if (!session) {
    return (
      <div className="card" style={{ textAlign: 'center', padding: '40px' }}>
        <h2>Please sign in to manage recurring expenses</h2>
        <Link href="/" className="button primary" style={{ marginTop: '16px' }}>
          Go to Home
        </Link>
      </div>
    );
  }

  return (
    <AuthGate>
      <RecurringExpensesPage />
    </AuthGate>
  );
}
