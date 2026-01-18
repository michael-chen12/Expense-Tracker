'use client';

import Link from 'next/link';
import { useSession } from 'next-auth/react';

export default function NavLinks() {
  const { status } = useSession();
  const signedIn = status === 'authenticated';

  const dashboardHref = signedIn ? '/' : '/login';
  const expensesHref = signedIn ? '/expenses' : '/login';
  const summaryHref = signedIn ? '/summary' : '/login';

  return (
    <>
      <Link className="nav-link" href={dashboardHref}>Dashboard</Link>
      <Link className="nav-link" href={expensesHref}>Expenses</Link>
      <Link className="nav-link" href={summaryHref}>Summary</Link>
    </>
  );
}
