'use client';

import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { formatCurrency } from '@/lib/chart-utils';
import './Charts.css';

/**
 * Spending Trend Chart - Shows spending over the last 6 months
 * Uses an area chart with gradient fill for visual appeal
 */
export default function SpendingTrendChart({ data }) {
  // Custom tooltip component
  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const isEmptyMonth = payload[0].payload.count === 0;
      return (
        <div className="chart-tooltip">
          <p className="chart-tooltip-title">
            {payload[0].payload.monthLabel}
          </p>
          <p className={`chart-tooltip-value ${isEmptyMonth ? 'chart-tooltip-value--muted' : 'chart-tooltip-value--primary'}`}>
            {formatCurrency(payload[0].value * 100)}
          </p>
          <p className="chart-tooltip-subtitle">
            {isEmptyMonth
              ? 'No expenses recorded'
              : `${payload[0].payload.count} ${payload[0].payload.count === 1 ? 'expense' : 'expenses'}`
            }
          </p>
        </div>
      );
    }
    return null;
  };

  // Custom Y-axis tick formatter
  const formatYAxis = (value) => {
    if (value >= 1000) {
      return `$${(value / 1000).toFixed(1)}k`;
    }
    return `$${value}`;
  };

  // Custom dot component to highlight zero-value months
  const CustomDot = (props) => {
    const { cx, cy, payload } = props;
    const isEmptyMonth = payload.count === 0;

    if (isEmptyMonth) {
      return (
        <circle
          cx={cx}
          cy={cy}
          r={4}
          fill="#ffffff"
          stroke="#9ca3af"
          strokeWidth={2}
          strokeDasharray="2,2"
        />
      );
    }

    return (
      <circle
        cx={cx}
        cy={cy}
        r={4}
        fill="#7c3aed"
        stroke="#ffffff"
        strokeWidth={2}
      />
    );
  };

  return (
    <div className="chart-wrapper">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart
          data={data}
          margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
          aria-label="Spending trend over the last 6 months"
        >
          <defs>
            <linearGradient id="colorSpending" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#7c3aed" stopOpacity={0.3} />
              <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0.1} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#2a2a40" />
          <XAxis
            dataKey="monthLabel"
            tick={{ fill: '#d1d5db', fontSize: 12 }}
            tickLine={false}
            axisLine={{ stroke: '#2a2a40' }}
          />
          <YAxis
            tick={{ fill: '#d1d5db', fontSize: 12 }}
            tickLine={false}
            axisLine={{ stroke: '#2a2a40' }}
            tickFormatter={formatYAxis}
          />
          <Tooltip content={<CustomTooltip />} cursor={{ stroke: '#7c3aed', strokeWidth: 1 }} />
          <Area
            type="monotone"
            dataKey="total"
            stroke="#7c3aed"
            strokeWidth={2}
            fillOpacity={1}
            fill="url(#colorSpending)"
            animationDuration={600}
            dot={<CustomDot />}
            activeDot={{ r: 6 }}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
