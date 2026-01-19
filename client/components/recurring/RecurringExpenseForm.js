'use client';

import { useState, useEffect } from 'react';
import FrequencySelector from './FrequencySelector';
import Spinner from '@/components/Spinner';

export default function RecurringExpenseForm({ onSubmit, onCancel, editingExpense = null }) {
  const [formData, setFormData] = useState({
    amount: '',
    category: '',
    note: '',
    frequency: '',
    dayOfWeek: null,
    dayOfMonth: null,
    monthOfYear: null,
    nextDate: new Date().toISOString().slice(0, 10),
    endDate: ''
  });

  // Populate form when editing
  useEffect(() => {
    if (editingExpense) {
      setFormData({
        amount: editingExpense.amount.toString(),
        category: editingExpense.category,
        note: editingExpense.note || '',
        frequency: editingExpense.frequency,
        dayOfWeek: editingExpense.dayOfWeek,
        dayOfMonth: editingExpense.dayOfMonth,
        monthOfYear: editingExpense.monthOfYear,
        nextDate: editingExpense.nextDate,
        endDate: editingExpense.endDate || ''
      });
    }
  }, [editingExpense]);
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const categories = [
    'Food',
    'Transportation',
    'Housing',
    'Utilities',
    'Entertainment',
    'Health',
    'Shopping',
    'Education',
    'Other'
  ];

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData(prev => ({
      ...prev,
      [name]: value === '' ? null : (name === 'dayOfWeek' || name === 'dayOfMonth' || name === 'monthOfYear' ? Number(value) : value)
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');
    setIsSubmitting(true);

    try {
      const payload = {
        amount: Number(formData.amount),
        category: formData.category,
        note: formData.note || undefined,
        frequency: formData.frequency,
        dayOfWeek: formData.dayOfWeek,
        dayOfMonth: formData.dayOfMonth,
        monthOfYear: formData.monthOfYear,
        nextDate: formData.nextDate,
        endDate: formData.endDate || null
      };

      await onSubmit(payload);

      // Reset form
      setFormData({
        amount: '',
        category: '',
        note: '',
        frequency: '',
        dayOfWeek: null,
        dayOfMonth: null,
        monthOfYear: null,
        nextDate: new Date().toISOString().slice(0, 10),
        endDate: ''
      });
    } catch (err) {
      setError(err.message || 'Failed to create recurring expense');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="card" style={{ marginBottom: '24px' }}>
      <h3>{editingExpense ? 'Edit Recurring Expense' : 'Create Recurring Expense'}</h3>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginTop: '16px' }}>
        <div>
          <label htmlFor="amount">Amount</label>
          <input
            id="amount"
            name="amount"
            type="number"
            min="0"
            step="0.01"
            value={formData.amount}
            onChange={handleChange}
            placeholder="0.00"
            required
          />
        </div>

        <div>
          <label htmlFor="category">Category</label>
          <select
            id="category"
            name="category"
            value={formData.category}
            onChange={handleChange}
            required
          >
            <option value="">Select category</option>
            {categories.map(cat => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
        </div>
      </div>

      <div style={{ marginTop: '16px' }}>
        <label htmlFor="note">Note (optional)</label>
        <input
          id="note"
          name="note"
          type="text"
          value={formData.note}
          onChange={handleChange}
          placeholder="e.g., Netflix subscription"
        />
      </div>

      <div style={{ marginTop: '16px' }}>
        <FrequencySelector
          frequency={formData.frequency}
          dayOfWeek={formData.dayOfWeek}
          dayOfMonth={formData.dayOfMonth}
          monthOfYear={formData.monthOfYear}
          onChange={handleChange}
        />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginTop: '16px' }}>
        <div>
          <label htmlFor="nextDate">Start Date</label>
          <input
            id="nextDate"
            name="nextDate"
            type="date"
            value={formData.nextDate}
            onChange={handleChange}
            required
          />
        </div>

        <div>
          <label htmlFor="endDate">End Date (optional)</label>
          <input
            id="endDate"
            name="endDate"
            type="date"
            value={formData.endDate}
            onChange={handleChange}
          />
        </div>
      </div>

      {error && <div className="error" style={{ marginTop: '16px' }}>{error}</div>}

      <div className="inline-actions" style={{ marginTop: '24px' }}>
        <button type="submit" className="button primary" disabled={isSubmitting}>
          {isSubmitting ? (
            <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Spinner size="small" color="white" />
              {editingExpense ? 'Updating...' : 'Creating...'}
            </span>
          ) : editingExpense ? 'Update Recurring Expense' : 'Create Recurring Expense'}
        </button>
        <button type="button" className="button ghost" onClick={onCancel} disabled={isSubmitting}>
          Cancel
        </button>
      </div>
    </form>
  );
}
