'use client';

import './Divider.css';

/**
 * Divider Component
 * Visual separator between content sections
 *
 * Props:
 * - orientation: string - 'horizontal' | 'vertical'
 *                default: 'horizontal'
 * - spacing: string - spacing around divider ('2' | '4' | '6' | '8')
 *            default: '4'
 * - variant: string - visual style ('solid' | 'dashed' | 'dotted')
 *            default: 'solid'
 * - label: string - optional text label centered on divider
 * - className: string - additional CSS classes
 */
export default function Divider({
  orientation = 'horizontal',
  spacing = '4',
  variant = 'solid',
  label = null,
  className = ''
}) {
  const baseClass = 'divider';
  const orientationClass = ` divider--${orientation}`;
  const spacingClass = ` divider--spacing-${spacing}`;
  const variantClass = ` divider--${variant}`;

  const combinedClass = `${baseClass}${orientationClass}${spacingClass}${variantClass}${className ? ' ' + className : ''}`.trim();

  if (label) {
    return (
      <div className={`${combinedClass} divider--labeled`}>
        <span className="divider-label">{label}</span>
      </div>
    );
  }

  return <div className={combinedClass} role="separator" />;
}
