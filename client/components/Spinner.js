export default function Spinner({ size = 'medium', color = 'primary' }) {
  const sizeClasses = {
    small: 'spinner-small',
    medium: 'spinner-medium',
    large: 'spinner-large'
  };

  const colorClasses = {
    primary: 'spinner-primary',
    white: 'spinner-white',
    gray: 'spinner-gray'
  };

  return (
    <div className={`spinner ${sizeClasses[size]} ${colorClasses[color]}`}>
      <style jsx>{`
        .spinner {
          border-radius: 50%;
          border-style: solid;
          border-top-color: transparent;
          animation: spin 0.8s linear infinite;
        }

        .spinner-small {
          width: 16px;
          height: 16px;
          border-width: 2px;
        }

        .spinner-medium {
          width: 24px;
          height: 24px;
          border-width: 3px;
        }

        .spinner-large {
          width: 40px;
          height: 40px;
          border-width: 4px;
        }

        .spinner-primary {
          border-color: #667eea;
          border-top-color: transparent;
        }

        .spinner-white {
          border-color: #ffffff;
          border-top-color: transparent;
        }

        .spinner-gray {
          border-color: #cbd5e0;
          border-top-color: transparent;
        }

        @keyframes spin {
          0% {
            transform: rotate(0deg);
          }
          100% {
            transform: rotate(360deg);
          }
        }
      `}</style>
    </div>
  );
}
