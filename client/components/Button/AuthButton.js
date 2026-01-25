'use client';

import { signOut, useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import './Button.css';

export default function AuthButton() {
  const { data: session, status } = useSession();
  const router = useRouter();

  if (status === 'loading') {
    return (
      <button className="button ghost" type="button" disabled>
        Loading...
      </button>
    );
  }

  if (!session) {
    return (
      <button
        className="button ghost"
        type="button"
        onClick={() => router.push('/login')}
      >
        Sign in
      </button>
    );
  }

  return (
    <button
      className="button ghost auth-button auth-button--signout"
      type="button"
      onClick={() => signOut({ callbackUrl: '/' })}
    >
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
        <polyline points="16 17 21 12 16 7" />
        <line x1="21" y1="12" x2="9" y2="12" />
      </svg>
      Sign out
    </button>
  );
}
