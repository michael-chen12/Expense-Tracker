'use client';

import { useEffect, useState } from 'react';

const EMPTY_FORM = {
  amount: '',
  category: '',
  date: '',
  note: ''
};

export default function ExpenseForm({
  initialValues = {},
  submitLabel = 'Save expense',
  onSubmit,
  onDelete
}) {
  const [form, setForm] = useState({ ...EMPTY_FORM, ...initialValues });
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    setForm({ ...EMPTY_FORM, ...initialValues });
  }, [initialValues]);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((prev) => ({
      ...prev,
      [name]: value
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

    if (!form.category.trim()) {
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
        category: form.category.trim(),
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
        <label htmlFor="category">Category</label>
        <input
          id="category"
          name="category"
          type="text"
          value={form.category}
          onChange={handleChange}
          placeholder="Groceries, Rent, Coffee"
          required
        />
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
