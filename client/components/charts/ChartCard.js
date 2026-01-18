/**
 * Reusable wrapper component for charts with consistent styling
 * Provides title, loading state, and empty state handling
 */
export default function ChartCard({ title, children, isEmpty = false, emptyState = null }) {
  return (
    <div className="chart-card" role="region" aria-label={title}>
      <div className="chart-card-header">
        <h2 className="chart-card-title">{title}</h2>
      </div>
      <div>
        {isEmpty && emptyState ? emptyState : children}
      </div>
    </div>
  );
}
