'use client';

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
      {required && <span style={{ color: '#ef4444', marginLeft: '4px' }}>*</span>}
    </label>
  );
}

/**
 * FormInput - Text, email, password, number, date inputs
 */
export function FormInput({ className = '', ...props }) {
  return <input className={`form-input ${className}`} {...props} />;
}

/**
 * FormSelect - Select dropdown
 */
export function FormSelect({ children, className = '', ...props }) {
  return (
    <select className={`form-select ${className}`} {...props}>
      {children}
    </select>
  );
}

/**
 * FormTextarea - Textarea input
 */
export function FormTextarea({ className = '', ...props }) {
  return <textarea className={`form-textarea ${className}`} {...props} />;
}

/**
 * FormCheckbox - Checkbox input
 */
export function FormCheckbox({ label, className = '', ...props }) {
  if (label) {
    return (
      <label style={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}>
        <input type="checkbox" className={`form-checkbox ${className}`} {...props} />
        {label}
      </label>
    );
  }
  return <input type="checkbox" className={`form-checkbox ${className}`} {...props} />;
}

/**
 * FormRadio - Radio input
 */
export function FormRadio({ label, className = '', ...props }) {
  if (label) {
    return (
      <label style={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}>
        <input type="radio" className={`form-radio ${className}`} {...props} />
        {label}
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
