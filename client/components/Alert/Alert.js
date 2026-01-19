'use client';

import { useState } from 'react';
import './Alert.css';

/**
 * Alert Component
 * Important messages and notifications with optional dismissal
 *
 * Props:
 * - children: Required - alert content
 * - variant: string - visual style ('info' | 'success' | 'warning' | 'error')
 *            default: 'info'
 * - size: string - alert size ('sm' | 'md' | 'lg')
 *         default: 'md'
 * - dismissible: boolean - show close button
 *                default: false
 * - onDismiss: function - callback when dismissed
 * - icon: ReactNode - optional icon to show
 * - title: string - optional title text
 * - className: string - additional CSS classes
 */
function Alert({
  children,
  variant = 'info',
  size = 'md',
  dismissible = false,
  onDismiss = null,
  icon = null,
  title = null,
  className = ''
}) {
  const [dismissed, setDismissed] = useState(false);

  const handleDismiss = () => {
    setDismissed(true);
    onDismiss?.();
  };

  if (dismissed) {
    return null;
  }

  const baseClass = 'alert';
  const variantClass = ` alert--${variant}`;
  const sizeClass = ` alert--${size}`;

  const combinedClass = `${baseClass}${variantClass}${sizeClass}${className ? ' ' + className : ''}`.trim();

  return (
    <div
      className={combinedClass}
      role="alert"
      aria-live="polite"
    >
      <div className="alert-content">
        {icon && <div className="alert-icon">{icon}</div>}
        <div className="alert-body">
          {title && <div className="alert-title">{title}</div>}
          {children && <div className="alert-message">{children}</div>}
        </div>
      </div>
      {dismissible && (
        <button
          className="alert-close"
          onClick={handleDismiss}
          aria-label="Dismiss alert"
          type="button"
        >
          ✕
        </button>
      )}
    </div>
  );
}

// Sub-component: AlertTitle
function AlertTitle({ children }) {
  return <div className="alert-title">{children}</div>;
}

// Sub-component: AlertDescription
function AlertDescription({ children }) {
  return <div className="alert-message">{children}</div>;
}

Alert.Title = AlertTitle;
Alert.Description = AlertDescription;

export default Alert;
