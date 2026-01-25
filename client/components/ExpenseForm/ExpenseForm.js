'use client';

import { useEffect, useState } from 'react';
import {
  Form,
  FormGroup,
  FormLabel,
  FormInput,
  FormSelect,
  FormTextarea,
  FormError,
  FormActions,
  FormCard
} from '@/components/Form';
import { Modal, ModalActions } from '@/components/Modal';
import Spinner from '@/components/Spinner';
import './ExpenseForm.css';

const EMPTY_FORM = {
  amount: '',
  category: '',
  date: '',
  note: ''
};

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

export default function ExpenseForm({
  initialValues = {},
  submitLabel = 'Save expense',
  onSubmit,
  onDelete
}) {
  const [form, setForm] = useState({ ...EMPTY_FORM, ...initialValues });
  const [categorySelect, setCategorySelect] = useState(DEFAULT_CATEGORIES[0]);
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  useEffect(() => {
    const initialCategory = String(initialValues.category || '').trim();
    const defaultCategory = DEFAULT_CATEGORIES[0] || '';

    let selectedCategory = defaultCategory;
    let categoryValue = defaultCategory;

    if (initialCategory) {
      const matched = DEFAULT_CATEGORIES.find(
        (item) => item.toUpperCase() === initialCategory.toUpperCase()
      );
      const resolvedCategory = matched || 'Other';
      selectedCategory = resolvedCategory;
      categoryValue = resolvedCategory;
    }

    setCategorySelect(selectedCategory);
    setForm({
      ...EMPTY_FORM,
      ...initialValues,
      category: categoryValue
    });
  }, [initialValues]);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  const handleCategorySelect = (event) => {
    const { value } = event.target;
    setCategorySelect(value);
    setForm((prev) => ({
      ...prev,
      category: value
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');

    const amountValue = Number(form.amount);
    if (!form.amount || Number.isNaN(amountValue) || amountValue < 0) {
      setError('Enter a valid amount.');
      return;
    }

    const trimmedCategory = form.category.trim();
    if (!trimmedCategory) {
      setError('Pick a category.');
      return;
    }

    if (!form.date) {
      setError('Select a date.');
      return;
    }

    setSaving(true);

    try {
      await onSubmit({
        amount: amountValue,
        category: trimmedCategory,
        date: form.date,
        note: form.note.trim()
      });
    } catch (submitError) {
      setError(submitError.message || 'Something went wrong.');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!onDelete) {
      return;
    }

    setSaving(true);

    try {
      await onDelete();
      setShowDeleteModal(false);
    } catch (deleteError) {
      setError(deleteError.message || 'Something went wrong.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <FormCard>
      <Form onSubmit={handleSubmit} aria-label="Expense form">
        <FormGroup>
          <FormLabel htmlFor="amount">Amount <span aria-label="required">*</span></FormLabel>
          <FormInput
            id="amount"
            name="amount"
            type="number"
            min="0"
            step="0.01"
            value={form.amount}
            onChange={handleChange}
            placeholder="0.00"
            required
            aria-required="true"
            aria-invalid={error && error.includes('amount') ? 'true' : 'false'}
            aria-describedby={error && error.includes('amount') ? 'form-error' : undefined}
          />
        </FormGroup>

        <FormGroup>
          <FormLabel htmlFor="categorySelect">Category <span aria-label="required">*</span></FormLabel>
          <FormSelect 
            id="categorySelect" 
            value={categorySelect} 
            onChange={handleCategorySelect}
            required
            aria-required="true"
            aria-invalid={error && error.includes('category') ? 'true' : 'false'}
            aria-describedby={error && error.includes('category') ? 'form-error' : undefined}
          >
            {DEFAULT_CATEGORIES.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </FormSelect>
        </FormGroup>

        <FormGroup>
          <FormLabel htmlFor="date">Date <span aria-label="required">*</span></FormLabel>
          <FormInput
            id="date"
            name="date"
            type="date"
            value={form.date}
            onChange={handleChange}
            required
            aria-required="true"
            aria-invalid={error && error.includes('date') ? 'true' : 'false'}
            aria-describedby={error && error.includes('date') ? 'form-error' : undefined}
          />
        </FormGroup>

        <FormGroup>
          <FormLabel htmlFor="note">Note <span className="label-optional">(optional)</span></FormLabel>
          <FormTextarea
            id="note"
            name="note"
            value={form.note}
            onChange={handleChange}
            placeholder="Optional details"
            aria-describedby="note-hint"
          />
          <span id="note-hint" className="form-hint">Add any additional details about this expense</span>
        </FormGroup>

        {error && <FormError id="form-error" role="alert" aria-live="polite">{error}</FormError>}

        <FormActions align="start">
          <button 
            className="button primary" 
            type="submit" 
            disabled={saving}
            aria-busy={saving ? 'true' : 'false'}
          >
            {saving ? (
              <span className="button-loading-content">
                <Spinner size="small" color="white" />
                Saving...
              </span>
            ) : submitLabel}
          </button>
          {onDelete && (
            <button
              className="button ghost"
              type="button"
              onClick={() => setShowDeleteModal(true)}
              disabled={saving}
              aria-label="Delete this expense"
            >
              {saving ? (
                <span className="button-loading-content">
                  <Spinner size="small" color="gray" />
                  Deleting...
                </span>
              ) : 'Delete'}
            </button>
          )}
        </FormActions>
      </Form>

      {onDelete && (
        <Modal
          open={showDeleteModal}
          onClose={() => setShowDeleteModal(false)}
          title="Delete expense"
          description="This action will permanently remove this expense entry."
        >
          <div className="modal-detail-card">
            <div className="modal-detail-header">
              <div>
                <p className="modal-detail-title">{form.category || 'Uncategorized'}</p>
                <p className="modal-detail-meta">Date: {form.date || '—'}</p>
              </div>
              <p className="modal-detail-amount">{form.amount ? `$${Number(form.amount).toFixed(2)}` : '$0.00'}</p>
            </div>
            <p className="modal-detail-note">{form.note ? form.note : 'No note provided.'}</p>
          </div>

          <p className="modal-message">Are you sure you want to delete this expense?</p>
          <ModalActions>
            <button
              type="button"
              className="button ghost"
              onClick={() => setShowDeleteModal(false)}
              disabled={saving}
            >
              Cancel
            </button>
            <button
              type="button"
              className="button primary"
              onClick={handleDelete}
              disabled={saving}
            >
              {saving ? (
                <span className="button-loading-content">
                  <Spinner size="small" color="white" />
                  Deleting...
                </span>
              ) : 'Delete expense'}
            </button>
          </ModalActions>
        </Modal>
      )}
    </FormCard>
  );
}
