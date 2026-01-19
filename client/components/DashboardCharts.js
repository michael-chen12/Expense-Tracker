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
        <div className="chart-info" style={{
          marginBottom: '20px',
          padding: '12px 16px',
          background: '#fff8f0',
          border: '1px solid #ffd699',
          borderRadius: '8px',
          fontSize: '14px',
          color: '#6b645b',
          display: 'flex',
          alignItems: 'center',
          gap: '8px'
        }}>
          <span style={{ fontSize: '16px' }}>ℹ️</span>
          <span>Some months show $0 because no expenses were recorded during that period</span>
        </div>
      )}

      {/* Onboarding tip for users with limited data */}
      {hasData && monthlyTrendData.length < 3 && (
        <div className="chart-tip" style={{
          marginBottom: '20px',
          padding: '12px 16px',
          background: '#f0f9ff',
          border: '1px solid #bae6fd',
          borderRadius: '8px',
          fontSize: '14px',
          color: '#6b645b',
          display: 'flex',
          alignItems: 'center',
          gap: '8px'
        }}>
          <span style={{ fontSize: '16px' }}>💡</span>
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
