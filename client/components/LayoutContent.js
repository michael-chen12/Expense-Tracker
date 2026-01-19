'use client';

import Link from 'next/link';
import { useSession } from 'next-auth/react';
import { usePathname } from 'next/navigation';
import { AuthButton } from '@/components/Button';
import NavLinks from '@/components/NavLinks';
import SkipToMain from '@/components/SkipToMain';

export default function LayoutContent({ children }) {
  const { data: session, status } = useSession();
  const pathname = usePathname();

  // Hide navbar on landing page (homepage when not authenticated)
  const isLandingPage = pathname === '/' && !session && status !== 'loading';

  return (
    <div className="page">
      <SkipToMain />
      {!isLandingPage && (
        <header className="topbar">
          <Link className="brand" href="/">Ledgerline</Link>
          <nav className="nav" aria-label="Main navigation">
            <NavLinks />
            <AuthButton />
          </nav>
        </header>
      )}
      <main id="main-content" className={isLandingPage ? "" : "main"}>{children}</main>
      {!isLandingPage && (
        <footer className="footer">Built with Next.js + PostgreSQL</footer>
      )}
    </div>
  );
}
