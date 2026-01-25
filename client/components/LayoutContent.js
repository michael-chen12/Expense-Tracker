'use client';

import Link from 'next/link';
import { useSession } from 'next-auth/react';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import { AuthButton } from '@/components/Button';
import NavLinks from '@/components/NavLinks';
import SkipToMain from '@/components/SkipToMain';
import ThemeToggleButton from '@/components/ThemeToggleButton/ThemeToggleButton';
import KeyboardShortcutsHelp from '@/components/KeyboardShortcutsHelp';
import useKeyboardShortcuts from '@/lib/hooks/useKeyboardShortcuts';

export default function LayoutContent({ children }) {
  const { data: session, status } = useSession();
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Hide navbar on landing page (homepage when not authenticated)
  const isLandingPage = pathname === '/' && !session && status !== 'loading';

  // Enable keyboard shortcuts when user is authenticated
  useKeyboardShortcuts({ enabled: !!session });

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setMobileMenuOpen(false);
  };

  return (
    <div className="page">
      <SkipToMain />
      {!isLandingPage && (
        <header className="topbar">
          <div className="topbar-inner">
            <Link className="brand" href="/" onClick={closeMobileMenu}>Ledgerline</Link>
            <div className="topbar-actions">
              <ThemeToggleButton />
              <button
                className="mobile-menu-toggle"
                onClick={toggleMobileMenu}
                aria-label="Toggle navigation menu"
                aria-expanded={mobileMenuOpen}
              >
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  {mobileMenuOpen ? (
                    <>
                      <line x1="18" y1="6" x2="6" y2="18" />
                      <line x1="6" y1="6" x2="18" y2="18" />
                    </>
                  ) : (
                    <>
                      <line x1="3" y1="12" x2="21" y2="12" />
                      <line x1="3" y1="6" x2="21" y2="6" />
                      <line x1="3" y1="18" x2="21" y2="18" />
                    </>
                  )}
                </svg>
              </button>
            </div>
          </div>
          <nav 
            className={`nav ${mobileMenuOpen ? 'nav--open' : ''}`} 
            aria-label="Main navigation"
          >
            <div className="nav-content" onClick={closeMobileMenu}>
              <NavLinks />
              <div className="nav-actions">
                <ThemeToggleButton />
                <AuthButton />
              </div>
            </div>
          </nav>
          {mobileMenuOpen && (
            <div 
              className="mobile-menu-backdrop" 
              onClick={closeMobileMenu}
              aria-hidden="true"
            />
          )}
        </header>
      )}
      <main id="main-content" className={isLandingPage ? "" : "main"}>{children}</main>
      {/* Keyboard shortcuts help modal */}
      {session && <KeyboardShortcutsHelp />}
    </div>
  );
}
