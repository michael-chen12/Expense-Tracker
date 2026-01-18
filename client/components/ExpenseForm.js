'use client';

import { useEffect, useState } from 'react';

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

    const confirmed = window.confirm('Delete this expense?');
    if (!confirmed) {
      return;
    }

    setSaving(true);

    try {
      await onDelete();
    } catch (deleteError) {
      setError(deleteError.message || 'Something went wrong.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <form className="card" onSubmit={handleSubmit}>
      <div>
        <label htmlFor="amount">Amount</label>
        <input
          id="amount"
          name="amount"
          type="number"
          min="0"
          step="0.01"
          value={form.amount}
          onChange={handleChange}
          placeholder="0.00"
          required
        />
      </div>

      <div>
        <label htmlFor="categorySelect">Category</label>
        <select id="categorySelect" value={categorySelect} onChange={handleCategorySelect}>
          {DEFAULT_CATEGORIES.map((category) => (
            <option key={category} value={category}>
              {category}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label htmlFor="date">Date</label>
        <input
          id="date"
          name="date"
          type="date"
          value={form.date}
          onChange={handleChange}
          required
        />
      </div>

      <div>
        <label htmlFor="note">Note</label>
        <textarea
          id="note"
          name="note"
          value={form.note}
          onChange={handleChange}
          placeholder="Optional details"
        />
      </div>

      {error ? <div className="error">{error}</div> : null}

      <div className="inline-actions">
        <button className="button primary" type="submit" disabled={saving}>
          {saving ? 'Saving...' : submitLabel}
        </button>
        {onDelete ? (
          <button className="button ghost" type="button" onClick={handleDelete} disabled={saving}>
            Delete
          </button>
        ) : null}
      </div>
    </form>
  );
}
