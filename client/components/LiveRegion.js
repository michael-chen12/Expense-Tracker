'use client';

/**
 * LiveRegion component for screen reader announcements
 * Use this to announce dynamic content changes to screen reader users
 */
export default function LiveRegion({ message, politeness = 'polite' }) {
  if (!message) return null;

  return (
    <div
      role="status"
      aria-live={politeness}
      aria-atomic="true"
      className="sr-only"
    >
      {message}
    </div>
  );
}
