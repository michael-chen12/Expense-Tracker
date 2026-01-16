import Link from 'next/link';
import './globals.css';

export const metadata = {
  title: 'Ledgerline',
  description: 'Simple expense tracker with a bold UI.'
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <div className="page">
          <header className="topbar">
            <div className="brand">Ledgerline</div>
            <nav className="nav">
              <Link className="nav-link" href="/">Dashboard</Link>
              <Link className="nav-link" href="/expenses">Expenses</Link>
              <Link className="button primary" href="/expenses/new">New expense</Link>
            </nav>
          </header>
          <main className="main">{children}</main>
          <footer className="footer">Built with Next.js + localStorage</footer>
        </div>
      </body>
    </html>
  );
}
