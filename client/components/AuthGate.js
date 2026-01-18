'use client';

import { useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';

export default function AuthGate({ children, redirectTo }) {
  const { status } = useSession();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (status !== 'unauthenticated' || !redirectTo) {
      return;
    }

    const callbackUrl = encodeURIComponent(pathname || '/');
    router.replace(`${redirectTo}?callbackUrl=${callbackUrl}`);
  }, [status, redirectTo, pathname, router]);

  if (status === 'loading') {
    return null;
  }

  if (status === 'unauthenticated') {
    return null;
  }

  return children;
}
