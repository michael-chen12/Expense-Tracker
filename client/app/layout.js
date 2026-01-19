import LayoutContent from '@/components/LayoutContent';
import ErrorBoundary from '@/components/ErrorBoundary';
import Providers from './providers';
import './globals.css';

export const metadata = {
  title: 'Ledgerline',
  description: 'Simple expense tracker with a bold UI.'
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <Providers>
          <ErrorBoundary>
            <LayoutContent>{children}</LayoutContent>
          </ErrorBoundary>
        </Providers>
      </body>
    </html>
  );
}
