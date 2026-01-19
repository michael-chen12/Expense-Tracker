import Spinner from '@/components/Spinner';

export default function LoadingScreen({ message = '' }) {
  return (
    <div className="loading-screen">
      <div className="loading-content">
        <Spinner size="large" color="primary" />
        <p className="loading-message">{message}</p>
      </div>

      <style jsx>{`
        .loading-screen {
          display: flex;
          align-items: center;
          justify-content: center;
          min-height: 60vh;
          width: 100%;
        }

        .loading-content {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 16px;
        }

        .loading-message {
          color: #718096;
          font-size: 16px;
          margin: 0;
        }
      `}</style>
    </div>
  );
}
