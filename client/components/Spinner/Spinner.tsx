import './Spinner.css';

type SpinnerSize = 'small' | 'medium' | 'large';
type SpinnerColor = 'primary' | 'white' | 'gray';

interface SpinnerProps {
  size?: SpinnerSize;
  color?: SpinnerColor;
}

export default function Spinner({ size = 'medium', color = 'primary' }: SpinnerProps) {
  const sizeClasses: Record<SpinnerSize, string> = {
    small: 'spinner-small',
    medium: 'spinner-medium',
    large: 'spinner-large'
  };

  const colorClasses: Record<SpinnerColor, string> = {
    primary: 'spinner-primary',
    white: 'spinner-white',
    gray: 'spinner-gray'
  };

  return (
    <div className={`spinner ${sizeClasses[size]} ${colorClasses[color]}`} />
  );
}
