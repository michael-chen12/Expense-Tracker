'use client';

import './Stack.css';

/**
 * Stack Component
 * Flexbox layout helper for spacing children consistently
 *
 * Props:
 * - children: Required - content to display
 * - direction: string - layout direction ('vertical' | 'horizontal')
 *              default: 'vertical'
 * - spacing: string - gap between items ('1' | '2' | '3' | '4' | '5' | '6' | '8' | '10')
 *            default: '4'
 * - align: string - align items ('start' | 'center' | 'end' | 'stretch')
 *          default: 'stretch'
 * - justify: string - justify content ('start' | 'center' | 'end' | 'between' | 'around')
 *            default: 'start'
 * - wrap: boolean - allow items to wrap
 *         default: false
 * - className: string - additional CSS classes
 */
export default function Stack({
  children,
  direction = 'vertical',
  spacing = '4',
  align = 'stretch',
  justify = 'start',
  wrap = false,
  className = ''
}) {
  const baseClass = 'stack';
  const directionClass = ` stack--${direction}`;
  const spacingClass = ` stack--spacing-${spacing}`;
  const alignClass = ` stack--align-${align}`;
  const justifyClass = ` stack--justify-${justify}`;
  const wrapClass = wrap ? ' stack--wrap' : '';

  const combinedClass = `${baseClass}${directionClass}${spacingClass}${alignClass}${justifyClass}${wrapClass}${className ? ' ' + className : ''}`.trim();

  return (
    <div className={combinedClass}>
      {children}
    </div>
  );
}
