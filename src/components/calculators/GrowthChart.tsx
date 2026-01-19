/**
 * Growth Chart Component
 *
 * Visualizes investment growth over time using Recharts.
 * Used across multiple calculators to show progression.
 */

'use client';

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Area,
  AreaChart,
  Legend,
} from 'recharts';
import { formatCurrency, formatNumber } from '@/lib/utils';

interface DataPoint {
  label: string | number;
  value: number;
  secondaryValue?: number;
}

interface GrowthChartProps {
  /** Data points to display */
  data: DataPoint[];
  /** Label for the X axis */
  xAxisLabel?: string;
  /** Label for the Y axis */
  yAxisLabel?: string;
  /** Label for the primary line */
  primaryLabel?: string;
  /** Label for the secondary line (if present) */
  secondaryLabel?: string;
  /** Chart type */
  type?: 'line' | 'area';
  /** Height of the chart */
  height?: number;
  /** Whether to format Y axis as currency */
  formatAsCurrency?: boolean;
}

/**
 * Custom tooltip component for the chart.
 */
function CustomTooltip({
  active,
  payload,
  label,
  formatAsCurrency,
  primaryLabel,
  secondaryLabel,
}: {
  active?: boolean;
  payload?: Array<{ value: number; dataKey: string }>;
  label?: string | number;
  formatAsCurrency?: boolean;
  primaryLabel?: string;
  secondaryLabel?: string;
}) {
  if (!active || !payload || !payload.length) {
    return null;
  }

  const formatValue = (value: number) =>
    formatAsCurrency ? formatCurrency(value) : formatNumber(value);

  return (
    <div className="rounded-lg border border-gray-200 bg-white p-3 shadow-lg">
      <p className="mb-1 font-medium text-gray-900">{label}</p>
      {payload.map((entry, index) => (
        <p key={index} className="text-sm text-gray-600">
          <span
            className="mr-2 inline-block h-3 w-3 rounded-full"
            style={{ backgroundColor: index === 0 ? '#3b82f6' : '#10b981' }}
          />
          {entry.dataKey === 'value' ? primaryLabel || 'Value' : secondaryLabel || 'Secondary'}:{' '}
          <span className="font-medium">{formatValue(entry.value)}</span>
        </p>
      ))}
    </div>
  );
}

/**
 * Line or area chart for showing growth over time.
 */
export function GrowthChart({
  data,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  xAxisLabel = 'Year',
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  yAxisLabel = 'Value',
  primaryLabel = 'Balance',
  secondaryLabel,
  type = 'area',
  height = 300,
  formatAsCurrency = true,
}: GrowthChartProps) {
  // Check if we have secondary values
  const hasSecondary = data.some((d) => d.secondaryValue !== undefined);

  // Format Y axis tick
  const formatYAxis = (value: number) => {
    if (formatAsCurrency) {
      if (value >= 1000000) {
        return `$${(value / 1000000).toFixed(1)}M`;
      }
      if (value >= 1000) {
        return `$${(value / 1000).toFixed(0)}K`;
      }
      return `$${value}`;
    }
    return formatNumber(value);
  };

  const ChartComponent = type === 'area' ? AreaChart : LineChart;

  return (
    <div style={{ width: '100%', height }}>
      <ResponsiveContainer>
        <ChartComponent
          data={data}
          margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
        >
          <defs>
            <linearGradient id="primaryGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
              <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
            </linearGradient>
            <linearGradient id="secondaryGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
              <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
          <XAxis
            dataKey="label"
            tick={{ fontSize: 12, fill: '#6b7280' }}
            axisLine={{ stroke: '#d1d5db' }}
          />
          <YAxis
            tickFormatter={formatYAxis}
            tick={{ fontSize: 12, fill: '#6b7280' }}
            axisLine={{ stroke: '#d1d5db' }}
            width={65}
          />
          <Tooltip
            content={
              <CustomTooltip
                formatAsCurrency={formatAsCurrency}
                primaryLabel={primaryLabel}
                secondaryLabel={secondaryLabel}
              />
            }
          />
          {hasSecondary && (
            <Legend
              wrapperStyle={{ fontSize: '12px' }}
              formatter={(value) =>
                value === 'value' ? primaryLabel : secondaryLabel
              }
            />
          )}
          {type === 'area' ? (
            <>
              <Area
                type="monotone"
                dataKey="value"
                stroke="#3b82f6"
                strokeWidth={2}
                fill="url(#primaryGradient)"
                name="value"
              />
              {hasSecondary && (
                <Area
                  type="monotone"
                  dataKey="secondaryValue"
                  stroke="#10b981"
                  strokeWidth={2}
                  fill="url(#secondaryGradient)"
                  name="secondaryValue"
                />
              )}
            </>
          ) : (
            <>
              <Line
                type="monotone"
                dataKey="value"
                stroke="#3b82f6"
                strokeWidth={2}
                dot={{ fill: '#3b82f6', r: 4 }}
                activeDot={{ r: 6 }}
                name="value"
              />
              {hasSecondary && (
                <Line
                  type="monotone"
                  dataKey="secondaryValue"
                  stroke="#10b981"
                  strokeWidth={2}
                  dot={{ fill: '#10b981', r: 4 }}
                  activeDot={{ r: 6 }}
                  name="secondaryValue"
                />
              )}
            </>
          )}
        </ChartComponent>
      </ResponsiveContainer>
    </div>
  );
}
