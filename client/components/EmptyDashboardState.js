'use client';

import { Button } from '@/components/Button';
import './EmptyDashboardState.css';

export default function EmptyDashboardState() {
  return (
    <div className="empty-dashboard">
      <div className="empty-dashboard-icon">
        📊
      </div>
      <h2 className="empty-dashboard-title">
        No expenses yet
      </h2>
      <p className="empty-dashboard-text">
        Get started by adding your first expense to track your spending and manage your budget.
      </p>
      <Button variant="primary" href="/expenses/new">
        Add your first expense
      </Button>
    </div>
  );
}
