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
        <div
          style={{
            background: '#ffffff',
            border: '1px solid #e5dccf',
            borderRadius: '12px',
            padding: '12px 16px',
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
          }}
        >
          <p
            style={{
              margin: '0 0 4px',
              fontWeight: '600',
              fontSize: '14px',
              color: '#1b1b1b',
            }}
          >
            {payload[0].payload.monthLabel}
          </p>
          <p
            style={{
              margin: '0',
              fontSize: '16px',
              fontWeight: '700',
              color: isEmptyMonth ? '#9ca3af' : '#ff7a00',
            }}
          >
            {formatCurrency(payload[0].value * 100)}
          </p>
          <p
            style={{
              margin: '4px 0 0',
              fontSize: '12px',
              color: '#6b645b',
            }}
          >
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
        fill="#ff7a00"
        stroke="#ffffff"
        strokeWidth={2}
      />
    );
  };

  return (
    <div style={{ width: '100%', height: 280 }}>
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart
          data={data}
          margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
          aria-label="Spending trend over the last 6 months"
        >
          <defs>
            <linearGradient id="colorSpending" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#ff7a00" stopOpacity={0.3} />
              <stop offset="95%" stopColor="#fff0dc" stopOpacity={0.1} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#e5dccf" />
          <XAxis
            dataKey="monthLabel"
            tick={{ fill: '#6b645b', fontSize: 12 }}
            tickLine={false}
            axisLine={{ stroke: '#e5dccf' }}
          />
          <YAxis
            tick={{ fill: '#6b645b', fontSize: 12 }}
            tickLine={false}
            axisLine={{ stroke: '#e5dccf' }}
            tickFormatter={formatYAxis}
          />
          <Tooltip content={<CustomTooltip />} cursor={{ stroke: '#ff7a00', strokeWidth: 1 }} />
          <Area
            type="monotone"
            dataKey="total"
            stroke="#ff7a00"
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
