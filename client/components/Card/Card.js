'use client';

/**
 * Reusable Card Component
 * 
 * Props:
 * - children: Required - card content
 * - className: Optional - additional CSS classes
 * - title: Optional - card title/header
 * - subtitle: Optional - card subtitle
 * - padding: Optional - custom padding (default 'default')
 * - variant: Optional - card variant (default, compact, minimal, interactive, empty, error, success)
 * - style: Optional - inline styles
 * - role: Optional - ARIA role
 * - ariaLabel: Optional - ARIA label
 */
export default function Card({ 
  children, 
  className = '',
  title,
  subtitle,
  padding = 'default',
  variant = 'default',
  style = {},
  role,
  ariaLabel,
  ...props 
}) {
  const baseClass = 'card';
  const paddingClass = `card--padding-${padding}`;
  const variantClass = variant ? ` card--${variant}` : '';
  const combinedClass = `${baseClass} ${paddingClass}${variantClass}${className ? ' ' + className : ''}`.trim();

  return (
    <div 
      className={combinedClass} 
      style={style}
      role={role}
      aria-label={ariaLabel}
      {...props}
    >
      {(title || subtitle) && (
        <div className="card-header">
          {title && <h2 className="card-title">{title}</h2>}
          {subtitle && <p className="card-subtitle">{subtitle}</p>}
        </div>
      )}
      {children}
    </div>
  );
}
