import './Card.css';

/**
 * Overview card component displaying a single metric
 * Used in the dashboard to show key statistics at a glance
 */
export default function OverviewCard({ label, value, isAccent = false }) {
  return (
    <div className="overview-card" role="region" aria-label={label}>
      <div className="overview-card-label">{label}</div>
      <div className={`overview-card-value ${isAccent ? 'accent' : ''}`}>
        {value}
      </div>
    </div>
  );
}
