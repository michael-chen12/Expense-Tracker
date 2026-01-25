'use client';

import { useEffect, useState, useRef } from 'react';
import Link from 'next/link';
import AuthGate from '@/components/AuthGate';
import LoadingScreen from '@/components/LoadingScreen';
import { LoadingButton } from '@/components/LoadingButton';
import { Button } from '@/components/Button';
import { RecurringExpenseForm, RecurringExpenseList } from '@/components/RecurringExpense';
import {
  getRecurringExpenses,
  createRecurringExpense,
  updateRecurringExpense,
  deleteRecurringExpense,
  processRecurringExpenses
} from '@/lib/api-backend';
import { useSession } from 'next-auth/react';
import { useNotifications } from '@/lib/hooks/useNotifications';

function RecurringExpensesPage() {
  const { data: session } = useSession();
  const [recurringExpenses, setRecurringExpenses] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingExpense, setEditingExpense] = useState(null);
  const [processing, setProcessing] = useState(false);
  const formRef = useRef(null);
  
  // Use centralized notification hook
  const { error, success, showError, showSuccess } = useNotifications({ duration: 3000 });

  const loadRecurringExpenses = async () => {
    try {
      setIsLoading(true);
      const expenses = await getRecurringExpenses();
      setRecurringExpenses(expenses);
    } catch (err) {
      showError(err.message || 'Failed to load recurring expenses');
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
        showSuccess('Recurring expense updated successfully!');
      } else {
        await createRecurringExpense(payload);
        showSuccess('Recurring expense created successfully!');
      }
      setShowForm(false);
      setEditingExpense(null);
      await loadRecurringExpenses();
    } catch (err) {
      throw new Error(err.message || `Failed to ${editingExpense ? 'update' : 'create'} recurring expense`);
    }
  };

  const handleEdit = (expense) => {
    setEditingExpense(expense);
    setShowForm(true);
    // Scroll to form after state updates
    setTimeout(() => {
      formRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 100);
  };

  const handleDelete = async (id) => {
    try {
      await deleteRecurringExpense(id);
      showSuccess('Recurring expense deleted successfully!');
      await loadRecurringExpenses();
    } catch (err) {
      showError(err.message || 'Failed to delete recurring expense');
    }
  };

  const handleProcess = async () => {
    try {
      setProcessing(true);
      const result = await processRecurringExpenses();
      showSuccess(`Processed! Created ${result.processed.created} expenses, updated ${result.processed.updated} templates.`);
      await loadRecurringExpenses();
    } catch (err) {
      showError(err.message || 'Failed to process recurring expenses');
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
          <LoadingButton
            variant="ghost"
            onClick={handleProcess}
            loading={processing}
            loadingText="Processing..."
            spinnerColor="primary"
          >
            Process Now
          </LoadingButton>
          <Button
            className="button primary"
            onClick={() => {
              setShowForm(!showForm);
              if (showForm) {
                setEditingExpense(null);
              }
            }}
          >
            {showForm ? 'Cancel' : 'Add Recurring'}
          </Button>
        </div>
      </div>

      {success && (
        <div className="success-message">
          {success}
        </div>
      )}

      {error && (
        <div className="error error-margin">
          {error}
        </div>
      )}

      <div className="card info-card">
        <h3 className="info-card-title">How it works</h3>
        <ul className="info-card-list">
          <li>Create recurring expenses for bills, subscriptions, and regular payments</li>
          <li>Choose the frequency: daily, weekly, monthly, or yearly</li>
          <li>Click "Process Now" to generate expenses from your recurring templates</li>
          <li>Generated expenses will appear in your dashboard and affect your budget</li>
        </ul>
      </div>

      {showForm && (
        <div ref={formRef}>
          <RecurringExpenseForm
            onSubmit={handleSubmit}
            onCancel={() => {
              setShowForm(false);
              setEditingExpense(null);
            }}
            editingExpense={editingExpense}
          />
        </div>
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
      <div className="card card-centered">
        <h2>Please sign in to manage recurring expenses</h2>
        <Button className="button primary margin-top-16" href="/">
          Go to Home
        </Button>
      </div>
    );
  }

  return (
    <AuthGate>
      <RecurringExpensesPage />
    </AuthGate>
  );
}
