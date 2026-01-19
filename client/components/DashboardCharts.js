'use client';

import Spinner from '@/components/Spinner';
import { OverviewCard, ChartCard } from '@/components/Card';
import ChartEmptyState from '@/components/Charts/ChartEmptyState';
import { SpendingTrendChart, CategoryBreakdownChart, BudgetProgressBar } from '@/components/Charts';

export default function DashboardCharts({
  isLoading,
  chartError,
  hasData,
  monthlyTrendData,
  categoryData,
  overviewMetrics,
  dateRange
}) {
  if (isLoading) {
    return (
      <div className="chart-loading">
        <Spinner size="large" color="primary" />
      </div>
    );
  }

  return (
    <>
      {/* Show chart error if any */}
      {chartError && (
        <div className="error chart-error">
          {chartError}
        </div>
      )}

      {/* Overview Cards */}
      {hasData && (
        <div className="overview-cards">
          <OverviewCard
            label={dateRange ? `Total Spent (${dateRange.label})` : "Total Spent"}
            value={overviewMetrics.totalSpentThisMonth}
            isAccent={true}
          />
          <OverviewCard
            label="Allowance Remaining"
            value={overviewMetrics.allowanceRemaining}
          />
        </div>
      )}

      {/* Info message for months with no expenses */}
      {hasData && monthlyTrendData.some(m => m.count === 0) && (
        <div className="chart-info">
          <span className="chart-info-icon">ℹ️</span>
          <span>Some months show $0 because no expenses were recorded during that period</span>
        </div>
      )}

      {/* Onboarding tip for users with limited data */}
      {hasData && monthlyTrendData.length < 3 && (
        <div className="chart-tip">
          <span className="chart-tip-icon">💡</span>
          <span>Your spending trends will become more insightful as you track more expenses over time</span>
        </div>
      )}

      {/* Charts Section */}
      {hasData && (
        <div className="charts-grid">
          <ChartCard
            title={dateRange ? `Spending Trend (${dateRange.label})` : "Spending Trend"}
            isEmpty={monthlyTrendData.length === 0}
            emptyState={<ChartEmptyState />}
          >
            <SpendingTrendChart data={monthlyTrendData} />
          </ChartCard>

          <ChartCard
            title={dateRange ? `Category Breakdown (${dateRange.label})` : "Category Breakdown"}
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
