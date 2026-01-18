'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import AuthGate from '@/components/AuthGate';
import LandingPage from '@/components/LandingPage';
import LoadingScreen from '@/components/LoadingScreen';
import {
  getExpenses,
  createFixedCost,
  deleteFixedCost,
  deleteExpense,
  getAllowanceSettings,
  getAllowanceStatus,
  getFixedCosts,
  setAllowanceSettings
} from '@/lib/api-backend';
import { useChartData } from '@/lib/hooks/useChartData';
import DashboardCharts from '@/components/DashboardCharts';
import RecentExpenses from '@/components/RecentExpenses';
import AllowanceSection from '@/components/AllowanceSection';
import FixedCostsSection from '@/components/FixedCostsSection';

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
  const [loadingFixedCosts, setLoadingFixedCosts] = useState(true);
  const [error, setError] = useState('');
  const [allowance, setAllowance] = useState({ amount: '', cadence: 'month' });
  const [allowanceStatus, setAllowanceStatus] = useState(null);
  const [allowanceError, setAllowanceError] = useState('');
  const [savingAllowance, setSavingAllowance] = useState(false);
  const [fixedCosts, setFixedCosts] = useState([]);
  const [fixedCostForm, setFixedCostForm] = useState({ name: '', amount: '' });
  const [fixedCostError, setFixedCostError] = useState('');
  const [savingFixedCost, setSavingFixedCost] = useState(false);

  // Check if all dashboard data is loaded
  const isDashboardLoading = loading || loadingAllowance || loadingFixedCosts;

  // Process data for charts using custom hook
  const { monthlyTrendData, categoryData, overviewMetrics, hasData, isLoading: isLoadingCharts, error: chartError } = useChartData(
    allExpenses,
    allowanceStatus,
    fixedCosts,
    isDashboardLoading
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
        setAllowance({
          amount: String(settings.amount),
          cadence: settings.cadence
        });
        setAllowanceStatus(status);
        setAllowanceError('');
      })
      .catch((fetchError) => {
        setAllowanceError(fetchError.message || 'Unable to load allowance settings.');
      })
      .finally(() => {
        setLoadingAllowance(false);
      });
  }, [userId]);

  useEffect(() => {
    if (!userId) {
      setLoadingFixedCosts(false);
      return;
    }

    setLoadingFixedCosts(true);

    getFixedCosts()
      .then((items) => {
        setFixedCosts(items);
        setFixedCostError('');
      })
      .catch((fetchError) => {
        setFixedCostError(fetchError.message || 'Unable to load fixed costs.');
      })
      .finally(() => {
        setLoadingFixedCosts(false);
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

  const handleFixedCostChange = (event) => {
    const { name, value } = event.target;
    setFixedCostForm((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  const handleFixedCostSubmit = async (event) => {
    event.preventDefault();
    setFixedCostError('');
    setSavingFixedCost(true);

    try {
      await createFixedCost({
        name: fixedCostForm.name,
        amount: Number(fixedCostForm.amount)
      });
      const items = await getFixedCosts();
      setFixedCosts(items);
      setFixedCostForm({ name: '', amount: '' });
    } catch (submitError) {
      setFixedCostError(submitError.message || 'Unable to save fixed cost.');
    } finally {
      setSavingFixedCost(false);
    }
  };

  const handleFixedCostDelete = async (itemId) => {
    const confirmed = window.confirm('Delete this fixed cost?');
    if (!confirmed) {
      return;
    }

    try {
      await deleteFixedCost(itemId);
      const items = await getFixedCosts();
      setFixedCosts(items);
    } catch (deleteError) {
      setFixedCostError(deleteError.message || 'Unable to delete fixed cost.');
    }
  };

  const handleExpenseDelete = async (expenseId) => {
    const confirmed = window.confirm('Delete this expense?');
    if (!confirmed) {
      return;
    }

    try {
      await deleteExpense(expenseId);
      // Refresh recent expenses
      const recentData = await getExpenses({ pageSize: 5 });
      setRecent(recentData.items || []);
      // Refresh all expenses for charts
      const allData = await getExpenses({ pageSize: 1000 });
      setAllExpenses(allData.items || []);
      setError('');
    } catch (deleteError) {
      setError(deleteError.message || 'Unable to delete expense.');
    }
  };

  const month = getMonthRange().label;
  return (
    <div>
      {!isDashboardLoading && (
        <>
          <div className="page-header">
            <div>
              <h1>Dashboard</h1>
              <p className="subtle">{month} snapshot of your spending.</p>
            </div>
            <Link className="button primary" href="/expenses/new">Add expense</Link>
          </div>

          {error ? <div className="error">{error}</div> : null}
        </>
      )}

      <DashboardCharts
        isLoading={isDashboardLoading}
        chartError={chartError}
        hasData={hasData}
        monthlyTrendData={monthlyTrendData}
        categoryData={categoryData}
        overviewMetrics={overviewMetrics}
      />

      {!isDashboardLoading && (
        <>
          <RecentExpenses
            expenses={recent}
            onDelete={handleExpenseDelete}
            error={error}
          />

          <AllowanceSection
            allowance={allowance}
            allowanceStatus={allowanceStatus}
            allowanceError={allowanceError}
            savingAllowance={savingAllowance}
            onChange={handleAllowanceChange}
            onSubmit={handleAllowanceSubmit}
          />

          <FixedCostsSection
            fixedCosts={fixedCosts}
            fixedCostForm={fixedCostForm}
            fixedCostError={fixedCostError}
            savingFixedCost={savingFixedCost}
            onChange={handleFixedCostChange}
            onSubmit={handleFixedCostSubmit}
            onDelete={handleFixedCostDelete}
          />
        </>
      )}
    </div>
  );
}

export default function Home() {
  const { data: session, status } = useSession();

  // Show loading state
  if (status === 'loading') {
    return <LoadingScreen message="Loading your dashboard..." />;
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
