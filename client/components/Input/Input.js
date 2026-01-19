'use client';

import './Input.css';

/**
 * Input Component - Reusable input element with multiple variants
 * 
 * Props:
 * - variant: 'light' | 'dark' (default: 'dark')
 * - size: 'small' | 'medium' | 'large' (default: 'medium')
 * - state: 'default' | 'error' | 'success' (default: 'default')
 * - fullWidth: boolean (default: true)
 * - label: string (optional)
 * - error: string (optional error message)
 * - help: string (optional help text)
 * - disabled: boolean
 * - type: string (default: 'text')
 * 
 * Usage:
 * <Input 
 *   variant="light"
 *   type="email"
 *   placeholder="Enter email"
 *   label="Email"
 * />
 */
export function Input({
  variant = 'dark',
  size = 'medium',
  state = 'default',
  fullWidth = true,
  label = '',
  error = '',
  help = '',
  disabled = false,
  id = '',
  className = '',
  ...props
}) {
  const finalState = error ? 'error' : state;

  const classes = [
    'input-field',
    variant,
    `input-${size}`,
    finalState !== 'default' && finalState,
    fullWidth && 'full-width',
    className
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <div className="input-wrapper">
      {label && (
        <label htmlFor={id} className="input-label">
          {label}
        </label>
      )}
      <input
        id={id}
        className={classes}
        disabled={disabled}
        {...props}
      />
      {(error || help) && (
        <div className={`input-help ${error ? 'error' : ''}`}>
          {error || help}
        </div>
      )}
    </div>
  );
}

export default Input;
