'use client';

import { formatCurrency } from '@/lib/chart-utils';

/**
 * Budget Progress Bar - Visual indicator of allowance usage
 * Color-coded based on percentage: green (<70%), orange (70-89%), red (≥90%)
 */
export default function BudgetProgressBar({ spent, allowance }) {
  // Calculate percentage
  const percentage = allowance > 0 ? Math.min((spent / allowance) * 100, 100) : 0;
  const remaining = Math.max(allowance - spent, 0);

  // Determine color class based on percentage
  let colorClass = 'green';
  if (percentage >= 90) {
    colorClass = 'red';
  } else if (percentage >= 70) {
    colorClass = 'orange';
  }

  return (
    <div className="budget-progress-container">
      <div
        className="budget-progress-bar"
        role="progressbar"
        aria-valuenow={percentage}
        aria-valuemin="0"
        aria-valuemax="100"
        aria-label="Budget usage progress"
      >
        <div className="budget-progress-header">
          <span>
            Spent: <strong>{formatCurrency(spent)}</strong>
          </span>
          <span>
            Remaining: <strong>{formatCurrency(remaining)}</strong>
          </span>
        </div>
        <div className="budget-progress-track">
          <div
            className={`budget-progress-fill ${colorClass}`}
            style={{ width: `${percentage}%` }}
          />
        </div>
      </div>
    </div>
  );
}
