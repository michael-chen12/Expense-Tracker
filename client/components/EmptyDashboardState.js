'use client';

import Link from 'next/link';

export default function EmptyDashboardState() {
  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '80px 20px',
      textAlign: 'center',
      minHeight: '400px'
    }}>
      <div style={{
        fontSize: '64px',
        marginBottom: '24px',
        opacity: 0.5
      }}>
        📊
      </div>
      <h2 style={{
        fontSize: '24px',
        marginBottom: '12px',
        color: '#2d3748'
      }}>
        No expenses yet
      </h2>
      <p style={{
        fontSize: '16px',
        color: '#718096',
        marginBottom: '32px',
        maxWidth: '400px'
      }}>
        Get started by adding your first expense to track your spending and manage your budget.
      </p>
      <Link className="button primary" href="/expenses/new">
        Add your first expense
      </Link>
    </div>
  );
}
