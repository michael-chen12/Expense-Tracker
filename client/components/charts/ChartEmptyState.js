import { Button } from '@/components/Button';

/**
 * Empty state component shown when there's no data to display in charts
 */
export default function ChartEmptyState() {
  return (
    <div className="chart-empty-state" role="status" aria-live="polite">
      <svg
        width="80"
        height="80"
        viewBox="0 0 80 80"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
      >
        <circle cx="40" cy="40" r="38" stroke="#e5dccf" strokeWidth="4" />
        <path
          d="M25 50 L35 35 L45 42 L55 25"
          stroke="#ff7a00"
          strokeWidth="3"
          strokeLinecap="round"
          strokeLinejoin="round"
          opacity="0.3"
        />
        <circle cx="25" cy="50" r="3" fill="#ff7a00" opacity="0.3" />
        <circle cx="35" cy="35" r="3" fill="#ff7a00" opacity="0.3" />
        <circle cx="45" cy="42" r="3" fill="#ff7a00" opacity="0.3" />
        <circle cx="55" cy="25" r="3" fill="#ff7a00" opacity="0.3" />
      </svg>
      <h3>No expenses yet</h3>
      <p>Add your first expense to see insights and analytics!</p>
      <Button variant="primary" href="/expenses/new">
        Add Expense
      </Button>
    </div>
  );
}
