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

  // Custom label to show percentages with white color
  const renderLabel = (entry) => {
    const RADIAN = Math.PI / 180;
    const { cx, cy, midAngle, outerRadius, percentage } = entry;
    const radius = outerRadius + 10;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);

    return (
      <text
        x={x}
        y={y}
        fill="#ffffff"
        textAnchor={x > cx ? 'start' : 'end'}
        dominantBaseline="central"
        fontSize="14px"
        fontWeight="600"
      >
        {`${percentage}%`}
      </text>
    );
  };

  // Custom tooltip
  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      return (
        <div className="chart-tooltip">
          <p className="chart-tooltip-title">
            {payload[0].payload.category}
          </p>
          <p className="chart-tooltip-value" style={{ color: payload[0].payload.color }}>
            {formatCurrency(payload[0].value * 100)}
          </p>
          <p className="chart-tooltip-subtitle">
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
      <ul className="chart-legend">
        {payload.map((entry, index) => (
          <li key={`legend-${index}`} className="chart-legend-item">
            <span
              className="chart-legend-dot"
              style={{ background: entry.color }}
            />
            <span>{entry.payload.category}</span>
          </li>
        ))}
      </ul>
    );
  };

  return (
    <div className="chart-wrapper">
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
