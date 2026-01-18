'use client';

import { useState } from 'react';
import FrequencySelector from './FrequencySelector';

export default function RecurringExpenseForm({ onSubmit, isLoading, categories = [] }) {
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState('Food');
  const [note, setNote] = useState('');
  const [frequency, setFrequency] = useState('monthly');
  const [dayOfWeek, setDayOfWeek] = useState(0);
  const [dayOfMonth, setDayOfMonth] = useState(1);
  const [monthOfYear, setMonthOfYear] = useState(1);
  const [nextDate, setNextDate] = useState(new Date().toISOString().split('T')[0]);
  const [endDate, setEndDate] = useState('');
  const [error, setError] = useState('');

  const handleDetailsChange = (field, value) => {
    switch (field) {
      case 'dayOfWeek':
        setDayOfWeek(value);
        break;
      case 'dayOfMonth':
        setDayOfMonth(value);
        break;
      case 'monthOfYear':
        setMonthOfYear(value);
        break;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!amount || Number(amount) <= 0) {
      setError('Amount must be greater than 0');
      return;
    }

    if (!category) {
      setError('Category is required');
      return;
    }

    const payload = {
      amount: Number(amount),
      category,
      note: note.trim() || undefined,
      frequency,
      dayOfWeek: frequency === 'weekly' ? dayOfWeek : null,
      dayOfMonth: frequency === 'monthly' || frequency === 'yearly' ? dayOfMonth : null,
      monthOfYear: frequency === 'yearly' ? monthOfYear : null,
      nextDate,
      endDate: endDate.trim() ? endDate : null,
    };

    try {
      await onSubmit(payload);
      setAmount('');
      setCategory('Food');
      setNote('');
      setFrequency('monthly');
      setNextDate(new Date().toISOString().split('T')[0]);
      setEndDate('');
    } catch (err) {
      setError(err.message || 'Failed to create recurring expense');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && (
        <div className="p-3 bg-red-50 border border-red-200 text-red-700 rounded-lg text-sm">
          {error}
        </div>
      )}

      <div className="grid grid-cols-2 gap-3">
        <div>
          <label htmlFor="amount" className="block text-sm font-medium text-gray-700 mb-2">
            Amount
          </label>
          <input
            id="amount"
            type="number"
            step="0.01"
            min="0"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="0.00"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
          />
        </div>

        <div>
          <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-2">
            Category
          </label>
          <select
            id="category"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
          >
            {categories.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div>
        <label htmlFor="note" className="block text-sm font-medium text-gray-700 mb-2">
          Note (Optional)
        </label>
        <input
          id="note"
          type="text"
          value={note}
          onChange={(e) => setNote(e.target.value)}
          placeholder="e.g., Netflix subscription"
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
        />
      </div>

      <FrequencySelector
        frequency={frequency}
        onChange={setFrequency}
        dayOfWeek={dayOfWeek}
        dayOfMonth={dayOfMonth}
        monthOfYear={monthOfYear}
        onDetailsChange={handleDetailsChange}
      />

      <div className="grid grid-cols-2 gap-3">
        <div>
          <label htmlFor="nextDate" className="block text-sm font-medium text-gray-700 mb-2">
            Next Date
          </label>
          <input
            id="nextDate"
            type="date"
            value={nextDate}
            onChange={(e) => setNextDate(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
          />
        </div>

        <div>
          <label htmlFor="endDate" className="block text-sm font-medium text-gray-700 mb-2">
            End Date (Optional)
          </label>
          <input
            id="endDate"
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
          />
        </div>
      </div>

      <button
        type="submit"
        disabled={isLoading}
        className="w-full bg-orange-500 text-white py-2 rounded-lg font-medium hover:bg-orange-600 disabled:opacity-50 transition"
      >
        {isLoading ? 'Creating...' : 'Create Recurring Expense'}
      </button>
    </form>
  );
}
