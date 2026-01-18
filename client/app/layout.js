import Link from 'next/link';
import AuthButton from '@/components/AuthButton';
import NavLinks from '@/components/NavLinks';
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
          <div className="page">
            <header className="topbar">
              <Link className="brand" href="/">Ledgerline</Link>
              <nav className="nav">
                <NavLinks />
                <AuthButton />
              </nav>
            </header>
            <main className="main">{children}</main>
            <footer className="footer">Built with Next.js + localStorage</footer>
          </div>
        </Providers>
      </body>
    </html>
  );
}
