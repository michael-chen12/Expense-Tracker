'use client';

import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';
import { formatCurrency } from '@/lib/chart-utils';
import './Charts.css';

/**
 * Category Breakdown Chart - Shows spending distribution by category
 * Uses a donut chart (pie with center cutout) for visual appeal
 */
export default function CategoryBreakdownChart({ data }) {
  // Calculate total for center display (data.total is already in dollars)
  const totalCents = data.reduce((sum, item) => sum + item.total * 100, 0);

  // Custom label to show percentages
  const renderLabel = (entry) => {
    return `${entry.percentage}%`;
  };

  // Custom tooltip
  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
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
            {payload[0].payload.category}
          </p>
          <p
            style={{
              margin: '0',
              fontSize: '16px',
              fontWeight: '700',
              color: payload[0].payload.color,
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
            {payload[0].payload.percentage}% of total
          </p>
        </div>
      );
    }
    return null;
  };

  // Custom legend
  const renderLegend = (props) => {
    const { payload } = props;
    return (
      <ul
        style={{
          listStyle: 'none',
          padding: 0,
          margin: '16px 0 0',
          display: 'flex',
          flexWrap: 'wrap',
          gap: '12px',
          justifyContent: 'center',
        }}
      >
        {payload.map((entry, index) => (
          <li
            key={`legend-${index}`}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              fontSize: '12px',
              color: '#6b645b',
            }}
          >
            <span
              style={{
                display: 'inline-block',
                width: '12px',
                height: '12px',
                borderRadius: '50%',
                background: entry.color,
              }}
            />
            <span>{entry.payload.category}</span>
          </li>
        ))}
      </ul>
    );
  };

  return (
    <div style={{ width: '100%', height: 280 }}>
      <ResponsiveContainer width="100%" height="100%">
        <PieChart aria-label="Category spending breakdown for current month">
          <Pie
            data={data}
            cx="50%"
            cy="45%"
            labelLine={false}
            label={renderLabel}
            outerRadius={80}
            innerRadius={50}
            fill="#8884d8"
            dataKey="total"
            animationDuration={600}
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} />
            ))}
          </Pie>
          <Tooltip content={<CustomTooltip />} />
          <Legend content={renderLegend} />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}
