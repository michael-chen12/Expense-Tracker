'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import AuthGate from '@/components/AuthGate';
import LandingPage from '@/components/LandingPage';
import LoadingScreen from '@/components/LoadingScreen';
import { Button } from '@/components/Button';
import { Modal, ModalActions } from '@/components/Modal';
import {
  getExpenses,
  deleteExpense,
  getAllowanceSettings,
  getAllowanceStatus,
  setAllowanceSettings
} from '@/lib/api-backend';
import { formatCurrency, formatDate } from '@/lib/format';
import { useChartData } from '@/lib/hooks/useChartData';
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
  const [recent, setRecent] = useState([]);
  const [allExpenses, setAllExpenses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingAllowance, setLoadingAllowance] = useState(true);
  const [error, setError] = useState('');
  const [allowance, setAllowance] = useState({ amount: '', cadence: 'month' });
  const [allowanceStatus, setAllowanceStatus] = useState(null);
  const [allowanceError, setAllowanceError] = useState('');
  const [savingAllowance, setSavingAllowance] = useState(false);
  const [dateRange, setDateRange] = useState(getMonthRange());
  const [confirmExpense, setConfirmExpense] = useState(null);
  const [deletingExpense, setDeletingExpense] = useState(false);

  // Check if all dashboard data is loaded
  const isDashboardLoading = loading || loadingAllowance;

  // Process data for charts using custom hook
  const { monthlyTrendData, categoryData, overviewMetrics, hasData, isLoading: isLoadingCharts, error: chartError } = useChartData(
    allExpenses,
    allowanceStatus,
    isDashboardLoading,
    dateRange
  );

  useEffect(() => {
    // Fetch recent expenses for the recent expenses widget
    getExpenses({ pageSize: 5 })
      .then((expenseData) => {
        setRecent(expenseData.items || []);
        setError('');
      })
      .catch((fetchError) => {
        setError(fetchError.message || 'Unable to load dashboard.');
      })
      .finally(() => {
        setLoading(false);
      });

    // Fetch all expenses for charts (no pagination limit)
    getExpenses({ pageSize: 1000 })
      .then((expenseData) => {
        setAllExpenses(expenseData.items || []);
      })
      .catch((fetchError) => {
        console.error('Unable to load expenses for charts:', fetchError);
      });
  }, []);

  useEffect(() => {
    if (!userId) {
      setLoadingAllowance(false);
      return;
    }

    setLoadingAllowance(true);

    // Load allowance settings from backend
    Promise.all([
      getAllowanceSettings(),
      getAllowanceStatus()
    ])
      .then(([settings, status]) => {
        console.log('[Dashboard] Loaded settings:', settings);
        console.log('[Dashboard] Loaded allowanceStatus:', status);
        setAllowance({
          amount: String(settings.amount),
          cadence: settings.cadence
        });
        setAllowanceStatus(status);
        setAllowanceError('');
      })
      .catch((fetchError) => {
        console.error('[Dashboard] Error loading allowance:', fetchError);
        setAllowanceError(fetchError.message || 'Unable to load allowance settings.');
      })
      .finally(() => {
        setLoadingAllowance(false);
      });
  }, [userId]);


  const handleAllowanceChange = (event) => {
    const { name, value } = event.target;
    setAllowance((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  const handleAllowanceSubmit = async (event) => {
    event.preventDefault();
    setAllowanceError('');
    setSavingAllowance(true);

    try {
      const saved = await setAllowanceSettings({
        amount: allowance.amount,
        cadence: allowance.cadence
      });
      setAllowance({
        amount: String(saved.amount),
        cadence: saved.cadence
      });
      const status = await getAllowanceStatus();
      setAllowanceStatus(status);
    } catch (submitError) {
      setAllowanceError(submitError.message || 'Unable to save allowance.');
    } finally {
      setSavingAllowance(false);
    }
  };
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
      await deleteExpense(confirmExpense.id);
      // Refresh recent expenses
      const recentData = await getExpenses({ pageSize: 5 });
      setRecent(recentData.items || []);
      // Refresh all expenses for charts
      const allData = await getExpenses({ pageSize: 1000 });
      setAllExpenses(allData.items || []);
      setError('');
    } catch (deleteError) {
      setError(deleteError.message || 'Unable to delete expense.');
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

          {error ? <div className="error">{error}</div> : null}
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
                error={error}
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
          <button
            type="button"
            className="button primary"
            onClick={handleExpenseDelete}
            disabled={deletingExpense}
          >
            {deletingExpense ? (
              <span className="button-loading-content">
                <Spinner size="small" color="white" />
                Deleting...
              </span>
            ) : 'Delete expense'}
          </button>
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
