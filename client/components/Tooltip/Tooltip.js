'use client';

import { useState } from 'react';
import './Tooltip.css';

/**
 * Tooltip Component
 * Contextual help text displayed on hover or focus
 *
 * Props:
 * - children: Required - trigger element
 * - content: Required - tooltip content (string or ReactNode)
 * - placement: string - tooltip position ('top' | 'bottom' | 'left' | 'right')
 *              default: 'top'
 * - delay: number - delay in ms before showing tooltip
 *          default: 200
 * - variant: string - visual style ('dark' | 'light')
 *            default: 'dark'
 * - className: string - additional CSS classes
 */
export default function Tooltip({
  children,
  content,
  placement = 'top',
  delay = 200,
  variant = 'dark',
  className = ''
}) {
  const [isVisible, setIsVisible] = useState(false);
  const [timeoutId, setTimeoutId] = useState(null);

  const handleMouseEnter = () => {
    const id = setTimeout(() => {
      setIsVisible(true);
    }, delay);
    setTimeoutId(id);
  };

  const handleMouseLeave = () => {
    if (timeoutId) {
      clearTimeout(timeoutId);
    }
    setIsVisible(false);
  };

  const baseClass = 'tooltip-trigger';
  const variantClass = ` tooltip--${variant}`;
  const placementClass = ` tooltip--${placement}`;
  const visibleClass = isVisible ? ' tooltip--visible' : '';

  const combinedClass = `${baseClass}${className ? ' ' + className : ''}`.trim();
  const tooltipClass = `tooltip${variantClass}${placementClass}${visibleClass}`.trim();

  return (
    <div
      className={combinedClass}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onFocus={handleMouseEnter}
      onBlur={handleMouseLeave}
    >
      {children}
      <div className={tooltipClass} role="tooltip">
        {content}
      </div>
    </div>
  );
}
