'use client';

import Input from '../Input/Input';
import './Form.css';

/**
 * Form component - Main form wrapper
 */
export function Form({ onSubmit, children, className = '', ...props }) {
  const handleSubmit = (e) => {
    e.preventDefault();
    if (onSubmit) {
      onSubmit(e);
    }
  };

  return (
    <form onSubmit={handleSubmit} className={`form ${className}`} {...props}>
      {children}
    </form>
  );
}

/**
 * FormGroup - Wrapper for label and input
 */
export function FormGroup({ children, className = '' }) {
  return <div className={`form-group ${className}`}>{children}</div>;
}

/**
 * FormLabel - Form label component
 */
export function FormLabel({ htmlFor, children, required, className = '' }) {
  return (
    <label htmlFor={htmlFor} className={`form-label ${className}`}>
      {children}
      {required && <span className="form-label-required">*</span>}
    </label>
  );
}

/**
 * FormInput - Text, email, password, number, date inputs
 * Now uses the enhanced Input component from the Input package
 */
export function FormInput({
  size = 'md',
  label = '',
  error = '',
  help = '',
  leftIcon = null,
  rightIcon = null,
  prefix = null,
  suffix = null,
  clearable = false,
  onClear = null,
  className = '',
  ...props
}) {
  return (
    <Input
      size={size}
      label={label}
      error={error}
      help={help}
      leftIcon={leftIcon}
      rightIcon={rightIcon}
      prefix={prefix}
      suffix={suffix}
      clearable={clearable}
      onClear={onClear}
      className={className}
      {...props}
    />
  );
}

/**
 * FormSelect - Select dropdown with consistent styling
 */
export function FormSelect({
  size = 'md',
  label = '',
  error = '',
  help = '',
  children,
  className = '',
  ...props
}) {
  const sizeClass = ` form-select--${size}`;
  const stateClass = error ? ' form-select--error' : '';
  const classes = `form-select${sizeClass}${stateClass}${className ? ' ' + className : ''}`.trim();

  return (
    <div className="form-select-wrapper">
      {label && <label className="form-label">{label}</label>}
      <select className={classes} {...props}>
        {children}
      </select>
      {(error || help) && (
        <div className={`form-help${error ? ' form-help--error' : ''}`}>
          {error || help}
        </div>
      )}
    </div>
  );
}

/**
 * FormTextarea - Textarea input with consistent styling
 */
export function FormTextarea({
  size = 'md',
  label = '',
  error = '',
  help = '',
  className = '',
  ...props
}) {
  const sizeClass = ` form-textarea--${size}`;
  const stateClass = error ? ' form-textarea--error' : '';
  const classes = `form-textarea${sizeClass}${stateClass}${className ? ' ' + className : ''}`.trim();

  return (
    <div className="form-textarea-wrapper">
      {label && <label className="form-label">{label}</label>}
      <textarea className={classes} {...props} />
      {(error || help) && (
        <div className={`form-help${error ? ' form-help--error' : ''}`}>
          {error || help}
        </div>
      )}
    </div>
  );
}

/**
 * FormCheckbox - Checkbox input with label
 */
export function FormCheckbox({ label, className = '', ...props }) {
  if (label) {
    return (
      <label className={`form-checkbox-label ${className}`}>
        <input type="checkbox" className="form-checkbox" {...props} />
        <span>{label}</span>
      </label>
    );
  }
  return <input type="checkbox" className={`form-checkbox ${className}`} {...props} />;
}

/**
 * FormRadio - Radio input with label
 */
export function FormRadio({ label, className = '', ...props }) {
  if (label) {
    return (
      <label className={`form-radio-label ${className}`}>
        <input type="radio" className="form-radio" {...props} />
        <span>{label}</span>
      </label>
    );
  }
  return <input type="radio" className={`form-radio ${className}`} {...props} />;
}

/**
 * FormRow - Horizontal layout for form fields
 */
export function FormRow({ children, className = '' }) {
  return <div className={`form-row ${className}`}>{children}</div>;
}

/**
 * FormError - Error message component
 */
export function FormError({ children, className = '' }) {
  if (!children) return null;
  return <div className={`form-error-message ${className}`}>{children}</div>;
}

/**
 * FormActions - Container for form buttons
 */
export function FormActions({ children, align = 'end', className = '' }) {
  const alignClass = align ? `form-actions--${align}` : '';
  return <div className={`form-actions ${alignClass} ${className}`}>{children}</div>;
}

/**
 * FormSection - Section wrapper for grouping fields
 */
export function FormSection({ title, children, className = '' }) {
  return (
    <div className={`form-section ${className}`}>
      {title && <h3 className="form-section-title">{title}</h3>}
      {children}
    </div>
  );
}

/**
 * FormCard - Card wrapper for forms
 */
export function FormCard({ children, className = '' }) {
  return <div className={`form-card ${className}`}>{children}</div>;
}

/**
 * FormHelpText - Help text for form fields
 */
export function FormHelpText({ children, className = '' }) {
  return <p className={`form-help-text ${className}`}>{children}</p>;
}
