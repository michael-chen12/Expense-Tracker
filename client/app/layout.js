import LayoutContent from '@/components/LayoutContent';
import ErrorBoundary from '@/components/ErrorBoundary';
import Providers from './providers';
import './globals.css';

export const metadata = {
  title: 'Ledgerline',
  description: 'Simple expense tracker with a bold UI.',
  viewport: {
    width: 'device-width',
    initialScale: 1,
    maximumScale: 5,
    userScalable: true,
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  const theme = localStorage.getItem('ledgerline-theme') ||
                    (window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark');
                  document.documentElement.dataset.theme = theme;
                  document.documentElement.style.colorScheme = theme;
                } catch (e) {
                  // localStorage blocked, use default
                }
              })();
            `,
          }}
        />
      </head>
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
