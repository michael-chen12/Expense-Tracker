'use client';

import Link from 'next/link';
import './Button.css';

/**
 * Unified Button Component
 * Renders as a Link when href prop is provided, otherwise as a button element
 * 
 * Props:
 * - href: Optional string - if provided, renders as Link to this route
 * - onClick: Optional function - callback for button click
 * - variant: Optional string - CSS variant class (primary, ghost, etc)
 * - children: Required - button text/content
 * - className: Optional - additional CSS classes
 * - disabled: Optional - disables button
 * - type: Optional - button type (default 'button')
 */
export default function Button({ 
  href, 
  onClick, 
  variant, 
  children, 
  className = '',
  ...props 
}) {
  const baseClass = 'button';
  const variantClass = variant ? ` ${baseClass}--${variant}` : '';
  const combinedClass = `${baseClass}${variantClass}${className ? ' ' + className : ''}`.trim();

  // Render as Link if href is provided
  if (href) {
    return (
      <Link href={href} className={combinedClass} {...props}>
        {children}
      </Link>
    );
  }

  // Render as button element
  return (
    <button 
      className={combinedClass} 
      onClick={onClick} 
      type="button"
      {...props}
    >
      {children}
    </button>
  );
}
