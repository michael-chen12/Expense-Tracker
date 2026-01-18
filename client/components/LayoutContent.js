'use client';

import Link from 'next/link';
import { useSession } from 'next-auth/react';
import { usePathname } from 'next/navigation';
import AuthButton from '@/components/AuthButton';
import NavLinks from '@/components/NavLinks';

export default function LayoutContent({ children }) {
  const { data: session, status } = useSession();
  const pathname = usePathname();

  // Hide navbar on landing page (homepage when not authenticated)
  const isLandingPage = pathname === '/' && !session && status !== 'loading';

  return (
    <div className="page">
      {!isLandingPage && (
        <header className="topbar">
          <Link className="brand" href="/">Ledgerline</Link>
          <nav className="nav">
            <NavLinks />
            <AuthButton />
          </nav>
        </header>
      )}
      <main className={isLandingPage ? "" : "main"}>{children}</main>
      {!isLandingPage && (
        <footer className="footer">Built with Next.js + PostgreSQL</footer>
      )}
    </div>
  );
}
