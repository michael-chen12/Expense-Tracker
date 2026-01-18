'use client';

import Spinner from '@/components/Spinner';
import { formatCurrency } from '@/lib/format';

export default function FixedCostsSection({
  fixedCosts,
  fixedCostForm,
  fixedCostError,
  savingFixedCost,
  onChange,
  onSubmit,
  onDelete
}) {
  const totalFixedCosts = fixedCosts.reduce((sum, item) => sum + item.amount, 0);

  return (
    <section className="card" style={{ marginTop: '24px' }}>
      <div className="card-header">
        <h2>Monthly fixed costs</h2>
        <span className="badge">
          {formatCurrency(totalFixedCosts)} / month
        </span>
      </div>

      <div className="grid two">
        <form className="fixed-costs-form" onSubmit={onSubmit}>
          <div>
            <label htmlFor="fixedCostName">Name</label>
            <input
              id="fixedCostName"
              name="name"
              type="text"
              value={fixedCostForm.name}
              onChange={onChange}
              placeholder="Rent, Spotify, Wi-Fi"
              required
            />
          </div>
          <div>
            <label htmlFor="fixedCostAmount">Monthly amount</label>
            <input
              id="fixedCostAmount"
              name="amount"
              type="number"
              min="0"
              step="0.01"
              value={fixedCostForm.amount}
              onChange={onChange}
              placeholder="0.00"
              required
            />
          </div>

          {fixedCostError ? <div className="error">{fixedCostError}</div> : null}

          <div className="inline-actions">
            <button className="button primary fixed-costs-button" type="submit" disabled={savingFixedCost}>
              {savingFixedCost ? (
                <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Spinner size="small" color="white" />
                  Saving...
                </span>
              ) : 'Add fixed cost'}
            </button>
          </div>
        </form>

        <div className="expense-list scroll-list">
          {fixedCosts.length ? (
            fixedCosts.map((item) => (
              <div key={item.id} className="expense-row">
                <div>
                  <h3>{item.name}</h3>
                  <p className="subtle">Monthly</p>
                </div>
                <div className="expense-amount">{formatCurrency(item.amount)}</div>
                <div className="inline-actions">
                  <button
                    className="button ghost"
                    type="button"
                    aria-label={`Delete ${item.name}`}
                    onClick={() => onDelete(item.id)}
                  >
                    <svg
                      aria-hidden="true"
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <polyline points="3 6 5 6 21 6" />
                      <path d="M8 6V4a1 1 0 0 1 1-1h6a1 1 0 0 1 1 1v2" />
                      <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" />
                      <line x1="10" y1="11" x2="10" y2="17" />
                      <line x1="14" y1="11" x2="14" y2="17" />
                    </svg>
                  </button>
                </div>
              </div>
            ))
          ) : (
            <p className="subtle">No fixed costs yet. Add recurring bills here.</p>
          )}
        </div>
      </div>
    </section>
  );
}
