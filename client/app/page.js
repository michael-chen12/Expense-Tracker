'use client';

import Link from 'next/link';
import { useState } from 'react';
import { useSession } from 'next-auth/react';
import AuthGate from '@/components/AuthGate';
import LandingPage from '@/components/LandingPage';
import LoadingScreen from '@/components/LoadingScreen';
import { Button } from '@/components/Button';
import { Modal, ModalActions } from '@/components/Modal';
import { LoadingButton } from '@/components/LoadingButton';
import { formatCurrency, formatDate } from '@/lib/format';
import { useChartData } from '@/lib/hooks/useChartData';
import { useExpenses } from '@/lib/hooks/useExpenses';
import { useAllowance } from '@/lib/hooks/useAllowance';
import DashboardCharts from '@/components/DashboardCharts';
import RecentExpenses from '@/components/RecentExpenses';
import AllowanceSection from '@/components/AllowanceSection';
import UpcomingRecurringExpenses from '@/components/UpcomingRecurringExpenses';
import { DateRangeFilter } from '@/components/DateRangeFilter';
import EmptyDashboardState from '@/components/EmptyDashboardState';

function getMonthRange() {
  const today = new Date();
  const from = new Date(today.getFullYear(), today.getMonth(), 1);
  const to = new Date(today.getFullYear(), today.getMonth() + 1, 0);

  return {
    from: from.toISOString().slice(0, 10),
    to: to.toISOString().slice(0, 10),
    label: today.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })
  };
}

function Dashboard() {
  const { data: session } = useSession();
  const userId = session?.user?.id || session?.userId;
  
  // Use custom hooks for data management (reduces complexity)
  const {
    recent,
    allExpenses,
    loading: loadingExpenses,
    error: expensesError,
    setError: setExpensesError,
    deleteExpenseById
  } = useExpenses();

  const {
    allowance,
    allowanceStatus,
    loading: loadingAllowance,
    error: allowanceError,
    saving: savingAllowance,
    handleChange: handleAllowanceChange,
    handleSubmit: handleAllowanceSubmit
  } = useAllowance(userId);

  // Local state for UI
  const [dateRange, setDateRange] = useState(getMonthRange());
  const [confirmExpense, setConfirmExpense] = useState(null);
  const [deletingExpense, setDeletingExpense] = useState(false);

  // Check if all dashboard data is loaded
  const isDashboardLoading = loadingExpenses || loadingAllowance;

  // Process data for charts using custom hook
  const { monthlyTrendData, categoryData, overviewMetrics, hasData, isLoading: isLoadingCharts, error: chartError } = useChartData(
    allExpenses,
    allowanceStatus,
    isDashboardLoading,
    dateRange
  );

  // Handle expense deletion with confirmation
  const requestExpenseDelete = (expenseId) => {
    const expense = recent.find((item) => item.id === expenseId);
    if (expense) {
      setConfirmExpense({
        id: expenseId,
        category: expense.category,
        amount: expense.amount,
        date: expense.date,
        note: expense.note
      });
    } else {
      setConfirmExpense({ id: expenseId });
    }
  };

  const handleExpenseDelete = async () => {
    if (!confirmExpense) return;

    setDeletingExpense(true);

    try {
      const result = await deleteExpenseById(confirmExpense.id);
      if (result.success) {
        setExpensesError('');
      }
    } catch (deleteError) {
      setExpensesError(deleteError.message || 'Unable to delete expense.');
    } finally {
      setDeletingExpense(false);
      setConfirmExpense(null);
    }
  };

  // Check if user has no expenses at all
  const hasNoExpenses = !isDashboardLoading && allExpenses.length === 0;

  return (
    <div>
      {!isDashboardLoading && !hasNoExpenses && (
        <>
          <div className="page-header">
            <div>
              <h1>Dashboard</h1>
              <p className="subtle">Track your spending and manage your budget.</p>
            </div>
            <Button variant="primary" href="/expenses/new">Add expense</Button>
          </div>

          {expensesError ? <div className="error">{expensesError}</div> : null}
        </>
      )}

      {hasNoExpenses ? (
        <EmptyDashboardState />
      ) : (
        <>
          {!isDashboardLoading && (
            <DateRangeFilter
              dateRange={dateRange}
              onDateRangeChange={setDateRange}
            />
          )}

          <DashboardCharts
            isLoading={isDashboardLoading}
            chartError={chartError}
            hasData={hasData}
            monthlyTrendData={monthlyTrendData}
            categoryData={categoryData}
            overviewMetrics={overviewMetrics}
            dateRange={dateRange}
          />

          {!isDashboardLoading && (
            <>
              <RecentExpenses
                expenses={recent}
                onDelete={requestExpenseDelete}
                error={expensesError}
              />

              <UpcomingRecurringExpenses />

              <AllowanceSection
                allowance={allowance}
                allowanceStatus={allowanceStatus}
                allowanceError={allowanceError}
                savingAllowance={savingAllowance}
                onChange={handleAllowanceChange}
                onSubmit={handleAllowanceSubmit}
              />
            </>
          )}
        </>
      )}

      <Modal
        open={Boolean(confirmExpense)}
        onClose={() => setConfirmExpense(null)}
        title="Delete expense"
        description="This will permanently remove the selected expense."
      >
        {confirmExpense ? (
          <div className="modal-detail-card">
            <div className="modal-detail-header">
              <div>
                <p className="modal-detail-title">{confirmExpense.category || 'Uncategorized'}</p>
                <p className="modal-detail-meta">Date: {confirmExpense.date ? formatDate(confirmExpense.date) : '—'}</p>
              </div>
              {typeof confirmExpense.amount === 'number' ? (
                <p className="modal-detail-amount">{formatCurrency(confirmExpense.amount)}</p>
              ) : null}
            </div>
            <p className="modal-detail-note">{confirmExpense.note || 'No note provided.'}</p>
          </div>
        ) : null}

        <p className="modal-message">Delete expense?</p>
        <ModalActions>
          <button
            type="button"
            className="button ghost"
            onClick={() => setConfirmExpense(null)}
            disabled={deletingExpense}
          >
            Cancel
          </button>
          <LoadingButton
            type="button"
            variant="primary"
            onClick={handleExpenseDelete}
            loading={deletingExpense}
            loadingText="Deleting..."
          >
            Delete expense
          </LoadingButton>
        </ModalActions>
      </Modal>
    </div>
  );
}

export default function Home() {
  const { data: session, status } = useSession();

  // Show loading state
  if (status === 'loading') {
    return <LoadingScreen message="" />;
  }

  // Show landing page if not authenticated
  if (!session) {
    return <LandingPage />;
  }

  // Show dashboard if authenticated
  return (
    <AuthGate>
      <Dashboard />
    </AuthGate>
  );
}
