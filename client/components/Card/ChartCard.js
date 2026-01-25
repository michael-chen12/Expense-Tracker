import './Card.css';

/**
 * Reusable wrapper component for charts with consistent styling
 * Provides title, loading state, and empty state handling
 */
export default function ChartCard({ title, children, isEmpty = false, emptyState = null }) {
  return (
    <div className="chart-card" role="region" aria-labelledby={`chart-title-${title.replace(/\s+/g, '-').toLowerCase()}`}>
      <div className="chart-card-header">
        <h3 id={`chart-title-${title.replace(/\s+/g, '-').toLowerCase()}`} className="chart-card-title">{title}</h3>
      </div>
      <div>
        {isEmpty && emptyState ? emptyState : children}
      </div>
    </div>
  );
}
