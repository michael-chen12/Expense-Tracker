'use client';

/**
 * Card Component
 * Composable card with sub-components for flexible layouts
 *
 * Props:
 * - children: Required - card content
 * - variant: string - visual style ('default' | 'outlined' | 'elevated' | 'ghost')
 *            default: 'default'
 * - padding: string - padding variant ('none' | 'sm' | 'md' | 'lg')
 *            default: 'md'
 * - state: string - state styling (null | 'success' | 'error' | 'warning' | 'info')
 *          default: null
 * - interactive: boolean - add hover effects
 *                default: false
 * - className: string - additional CSS classes
 * - role: string - ARIA role
 * - ariaLabel: string - ARIA label
 */
function Card({
  children,
  variant = 'default',
  padding = 'md',
  state = null,
  interactive = false,
  className = '',
  role = null,
  ariaLabel = null,
  ...props
}) {
  const baseClass = 'card';
  const variantClass = ` card--${variant}`;
  const paddingClass = ` card--padding-${padding}`;
  const stateClass = state ? ` card--${state}` : '';
  const interactiveClass = interactive ? ' card--interactive' : '';

  const combinedClass = `${baseClass}${variantClass}${paddingClass}${stateClass}${interactiveClass}${className ? ' ' + className : ''}`.trim();

  return (
    <div
      className={combinedClass}
      role={role}
      aria-label={ariaLabel}
      {...props}
    >
      {children}
    </div>
  );
}

/**
 * Card.Header - Header section with title and optional subtitle
 */
function CardHeader({ children, className = '' }) {
  return (
    <div className={`card-header${className ? ' ' + className : ''}`}>
      {children}
    </div>
  );
}

/**
 * Card.Title - Main title text
 */
function CardTitle({ children, className = '' }) {
  return (
    <h2 className={`card-title${className ? ' ' + className : ''}`}>
      {children}
    </h2>
  );
}

/**
 * Card.Subtitle - Secondary descriptive text
 */
function CardSubtitle({ children, className = '' }) {
  return (
    <p className={`card-subtitle${className ? ' ' + className : ''}`}>
      {children}
    </p>
  );
}

/**
 * Card.Body - Main content area
 */
function CardBody({ children, className = '' }) {
  return (
    <div className={`card-body${className ? ' ' + className : ''}`}>
      {children}
    </div>
  );
}

/**
 * Card.Footer - Footer section for actions
 */
function CardFooter({ children, className = '', align = 'end' }) {
  return (
    <div className={`card-footer card-footer--${align}${className ? ' ' + className : ''}`}>
      {children}
    </div>
  );
}

// Attach sub-components
Card.Header = CardHeader;
Card.Title = CardTitle;
Card.Subtitle = CardSubtitle;
Card.Body = CardBody;
Card.Footer = CardFooter;

export default Card;
