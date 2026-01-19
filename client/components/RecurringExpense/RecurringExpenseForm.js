'use client';

import { useState, useEffect } from 'react';
import { 
  Form, 
  FormGroup, 
  FormLabel, 
  FormInput, 
  FormSelect, 
  FormRow, 
  FormError, 
  FormActions,
  FormCard,
  FormSection
} from '@/components/Form';
import FrequencySelector from './FrequencySelector';
import Spinner from '@/components/Spinner';
import './RecurringExpense.css';

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
    <FormCard>
      <Form onSubmit={handleSubmit}>
        <h2>{editingExpense ? 'Edit Recurring Expense' : 'New Recurring Expense'}</h2>

        <FormRow>
          <FormGroup>
            <FormLabel htmlFor="amount">Amount</FormLabel>
            <FormInput
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
          </FormGroup>

          <FormGroup>
            <FormLabel htmlFor="category">Category</FormLabel>
            <FormSelect
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
            </FormSelect>
          </FormGroup>
        </FormRow>

        <FormGroup>
          <FormLabel htmlFor="note">Note (optional)</FormLabel>
          <FormInput
            id="note"
            name="note"
            type="text"
            value={formData.note}
            onChange={handleChange}
            placeholder="e.g., Netflix subscription"
          />
        </FormGroup>

        <FormSection>
          <FrequencySelector
            frequency={formData.frequency}
            dayOfWeek={formData.dayOfWeek}
            dayOfMonth={formData.dayOfMonth}
            monthOfYear={formData.monthOfYear}
            onChange={handleChange}
          />
        </FormSection>

        <FormRow>
          <FormGroup>
            <FormLabel htmlFor="nextDate">Start Date</FormLabel>
            <FormInput
              id="nextDate"
              name="nextDate"
              type="date"
              value={formData.nextDate}
              onChange={handleChange}
              required
            />
          </FormGroup>

          <FormGroup>
            <FormLabel htmlFor="endDate">End Date (optional)</FormLabel>
            <FormInput
              id="endDate"
              name="endDate"
              type="date"
              value={formData.endDate}
              onChange={handleChange}
            />
          </FormGroup>
        </FormRow>

        <FormError>{error}</FormError>

        <FormActions align="start">
          <button className="button primary" type="submit" disabled={isSubmitting}>
            {isSubmitting ? (
              <span className="button-loading-content">
                <Spinner size="small" color="white" />
                {editingExpense ? 'Updating...' : 'Creating...'}
              </span>
            ) : editingExpense ? 'Update Recurring Expense' : 'Create Recurring Expense'}
          </button>
          <button type="button" className="button ghost" onClick={onCancel} disabled={isSubmitting}>
            Cancel
          </button>
        </FormActions>
      </Form>
    </FormCard>
  );
}
