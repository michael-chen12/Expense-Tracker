'use client';

import Spinner from '@/components/Spinner';
import OverviewCard from '@/components/charts/OverviewCard';
import ChartCard from '@/components/charts/ChartCard';
import ChartEmptyState from '@/components/charts/ChartEmptyState';
import SpendingTrendChart from '@/components/charts/SpendingTrendChart';
import CategoryBreakdownChart from '@/components/charts/CategoryBreakdownChart';
import BudgetProgressBar from '@/components/charts/BudgetProgressBar';

export default function DashboardCharts({
  isLoading,
  chartError,
  hasData,
  monthlyTrendData,
  categoryData,
  overviewMetrics
}) {
  if (isLoading) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '60px 20px', gap: '16px' }}>
        <Spinner size="large" color="primary" />
      </div>
    );
  }

  return (
    <>
      {/* Show chart error if any */}
      {chartError && (
        <div className="error" style={{ marginBottom: '24px' }}>
          {chartError}
        </div>
      )}

      {/* Overview Cards */}
      {hasData && (
        <div className="overview-cards">
          <OverviewCard
            label="Total Spent This Month"
            value={overviewMetrics.totalSpentThisMonth}
            isAccent={true}
          />
          <OverviewCard
            label="Allowance Remaining"
            value={overviewMetrics.allowanceRemaining}
          />
          <OverviewCard
            label="Monthly Fixed Costs"
            value={overviewMetrics.monthlyFixedCosts}
          />
        </div>
      )}

      {/* Charts Section */}
      {hasData && (
        <div className="charts-grid">
          <ChartCard
            title="Spending Trend"
            isEmpty={monthlyTrendData.length === 0}
            emptyState={<ChartEmptyState />}
          >
            <SpendingTrendChart data={monthlyTrendData} />
          </ChartCard>

          <ChartCard
            title="Category Breakdown"
            isEmpty={categoryData.length === 0}
            emptyState={<ChartEmptyState />}
          >
            <CategoryBreakdownChart data={categoryData} />
          </ChartCard>
        </div>
      )}

      {/* Budget Progress Bar */}
      {hasData && overviewMetrics.allowanceCents > 0 && (
        <BudgetProgressBar
          spent={overviewMetrics.totalSpentCents}
          allowance={overviewMetrics.allowanceCents}
        />
      )}
    </>
  );
}
