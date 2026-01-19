'use client';

import Link from 'next/link';
import Spinner from '../Spinner';
import './Button.css';

/**
 * Unified Button Component
 * Modern pill-shaped design with support for multiple variants and states
 *
 * Props:
 * - href: Optional string - if provided, renders as Link to this route
 * - onClick: Optional function - callback for button click
 * - variant: string - visual style ('primary' | 'secondary' | 'ghost' | 'danger' | 'success')
 *           default: 'primary'
 * - size: string - button size ('sm' | 'md' | 'lg')
 *         default: 'md'
 * - children: Required - button text/content
 * - className: Optional - additional CSS classes
 * - disabled: Optional - disables button
 * - fullWidth: Optional boolean - makes button full width
 * - loading: Optional boolean - shows loading spinner and disables button
 * - loadingText: Optional string - text to show while loading (defaults to children)
 * - leftIcon: Optional ReactNode - icon to show before text
 * - rightIcon: Optional ReactNode - icon to show after text
 * - type: Optional - button type (default 'button')
 * - ariaLabel: Optional - ARIA label for accessibility
 */
export default function Button({
  href,
  onClick,
  variant = 'primary',
  size = 'md',
  children,
  className = '',
  disabled = false,
  fullWidth = false,
  loading = false,
  loadingText = null,
  leftIcon = null,
  rightIcon = null,
  ariaLabel = null,
  type = 'button',
  ...props
}) {
  // Build class names
  const baseClass = 'btn';
  const variantClass = ` btn--${variant}`;
  const sizeClass = ` btn--${size}`;
  const fullWidthClass = fullWidth ? ' btn--full' : '';
  const combinedClass = `${baseClass}${variantClass}${sizeClass}${fullWidthClass}${className ? ' ' + className : ''}`.trim();

  // Determine if button should be disabled
  const isDisabled = disabled || loading;

  // Build button content
  const buttonContent = (
    <span className="btn-content">
      {loading && <Spinner size="small" color="inherit" className="btn-spinner" />}
      {!loading && leftIcon && <span className="btn-icon btn-icon--left">{leftIcon}</span>}
      {!loading && <span className="btn-text">{children}</span>}
      {!loading && rightIcon && <span className="btn-icon btn-icon--right">{rightIcon}</span>}
      {loading && loadingText && <span className="btn-text">{loadingText}</span>}
    </span>
  );

  // Render as Link if href is provided
  if (href && !isDisabled) {
    return (
      <Link
        href={href}
        className={combinedClass}
        aria-label={ariaLabel}
        {...props}
      >
        {buttonContent}
      </Link>
    );
  }

  // Render as button element
  return (
    <button
      className={combinedClass}
      onClick={onClick}
      disabled={isDisabled}
      type={type}
      aria-label={ariaLabel}
      aria-busy={loading}
      {...props}
    >
      {buttonContent}
    </button>
  );
}
