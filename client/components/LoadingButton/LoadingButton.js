'use client';

import Spinner from '@/components/Spinner';
import './LoadingButton.css';

/**
 * LoadingButton Component
 * Reusable button with loading state management
 * Eliminates repeated loading button patterns across the app
 * 
 * @param {Object} props - Component props
 * @param {boolean} props.loading - Whether button is in loading state
 * @param {boolean} props.disabled - Whether button is disabled
 * @param {string} props.children - Button label
 * @param {string} props.loadingText - Text to show when loading (default: "Loading...")
 * @param {string} props.variant - Button variant: 'primary' | 'ghost' | 'outline'
 * @param {string} props.size - Button size: 'small' | 'medium' | 'large'
 * @param {string} props.spinnerColor - Spinner color: 'white' | 'primary' | 'gray'
 * @param {Function} props.onClick - Click handler
 * @param {string} props.type - Button type: 'button' | 'submit' | 'reset'
 * @param {string} props.className - Additional CSS classes
 * @param {string} props.ariaLabel - Accessible label
 * 
 * @example
 * <LoadingButton
 *   loading={saving}
 *   onClick={handleSave}
 *   variant="primary"
 * >
 *   Save expense
 * </LoadingButton>
 */
export default function LoadingButton({
  loading = false,
  disabled = false,
  children,
  loadingText = 'Loading...',
  variant = 'primary',
  size = 'medium',
  spinnerColor = 'white',
  onClick,
  type = 'button',
  className = '',
  ariaLabel,
  ...rest
}) {
  const isDisabled = loading || disabled;

  // Determine spinner color based on variant if not explicitly set
  const determineSpinnerColor = () => {
    if (spinnerColor !== 'white') return spinnerColor;
    if (variant === 'primary') return 'white';
    if (variant === 'ghost') return 'primary';
    return 'gray';
  };

  const finalSpinnerColor = determineSpinnerColor();

  // Build button class
  const buttonClass = `button ${variant} ${size} ${className}`.trim();

  return (
    <button
      type={type}
      className={buttonClass}
      onClick={onClick}
      disabled={isDisabled}
      aria-busy={loading ? 'true' : 'false'}
      aria-label={ariaLabel}
      {...rest}
    >
      {loading ? (
        <span className="button-loading-content">
          <Spinner size="small" color={finalSpinnerColor} />
          {loadingText}
        </span>
      ) : (
        children
      )}
    </button>
  );
}
