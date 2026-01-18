'use client';

import Spinner from '@/components/Spinner';
import { formatCurrency } from '@/lib/format';

export default function AllowanceSection({
  allowance,
  allowanceStatus,
  allowanceError,
  savingAllowance,
  onChange,
  onSubmit
}) {
  return (
    <section className="card" style={{ marginTop: '24px' }}>
      <div className="card-header">
        <h2>Allowance top-up</h2>
        <span className="badge">{allowanceStatus?.label || 'Period'}</span>
      </div>

      <div className="grid two fixed-costs-grid">
        <div>
          <h3>{formatCurrency(allowanceStatus?.remaining || 0)}</h3>
          <p className="subtle">Remaining for the current period.</p>
          <p className="subtle">Spent: {formatCurrency(allowanceStatus?.totalSpent || 0)}</p>
          <p className="subtle">Next top-up: {allowanceStatus?.nextTopUp || '—'}</p>
        </div>

        <form onSubmit={onSubmit}>
          <div>
            <label htmlFor="allowanceAmount">Allowance amount</label>
            <input
              id="allowanceAmount"
              name="amount"
              type="number"
              min="0"
              step="0.01"
              value={allowance.amount}
              onChange={onChange}
              placeholder="0.00"
              required
            />
          </div>
          <div>
            <label htmlFor="allowanceCadence">Top-up cadence</label>
            <select
              id="allowanceCadence"
              name="cadence"
              value={allowance.cadence}
              onChange={onChange}
            >
              <option value="day">Daily</option>
              <option value="week">Weekly</option>
              <option value="month">Monthly</option>
            </select>
          </div>

          {allowanceError ? <div className="error">{allowanceError}</div> : null}

          <div className="inline-actions">
            <button className="button primary" type="submit" disabled={savingAllowance}>
              {savingAllowance ? (
                <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Spinner size="small" color="white" />
                  Saving...
                </span>
              ) : 'Save allowance'}
            </button>
          </div>
        </form>
      </div>
    </section>
  );
}
