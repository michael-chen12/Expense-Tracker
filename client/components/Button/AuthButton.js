'use client';

import { signOut, useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import './Button.css';

export default function AuthButton() {
  const { data: session, status } = useSession();
  const router = useRouter();

  if (status === 'loading') {
    return (
      <button className="button ghost" type="button" disabled style={{ color: 'white' }}>
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
        style={{ color: 'white' }}
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
      style={{ color: 'white' }}
    >
      Sign out
    </button>
  );
}
