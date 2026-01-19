'use client';

import { Form, FormGroup, FormLabel, FormInput, FormSelect, FormError, FormActions } from '@/components/Form';
import { Button } from '@/components/Button';
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
  console.log('[AllowanceSection] allowanceStatus:', allowanceStatus);
  console.log('[AllowanceSection] allowance:', allowance);
  
  return (
    <section className="card section-card allowance-section">
      <div className="card-header">
        <h2>Allowance top-up</h2>
        <span className="badge">{allowanceStatus?.label || 'Period'}</span>
      </div>

      <div className="grid two fixed-costs-grid">
        <div>
          <h3>{formatCurrency(allowanceStatus?.remaining ?? 0)}</h3>
          <p className="subtle">Remaining for the current period.</p>
          <p className="subtle">Spent: {formatCurrency(allowanceStatus?.totalSpent ?? 0)}</p>
          <p className="subtle">Next top-up: {allowanceStatus?.nextTopUp || '—'}</p>
        </div>

        <Form onSubmit={onSubmit}>
          <FormGroup>
            <FormLabel htmlFor="allowanceAmount" className="allowance-label">Allowance amount</FormLabel>
            <FormInput
              id="allowanceAmount"
              name="amount"
              type="number"
              min="0"
              step="0.01"
              value={allowance.amount}
              onChange={onChange}
              placeholder="0.00"
              required
              className="allowance-field"
            />
          </FormGroup>
          
          <FormGroup>
            <FormLabel htmlFor="allowanceCadence" className="allowance-label">Top-up cadence</FormLabel>
            <FormSelect
              id="allowanceCadence"
              name="cadence"
              value={allowance.cadence}
              onChange={onChange}
              className="allowance-field"
            >
              <option value="day">Daily</option>
              <option value="week">Weekly</option>
              <option value="month">Monthly</option>
            </FormSelect>
          </FormGroup>

          <FormError>{allowanceError}</FormError>

          <FormActions align="end">
            <Button variant="primary" type="submit" disabled={savingAllowance}>
              {savingAllowance ? (
                <span className="button-loading-content">
                  <Spinner size="small" color="white" />
                  Saving...
                </span>
              ) : 'Save allowance'}
            </Button>
          </FormActions>
        </Form>
      </div>
      <style jsx>{`
        :global(.allowance-section label),
        :global(.allowance-section .allowance-label) {
          color: var(--ink) !important;
        }

        :global(.allowance-section .allowance-field),
        :global(.allowance-section input),
        :global(.allowance-section select) {
          color: var(--ink) !important;
          background: var(--input-dark-bg) !important;
          border-color: var(--input-dark-border, var(--border)) !important;
          caret-color: var(--ink);
        }

        :global(.allowance-section .allowance-field::placeholder),
        :global(.allowance-section input::placeholder) {
          color: var(--muted) !important;
          opacity: 0.85;
        }

        :global(.allowance-section .allowance-field option),
        :global(.allowance-section select option) {
          color: var(--ink) !important;
          background: var(--card) !important;
        }
      `}</style>
    </section>
  );
}
