'use client';

import './Container.css';

/**
 * Container Component
 * Constrains content width and provides consistent padding
 *
 * Props:
 * - children: Required - content to display
 * - maxWidth: string - max width variant ('sm' | 'md' | 'lg' | 'xl' | 'full')
 *             default: 'lg'
 * - padding: string - padding variant ('none' | 'sm' | 'md' | 'lg')
 *            default: 'md'
 * - centered: boolean - center content horizontally
 *             default: true
 * - className: string - additional CSS classes
 */
export default function Container({
  children,
  maxWidth = 'lg',
  padding = 'md',
  centered = true,
  className = ''
}) {
  const baseClass = 'container';
  const maxWidthClass = ` container--${maxWidth}`;
  const paddingClass = ` container--padding-${padding}`;
  const centeredClass = centered ? ' container--centered' : '';

  const combinedClass = `${baseClass}${maxWidthClass}${paddingClass}${centeredClass}${className ? ' ' + className : ''}`.trim();

  return (
    <div className={combinedClass}>
      {children}
    </div>
  );
}
