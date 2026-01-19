/**
 * Candlestick Chart Component
 *
 * A visual chart that shows how a stock's price moved during each day.
 * Each "candlestick" shows four important prices:
 * - Open: The price when trading started that day
 * - High: The highest price during the day
 * - Low: The lowest price during the day
 * - Close: The price when trading ended that day
 *
 * Colors explained for young learners:
 * - GREEN candle = The stock went UP that day (closed higher than it opened)
 * - RED candle = The stock went DOWN that day (closed lower than it opened)
 *
 * The thick part (the "body") shows the open and close prices.
 * The thin lines (the "wicks" or "shadows") show the high and low prices.
 *
 * Think of it like a thermometer for stock prices each day!
 */

'use client';

import { useMemo, useState, useCallback, memo } from 'react';
import {
  ResponsiveContainer,
  ComposedChart,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ReferenceLine,
  Bar,
  Cell,
} from 'recharts';
import { cn } from '@/lib/utils';
import { formatCurrency } from '@/lib/utils';

// =============================================================================
// TYPES & INTERFACES
// =============================================================================

/**
 * OHLC = Open, High, Low, Close
 * These are the four prices that make up each candlestick.
 */
export interface OHLCData {
  /** The date for this candle (e.g., "Jan 15") */
  date: string;
  /** The price when the market opened */
  open: number;
  /** The highest price during the day */
  high: number;
  /** The lowest price during the day */
  low: number;
  /** The price when the market closed */
  close: number;
  /** Optional: Trading volume for the day */
  volume?: number;
}

export interface CandlestickChartProps {
  /** The stock symbol (e.g., "AAPL" for Apple) */
  symbol: string;
  /** Additional CSS class names for styling */
  className?: string;
  /** Height of the chart in pixels (default: 300) */
  height?: number;
  /** Custom data to display (uses mock data if not provided) */
  data?: OHLCData[];
}

// =============================================================================
// CONSTANTS
// =============================================================================

/** Color for stocks that went UP (green is good!) */
const UP_COLOR = '#22c55e'; // Tailwind green-500

/** Color for stocks that went DOWN (red means down) */
const DOWN_COLOR = '#ef4444'; // Tailwind red-500

// =============================================================================
// MOCK DATA GENERATOR
// =============================================================================

/**
 * Generates realistic-looking fake stock data for the past several days.
 * This is used for learning since real historical data requires a paid API.
 *
 * How it works:
 * 1. Starts with a base price (like $150 for Apple)
 * 2. Each day, the price moves randomly up or down
 * 3. Creates realistic high/low ranges around the open/close
 */
function generateMockOHLCData(symbol: string, days: number = 7): OHLCData[] {
  // Different stocks start at different prices
  // These are approximate real prices to make it feel realistic
  const basePrices: Record<string, number> = {
    AAPL: 175,
    GOOGL: 140,
    MSFT: 380,
    AMZN: 180,
    TSLA: 250,
    META: 500,
    NVDA: 480,
  };

  // Use the stock's base price, or a default of $100
  let price = basePrices[symbol.toUpperCase()] || 100;

  // Use a seeded random for consistent results per symbol
  // This way the same symbol always shows the same pattern
  const seed = symbol.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
  const seededRandom = (index: number) => {
    const x = Math.sin(seed + index * 1000) * 10000;
    return x - Math.floor(x);
  };

  const data: OHLCData[] = [];
  const today = new Date();
  let dayIndex = 0;

  for (let i = days - 1; i >= 0; i--) {
    // Calculate the date for this candle
    const date = new Date(today);
    date.setDate(date.getDate() - i);

    // Skip weekends (stock market is closed on Saturday/Sunday)
    const dayOfWeek = date.getDay();
    if (dayOfWeek === 0 || dayOfWeek === 6) {
      continue;
    }

    // Format the date nicely (e.g., "Jan 15")
    const dateStr = date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
    });

    // Generate random price movement (-3% to +3% change)
    const changePercent = (seededRandom(dayIndex) - 0.5) * 0.06;
    const open = price;
    const close = price * (1 + changePercent);

    // High is always above both open and close
    // Low is always below both open and close
    const bodyHigh = Math.max(open, close);
    const bodyLow = Math.min(open, close);
    const wickSize = (bodyHigh - bodyLow) * (0.2 + seededRandom(dayIndex + 100) * 0.8);

    const high = bodyHigh + wickSize * seededRandom(dayIndex + 200);
    const low = bodyLow - wickSize * seededRandom(dayIndex + 300);

    // Generate a realistic trading volume (in millions)
    const volume = Math.floor(10000000 + seededRandom(dayIndex + 400) * 40000000);

    data.push({
      date: dateStr,
      open: Number(open.toFixed(2)),
      high: Number(high.toFixed(2)),
      low: Number(low.toFixed(2)),
      close: Number(close.toFixed(2)),
      volume,
    });

    // Update price for next iteration
    price = close;
    dayIndex++;
  }

  return data;
}

// =============================================================================
// CUSTOM CANDLESTICK SHAPE
// =============================================================================

/**
 * Custom SVG shape that renders a single candlestick.
 * This is used by Recharts' Bar component to draw each candle.
 *
 * Anatomy of a candlestick:
 *
 *       |  <- Upper wick (shows highest price)
 *     -----
 *     |   |  <- Body (shows open & close)
 *     -----
 *       |  <- Lower wick (shows lowest price)
 */
/**
 * Extended OHLC data with computed values for rendering
 */
interface EnhancedOHLCData extends OHLCData {
  /** Dummy value for Bar component */
  value: number;
  /** Whether the price went up (close >= open) */
  isUp: boolean;
  /** Minimum Y value for the chart */
  yMin: number;
  /** Maximum Y value for the chart */
  yMax: number;
  /** Available height for drawing candles */
  chartHeight: number;
}

interface CandlestickShapeProps {
  x?: number;
  y?: number;
  width?: number;
  height?: number;
  payload?: EnhancedOHLCData;
}

function CandlestickShape(props: CandlestickShapeProps) {
  const { x, width, payload } = props;

  if (x === undefined || width === undefined || !payload) {
    return null;
  }

  const { high, low, open, close, isUp } = payload;
  const color = isUp ? UP_COLOR : DOWN_COLOR;

  // Get the Y-axis domain and chart height from the data
  const yMin = payload.yMin || 0;
  const yMax = payload.yMax || 100;
  const chartHeight = payload.chartHeight || 240;

  // Convert price to Y coordinate
  const priceRange = yMax - yMin;
  const toY = (price: number) => {
    return chartHeight - ((price - yMin) / priceRange) * chartHeight;
  };

  // Calculate Y positions for each price point
  const yHigh = toY(high);
  const yLow = toY(low);
  const yOpen = toY(open);
  const yClose = toY(close);

  const bodyTop = Math.min(yOpen, yClose);
  const bodyHeight = Math.max(Math.abs(yClose - yOpen), 2); // Minimum 2px for visibility
  const centerX = x + width / 2;
  const candleWidth = Math.max(width * 0.7, 6); // At least 6px wide

  return (
    <g>
      {/* Upper wick - line from body top to high */}
      <line
        x1={centerX}
        y1={yHigh}
        x2={centerX}
        y2={bodyTop}
        stroke={color}
        strokeWidth={1.5}
      />

      {/* Lower wick - line from body bottom to low */}
      <line
        x1={centerX}
        y1={bodyTop + bodyHeight}
        x2={centerX}
        y2={yLow}
        stroke={color}
        strokeWidth={1.5}
      />

      {/* Body rectangle */}
      <rect
        x={centerX - candleWidth / 2}
        y={bodyTop}
        width={candleWidth}
        height={bodyHeight}
        fill={color}
        stroke={color}
        strokeWidth={1}
        rx={1}
      />
    </g>
  );
}

// =============================================================================
// CUSTOM TOOLTIP
// =============================================================================

/**
 * Educational tooltip that explains what the user is looking at.
 * Shows all four prices and explains if it was an up or down day.
 */
interface TooltipPayload {
  payload: OHLCData;
}

interface CustomTooltipProps {
  active?: boolean;
  payload?: TooltipPayload[];
  label?: string;
}

const CandlestickTooltip = memo(function CandlestickTooltip({
  active,
  payload,
}: CustomTooltipProps) {
  if (!active || !payload || !payload.length) {
    return null;
  }

  const data = payload[0].payload;
  const isUp = data.close >= data.open;
  const changeAmount = data.close - data.open;
  const changePercent = ((changeAmount / data.open) * 100).toFixed(2);

  return (
    <div className="rounded-lg border border-gray-200 bg-white p-3 shadow-lg">
      {/* Date header */}
      <p className="mb-2 font-bold text-gray-900">{data.date}</p>

      {/* Price details in a grid */}
      <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-sm">
        <span className="text-gray-500">Open:</span>
        <span className="font-medium text-gray-900">
          {formatCurrency(data.open)}
        </span>

        <span className="text-gray-500">High:</span>
        <span className="font-medium text-green-600">
          {formatCurrency(data.high)}
        </span>

        <span className="text-gray-500">Low:</span>
        <span className="font-medium text-red-600">
          {formatCurrency(data.low)}
        </span>

        <span className="text-gray-500">Close:</span>
        <span className="font-medium text-gray-900">
          {formatCurrency(data.close)}
        </span>
      </div>

      {/* Change summary with educational explanation */}
      <div
        className={cn(
          'mt-2 rounded-md px-2 py-1 text-center text-sm font-medium',
          isUp ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
        )}
      >
        {isUp ? 'UP' : 'DOWN'} {isUp ? '+' : ''}
        {formatCurrency(changeAmount)} ({isUp ? '+' : ''}
        {changePercent}%)
      </div>
    </div>
  );
});

// =============================================================================
// EDUCATIONAL LEGEND
// =============================================================================

/**
 * A simple legend that explains what the colors and shapes mean.
 * Perfect for young learners who are new to candlestick charts!
 */
const CandlestickLegend = memo(function CandlestickLegend() {
  return (
    <div className="mt-3 flex flex-wrap items-center justify-center gap-4 text-xs text-gray-600 sm:gap-6">
      {/* Green = Up explanation */}
      <div className="flex items-center gap-1.5">
        <div className="h-4 w-3 rounded-sm bg-green-500" />
        <span>Green = Price went UP</span>
      </div>

      {/* Red = Down explanation */}
      <div className="flex items-center gap-1.5">
        <div className="h-4 w-3 rounded-sm bg-red-500" />
        <span>Red = Price went DOWN</span>
      </div>

      {/* Wick explanation */}
      <div className="flex items-center gap-1.5">
        <div className="flex flex-col items-center">
          <div className="h-1.5 w-0.5 bg-gray-400" />
          <div className="h-2 w-2 rounded-sm bg-gray-400" />
          <div className="h-1.5 w-0.5 bg-gray-400" />
        </div>
        <span>Lines = High & Low</span>
      </div>
    </div>
  );
});

// =============================================================================
// INFO TOOLTIP BUTTON
// =============================================================================

/**
 * A small info button that shows educational content when clicked.
 * Helps young learners understand what they're looking at.
 */
const InfoTooltip = memo(function InfoTooltip() {
  const [isOpen, setIsOpen] = useState(false);

  const toggleTooltip = useCallback(() => {
    setIsOpen((prev) => !prev);
  }, []);

  return (
    <div className="relative">
      <button
        onClick={toggleTooltip}
        className="flex h-5 w-5 items-center justify-center rounded-full bg-blue-100 text-xs font-bold text-blue-600 transition-colors hover:bg-blue-200"
        aria-label="Learn about candlestick charts"
        type="button"
      >
        ?
      </button>

      {isOpen && (
        <>
          {/* Backdrop to close on click outside */}
          <div
            className="fixed inset-0 z-10"
            onClick={toggleTooltip}
            aria-hidden="true"
          />

          {/* Educational popup */}
          <div className="absolute right-0 top-7 z-20 w-64 rounded-lg border border-gray-200 bg-white p-3 shadow-lg sm:w-72">
            <h4 className="mb-2 font-bold text-gray-900">
              What is a Candlestick Chart?
            </h4>
            <p className="mb-2 text-sm text-gray-600">
              Each &quot;candle&quot; shows how a stock&apos;s price changed
              during one day:
            </p>
            <ul className="mb-2 space-y-1 text-sm text-gray-600">
              <li className="flex items-start gap-2">
                <span className="mt-0.5 h-3 w-2 flex-shrink-0 rounded-sm bg-green-500" />
                <span>
                  <strong className="text-green-600">Green</strong> = The price
                  went UP (yay!)
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="mt-0.5 h-3 w-2 flex-shrink-0 rounded-sm bg-red-500" />
                <span>
                  <strong className="text-red-600">Red</strong> = The price went
                  DOWN
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="mt-1 h-2 w-2 flex-shrink-0 rounded-sm bg-gray-400" />
                <span>
                  <strong>Thick part</strong> = Where it opened & closed
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="mt-1.5 h-0.5 w-2 flex-shrink-0 bg-gray-400" />
                <span>
                  <strong>Thin lines</strong> = Highest & lowest prices
                </span>
              </li>
            </ul>
            <p className="text-xs text-gray-500">
              Tap or hover on any candle to see the exact prices!
            </p>
          </div>
        </>
      )}
    </div>
  );
});

// =============================================================================
// MAIN COMPONENT
// =============================================================================

/**
 * Candlestick chart for visualizing stock price movements.
 *
 * This chart is commonly used by traders to see how a stock's price
 * moved over time. Each candlestick represents one trading day.
 *
 * @example
 * // Basic usage with mock data
 * <CandlestickChart symbol="AAPL" />
 *
 * @example
 * // With custom styling
 * <CandlestickChart symbol="GOOGL" className="my-4" height={400} />
 *
 * @example
 * // With custom data
 * <CandlestickChart symbol="MSFT" data={myCustomData} />
 */
export function CandlestickChart({
  symbol,
  className,
  height = 300,
  data: customData,
}: CandlestickChartProps) {
  // ---------------------------------------------------------------------------
  // DATA PREPARATION
  // Generate mock data if no custom data is provided
  // ---------------------------------------------------------------------------

  const rawData = useMemo(() => {
    if (customData && customData.length > 0) {
      return customData;
    }
    return generateMockOHLCData(symbol, 12); // Get ~7-8 trading days
  }, [symbol, customData]);

  // ---------------------------------------------------------------------------
  // CHART CALCULATIONS
  // Calculate the Y-axis domain (min/max values) for proper scaling
  // ---------------------------------------------------------------------------

  const { yMin, yMax, chartHeight } = useMemo(() => {
    if (rawData.length === 0) {
      return { yMin: 0, yMax: 100, chartHeight: height - 60 };
    }

    // Find the lowest low and highest high
    const lows = rawData.map((d) => d.low);
    const highs = rawData.map((d) => d.high);
    const minPrice = Math.min(...lows);
    const maxPrice = Math.max(...highs);

    // Add 10% padding to the top and bottom for visual breathing room
    const padding = (maxPrice - minPrice) * 0.15;

    return {
      yMin: minPrice - padding,
      yMax: maxPrice + padding,
      chartHeight: height - 60, // Account for margins and axis
    };
  }, [rawData, height]);

  // Prepare data with computed values for candlestick rendering
  const data = useMemo(() => {
    return rawData.map((d) => ({
      ...d,
      // Add a dummy value for the Bar component (we use custom shape anyway)
      value: 1,
      // Pre-compute whether this is an up or down day
      isUp: d.close >= d.open,
      // Pass Y-axis info to each data point for the custom shape
      yMin,
      yMax,
      chartHeight,
    }));
  }, [rawData, yMin, yMax, chartHeight]);

  // Calculate the first day's close for reference line
  const firstClose = data.length > 0 ? data[0].open : null;

  // ---------------------------------------------------------------------------
  // RENDER: EMPTY STATE
  // Show a helpful message if there's no data
  // ---------------------------------------------------------------------------

  if (data.length === 0) {
    return (
      <div
        className={cn(
          'flex items-center justify-center rounded-lg border border-gray-200 bg-gray-50',
          className
        )}
        style={{ height }}
      >
        <p className="text-gray-500">No price data available for {symbol}</p>
      </div>
    );
  }

  // ---------------------------------------------------------------------------
  // RENDER: MAIN CHART
  // ---------------------------------------------------------------------------

  return (
    <div className={cn('w-full', className)}>
      {/* Header with symbol and info button */}
      <div className="mb-2 flex items-center justify-between">
        <h3 className="text-sm font-medium text-gray-700">
          {symbol} Price History (Mock Data)
        </h3>
        <InfoTooltip />
      </div>

      {/* The chart container */}
      <div style={{ width: '100%', height }}>
        <ResponsiveContainer>
          <ComposedChart
            data={data}
            margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
          >
            {/* Grid lines to help read values */}
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />

            {/* X-axis showing dates */}
            <XAxis
              dataKey="date"
              tick={{ fontSize: 11, fill: '#6b7280' }}
              axisLine={{ stroke: '#d1d5db' }}
              tickLine={{ stroke: '#d1d5db' }}
              interval={0}
              angle={-45}
              textAnchor="end"
              height={50}
            />

            {/* Y-axis showing prices */}
            <YAxis
              domain={[yMin, yMax]}
              tick={{ fontSize: 11, fill: '#6b7280' }}
              axisLine={{ stroke: '#d1d5db' }}
              tickLine={{ stroke: '#d1d5db' }}
              width={55}
              tickFormatter={(value) => `$${value.toFixed(0)}`}
            />

            {/* Tooltip that appears on hover */}
            <Tooltip
              content={<CandlestickTooltip />}
              cursor={{ fill: 'rgba(0, 0, 0, 0.05)' }}
            />

            {/* Reference line showing the starting price */}
            {firstClose && (
              <ReferenceLine
                y={firstClose}
                stroke="#9ca3af"
                strokeDasharray="5 5"
                strokeWidth={1}
                label={{
                  value: 'Start',
                  position: 'right',
                  fill: '#9ca3af',
                  fontSize: 10,
                }}
              />
            )}

            {/* Bar component with custom candlestick shape */}
            <Bar
              dataKey="value"
              shape={<CandlestickShape />}
              isAnimationActive={false}
            >
              {data.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={entry.isUp ? UP_COLOR : DOWN_COLOR}
                />
              ))}
            </Bar>
          </ComposedChart>
        </ResponsiveContainer>
      </div>

      {/* Educational legend */}
      <CandlestickLegend />
    </div>
  );
}
