'use client';

import './Text.css';

/**
 * Text Component - Reusable text element with multiple variants
 * 
 * Variants:
 * - heading-1, heading-2, heading-3, heading-4, heading-5, heading-6
 * - body-large, body, body-small, body-tiny
 * - muted, subtle, accent, success, error, warning
 * - font-light, font-normal, font-medium, font-semibold, font-bold
 * - text-left, text-center, text-right
 * - truncate, line-clamp-2, line-clamp-3
 * - uppercase, capitalize, lowercase
 * 
 * Color property options:
 * - 'default' / 'ink' - Light text for dark backgrounds
 * - 'dark' - Dark text for light backgrounds
 * - 'muted' - Muted gray text
 * - 'accent' - Orange accent color
 * - 'success' - Green
 * - 'error' - Red
 * - 'warning' - Amber
 * - any custom hex color value like '#1f2937'
 */

const colorMap = {
  default: 'var(--ink)',
  ink: 'var(--ink)',
  dark: '#1f2937',
  'dark-gray': '#374151',
  'light-gray': '#9ca3af',
  muted: 'var(--muted)',
  subtle: 'rgba(241, 245, 249, 0.7)',
  accent: 'var(--accent)',
  success: 'var(--success)',
  error: 'var(--error)',
  warning: 'var(--warning)',
};

export function Text({
  variant = 'body',
  as = 'p',
  color = '',
  weight = '',
  align = '',
  className = '',
  style = {},
  children,
  ...props
}) {
  const Component = as;
  
  // Determine color value
  let colorValue = '';
  if (color) {
    colorValue = colorMap[color] || color; // Use map if exists, otherwise treat as custom color
  }

  // Merge styles with color
  const mergedStyle = {
    ...style,
    ...(colorValue && { color: colorValue }),
  };

  const classes = [
    'text',
    variant,
    weight,
    align,
    className
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <Component className={classes} style={mergedStyle} {...props}>
      {children}
    </Component>
  );
}

export default Text;
