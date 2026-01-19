import './Spinner.css';

type SpinnerSize = 'small' | 'medium' | 'large';
type SpinnerColor = 'primary' | 'white' | 'gray' | 'inherit';

interface SpinnerProps {
  size?: SpinnerSize;
  color?: SpinnerColor;
  className?: string;
}

export default function Spinner({
  size = 'medium',
  color = 'primary',
  className = ''
}: SpinnerProps) {
  const sizeClasses: Record<SpinnerSize, string> = {
    small: 'spinner-small',
    medium: 'spinner-medium',
    large: 'spinner-large'
  };

  const colorClasses: Record<SpinnerColor, string> = {
    primary: 'spinner-primary',
    white: 'spinner-white',
    gray: 'spinner-gray',
    inherit: 'spinner-inherit'
  };

  const combinedClass = `spinner ${sizeClasses[size]} ${colorClasses[color]}${className ? ' ' + className : ''}`.trim();

  return (
    <div className={combinedClass} aria-label="Loading" role="status" />
  );
}
