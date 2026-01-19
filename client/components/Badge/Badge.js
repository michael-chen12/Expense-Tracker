'use client';

import './Badge.css';

/**
 * Badge Component
 * Status indicator, count label, or tag display
 *
 * Props:
 * - children: Required - badge text/content
 * - variant: string - visual style ('default' | 'primary' | 'success' | 'warning' | 'error' | 'info')
 *            default: 'default'
 * - size: string - badge size ('sm' | 'md' | 'lg')
 *         default: 'md'
 * - rounded: boolean - fully rounded border
 *            default: true
 * - dot: boolean - show as dot instead of text
 *        default: false
 * - className: string - additional CSS classes
 */
export default function Badge({
  children,
  variant = 'default',
  size = 'md',
  rounded = true,
  dot = false,
  className = ''
}) {
  const baseClass = 'badge';
  const variantClass = ` badge--${variant}`;
  const sizeClass = ` badge--${size}`;
  const roundedClass = rounded ? ' badge--rounded' : '';
  const dotClass = dot ? ' badge--dot' : '';

  const combinedClass = `${baseClass}${variantClass}${sizeClass}${roundedClass}${dotClass}${className ? ' ' + className : ''}`.trim();

  return (
    <span className={combinedClass} role="status">
      {!dot && children}
    </span>
  );
}
