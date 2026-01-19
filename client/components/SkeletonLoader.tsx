'use client';

interface SkeletonCardProps {
  height?: string;
}

export function SkeletonCard({ height = '120px' }: SkeletonCardProps) {
  return (
    <div
      className="card skeleton"
      style={{
        height,
        background: 'linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%)',
        backgroundSize: '200% 100%',
        animation: 'skeleton-loading 1.5s ease-in-out infinite',
        borderRadius: '12px'
      }}
      aria-busy="true"
      aria-label="Loading..."
    />
  );
}

interface SkeletonTextProps {
  width?: string;
  height?: string;
}

export function SkeletonText({ width = '100%', height = '16px' }: SkeletonTextProps) {
  return (
    <div
      style={{
        width,
        height,
        background: 'linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%)',
        backgroundSize: '200% 100%',
        animation: 'skeleton-loading 1.5s ease-in-out infinite',
        borderRadius: '4px'
      }}
      aria-busy="true"
      aria-label="Loading..."
    />
  );
}

export function SkeletonExpenseRow() {
  return (
    <div className="card" style={{ padding: '16px', marginBottom: '12px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ flex: 1 }}>
          <SkeletonText width="40%" height="20px" />
          <div style={{ marginTop: '8px' }}>
            <SkeletonText width="30%" height="14px" />
          </div>
        </div>
        <SkeletonText width="80px" height="24px" />
      </div>
    </div>
  );
}

interface SkeletonGridProps {
  count?: number;
  columns?: number;
}

export function SkeletonGrid({ count = 3, columns = 3 }: SkeletonGridProps) {
  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: `repeat(${columns}, 1fr)`,
        gap: '16px'
      }}
    >
      {Array.from({ length: count }).map((_, i) => (
        <SkeletonCard key={i} />
      ))}
    </div>
  );
}

// Add CSS animation to globals.css if not already present
if (typeof document !== 'undefined') {
  const style = document.createElement('style');
  style.textContent = `
    @keyframes skeleton-loading {
      0% {
        background-position: 200% 0;
      }
      100% {
        background-position: -200% 0;
      }
    }
  `;
  if (!document.querySelector('style[data-skeleton]')) {
    style.setAttribute('data-skeleton', 'true');
    document.head.appendChild(style);
  }
}
