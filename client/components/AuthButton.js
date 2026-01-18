'use client';

import { signIn, signOut, useSession } from 'next-auth/react';

export default function AuthButton() {
  const { data: session, status } = useSession();

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
        onClick={() => signIn('github')}
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
      Sign out
    </button>
  );
}
