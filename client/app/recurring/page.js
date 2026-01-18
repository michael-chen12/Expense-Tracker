'use client';

import { useState, useEffect } from 'react';
import {
  getRecurringExpenses,
  createRecurringExpense,
  updateRecurringExpense,
  deleteRecurringExpense,
  processRecurringExpenses
} from '@/lib/api-backend';
import { LayoutContent } from '@/components/LayoutContent';
import RecurringExpenseForm from '@/components/recurring/RecurringExpenseForm';
import RecurringExpenseList from '@/components/recurring/RecurringExpenseList';

const DEFAULT_CATEGORIES = [
  'Transportation',
  'Food',
  'Clothing',
  'Housing',
  'Utilities',
  'Subscriptions',
  'Health',
  'Entertainment',
  'Education',
  'Travel',
  'Other'
];

export default function RecurringPage() {
  const [recurring, setRecurring] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    loadRecurring();
  }, []);

  const loadRecurring = async () => {
    try {
      setIsLoading(true);
      const data = await getRecurringExpenses();
      setRecurring(data);
    } catch (err) {
      setError('Failed to load recurring expenses');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreate = async (payload) => {
    try {
      setIsSaving(true);
      setError('');
      const newItem = await createRecurringExpense(payload);
      setRecurring([...recurring, newItem]);
      setShowForm(false);
      setSuccess('Recurring expense created successfully!');
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError(err.message || 'Failed to create recurring expense');
      throw err;
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this recurring expense?')) {
      return;
    }

    try {
      await deleteRecurringExpense(id);
      setRecurring(recurring.filter(item => item.id !== id));
      setSuccess('Recurring expense deleted successfully!');
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError('Failed to delete recurring expense');
      console.error(err);
    }
  };

  const handleProcessNow = async () => {
    try {
      const result = await processRecurringExpenses();
      setSuccess(`Processed: ${result.processed.created} expenses created, ${result.processed.updated} templates updated`);
      setTimeout(() => setSuccess(''), 5000);
      await loadRecurring();
    } catch (err) {
      setError('Failed to process recurring expenses');
      console.error(err);
    }
  };

  return (
    <LayoutContent>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-900">Recurring Expenses</h1>
          <div className="flex gap-2">
            <button
              onClick={handleProcessNow}
              className="px-4 py-2 text-sm bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition"
            >
              Process Now
            </button>
            <button
              onClick={() => setShowForm(!showForm)}
              className="px-4 py-2 text-sm bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition"
            >
              {showForm ? 'Cancel' : 'Add Recurring'}
            </button>
          </div>
        </div>

        {error && (
          <div className="p-4 bg-red-50 border border-red-200 text-red-700 rounded-lg">
            {error}
          </div>
        )}

        {success && (
          <div className="p-4 bg-green-50 border border-green-200 text-green-700 rounded-lg">
            {success}
          </div>
        )}

        {showForm && (
          <div className="border border-gray-200 rounded-lg p-6 bg-gray-50">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">New Recurring Expense</h2>
            <RecurringExpenseForm
              onSubmit={handleCreate}
              isLoading={isSaving}
              categories={DEFAULT_CATEGORIES}
            />
          </div>
        )}

        <div className="space-y-4">
          <div>
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Your Recurring Expenses</h2>
            <RecurringExpenseList
              recurring={recurring}
              isLoading={isLoading}
              onDelete={handleDelete}
            />
          </div>
        </div>

        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-sm text-blue-700">
          <p className="font-medium mb-2">How it works:</p>
          <ul className="list-disc list-inside space-y-1 text-xs">
            <li>Recurring expenses are automatically created on their next date</li>
            <li>Click "Process Now" to manually trigger the auto-generation</li>
            <li>The system checks daily at midnight to create new expenses</li>
            <li>Expenses will stop being created after the end date, if set</li>
          </ul>
        </div>
      </div>
    </LayoutContent>
  );
}
