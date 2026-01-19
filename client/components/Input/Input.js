'use client';

import { useState, useRef } from 'react';
import './Input.css';

/**
 * Input Component - Enhanced input element with flexible features
 *
 * Props:
 * - size: 'sm' | 'md' | 'lg' (default: 'md')
 * - state: 'default' | 'error' | 'success' (default: 'default')
 * - fullWidth: boolean (default: true)
 * - label: string (optional)
 * - error: string (optional error message)
 * - help: string (optional help text)
 * - disabled: boolean
 * - leftIcon: ReactNode (optional icon on left)
 * - rightIcon: ReactNode (optional icon on right)
 * - prefix: string (optional text prefix like "$")
 * - suffix: string (optional text suffix like "USD")
 * - clearable: boolean (show clear button, default: false)
 * - onClear: function (callback when cleared)
 * - type: string (default: 'text')
 * - id: string (optional)
 * - className: string (additional classes)
 *
 * Usage:
 * <Input
 *   size="md"
 *   type="email"
 *   placeholder="Enter email"
 *   label="Email"
 *   state={hasError ? 'error' : 'default'}
 *   error={errorMessage}
 * />
 */
export function Input({
  size = 'md',
  state = 'default',
  fullWidth = true,
  label = '',
  error = '',
  help = '',
  disabled = false,
  leftIcon = null,
  rightIcon = null,
  prefix = null,
  suffix = null,
  clearable = false,
  onClear = null,
  id = '',
  className = '',
  ...props
}) {
  const [isFocused, setIsFocused] = useState(false);
  const inputRef = useRef(null);

  const finalState = error ? 'error' : state;

  const inputClasses = [
    'input',
    `input--${size}`,
    finalState !== 'default' && `input--${finalState}`,
    fullWidth && 'input--full',
    isFocused && 'input--focused',
    className
  ]
    .filter(Boolean)
    .join(' ');

  const hasAdornments = leftIcon || rightIcon || prefix || suffix || clearable;

  const handleClear = () => {
    if (inputRef.current) {
      inputRef.current.value = '';
      inputRef.current.focus();
      onClear?.();
    }
  };

  return (
    <div className="input-wrapper">
      {label && (
        <label htmlFor={id} className="input-label">
          {label}
        </label>
      )}

      <div className={`input-container${hasAdornments ? ' input-container--has-adornments' : ''}`}>
        {leftIcon && <div className="input-adornment input-adornment--left">{leftIcon}</div>}

        {prefix && <span className="input-prefix">{prefix}</span>}

        <input
          ref={inputRef}
          id={id}
          className={inputClasses}
          disabled={disabled}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          {...props}
        />

        {suffix && <span className="input-suffix">{suffix}</span>}

        {clearable && inputRef.current?.value && !disabled && (
          <button
            type="button"
            className="input-clear-button"
            onClick={handleClear}
            aria-label="Clear input"
            tabIndex={-1}
          >
            ✕
          </button>
        )}

        {rightIcon && <div className="input-adornment input-adornment--right">{rightIcon}</div>}
      </div>

      {(error || help) && (
        <div className={`input-help${error ? ' input-help--error' : ''}`}>
          {error || help}
        </div>
      )}
    </div>
  );
}

export default Input;
