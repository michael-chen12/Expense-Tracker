'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { getExpenses } from '@/lib/api';
import { formatCurrency, formatDate } from '@/lib/format';

export default function ExpensesPage() {
  const [filters, setFilters] = useState({
    from: '',
    to: '',
    category: ''
  });
  const [expenses, setExpenses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const loadExpenses = async () => {
    setLoading(true);
    setError('');

    try {
      const data = await getExpenses({
        ...filters,
        pageSize: 50
      });
      setExpenses(data.items || []);
    } catch (fetchError) {
      setError(fetchError.message || 'Unable to load expenses.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadExpenses();
  }, []);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFilters((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  return (
    <div>
      <div className="page-header">
        <div>
          <h1>Expenses</h1>
          <p className="subtle">Filter, scan, and jump into edits.</p>
        </div>
        <Link className="button primary" href="/expenses/new">New expense</Link>
      </div>

      <section className="card" style={{ marginBottom: '20px' }}>
        <div className="card-header">
          <h2>Filters</h2>
          <button className="button ghost" type="button" onClick={loadExpenses}>
            Apply filters
          </button>
        </div>
        <div className="filter-grid">
          <div>
            <label htmlFor="from">From</label>
            <input id="from" name="from" type="date" value={filters.from} onChange={handleChange} />
          </div>
          <div>
            <label htmlFor="to">To</label>
            <input id="to" name="to" type="date" value={filters.to} onChange={handleChange} />
          </div>
          <div>
            <label htmlFor="category">Category</label>
            <input id="category" name="category" type="text" value={filters.category} onChange={handleChange} placeholder="Groceries" />
          </div>
        </div>
      </section>

      {error ? <div className="error">{error}</div> : null}

      {loading ? (
        <p className="subtle">Loading expenses...</p>
      ) : (
        <div className="expense-list">
          {expenses.map((expense) => (
            <div key={expense.id} className="expense-row">
              <div>
                <h3>{expense.category}</h3>
                <p>{expense.note || 'No note'} • {formatDate(expense.date)}</p>
              </div>
              <div className="expense-amount">{formatCurrency(expense.amount)}</div>
              <div className="inline-actions">
                <Link className="button ghost" href={`/expenses/${expense.id}`}>Edit</Link>
              </div>
            </div>
          ))}
          {!expenses.length && !error ? <p className="subtle">No expenses match those filters.</p> : null}
        </div>
      )}
    </div>
  );
}
