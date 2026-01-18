'use client';

import { signIn } from 'next-auth/react';
import { useSearchParams } from 'next/navigation';

export default function LoginPage() {
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get('callbackUrl') || '/';

  return (
    <div className="card" style={{ maxWidth: '520px', margin: '0 auto' }}>
      <div className="card-header">
        <h1>Sign in</h1>
      </div>
      <p className="subtle">Use GitHub to access your Ledgerline workspace.</p>
      <div className="inline-actions">
        <button
          className="button primary"
          type="button"
          onClick={() => signIn('github', { callbackUrl })}
        >
          Continue with GitHub
        </button>
      </div>
    </div>
  );
}
