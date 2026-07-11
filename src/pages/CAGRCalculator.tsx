import { useState, useMemo } from 'react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from 'recharts';
import { Calculator, TrendingUp, IndianRupee, Percent, Clock, Target } from 'lucide-react';

/* ───── helpers ───── */
function formatCurrency(value: number) {
  if (Number.isNaN(value)) return '-';
  if (value >= 1e7) return `Rs ${(value / 1e7).toFixed(2)} Cr`;
  if (value >= 1e5) return `Rs ${(value / 1e5).toFixed(2)} L`;
  return `Rs ${value.toLocaleString(undefined, { maximumFractionDigits: 0 })}`;
}

function formatCurrencyFull(value: number) {
  if (Number.isNaN(value)) return '-';
  return `Rs ${value.toLocaleString(undefined, { maximumFractionDigits: 0 })}`;
}

/* ───── CAGR calculation engine ───── */
type CagrResult = {
  cagr: number;
  totalReturn: number;
  absoluteGain: number;
  yearlyData: {
    year: number;
    value: number;
  }[];
};

function calculateCagr(
  initialValue: number,
  finalValue: number,
  years: number,
): CagrResult | null {
  if (initialValue <= 0 || finalValue <= 0 || years <= 0) return null;

  // CAGR = (FV / PV)^(1/n) - 1
  const cagr = (Math.pow(finalValue / initialValue, 1 / years) - 1) * 100;
  const totalReturn = ((finalValue - initialValue) / initialValue) * 100;
  const absoluteGain = finalValue - initialValue;

  // Build year-by-year growth using the CAGR
  const yearlyData: CagrResult['yearlyData'] = [];
  for (let y = 0; y <= years; y++) {
    const value = initialValue * Math.pow(1 + cagr / 100, y);
    yearlyData.push({
      year: y,
      value: Math.round(value),
    });
  }

  return { cagr, totalReturn, absoluteGain, yearlyData };
}

/* ───── Gauge component ───── */
function CagrGauge({ cagr }: { cagr: number }) {
  // Map CAGR to a 0-180 degree arc
  const clampedCagr = Math.max(-50, Math.min(100, cagr));
  const angle = ((clampedCagr + 50) / 150) * 180; // -50% maps to 0°, 100% maps to 180°

  const isPositive = cagr >= 0;
  const color = isPositive ? 'var(--color-accent-base)' : 'var(--color-negative-base)';

  return (
    <div className="flex flex-col items-center gap-4">
      <div className="relative w-52 h-28 overflow-hidden">
        <svg className="w-full h-full" viewBox="0 0 200 110">
          {/* Background arc */}
          <path
            d="M 20 100 A 80 80 0 0 1 180 100"
            fill="none"
            stroke="var(--color-paper-3)"
            strokeWidth="14"
            strokeLinecap="round"
          />
          {/* Colored arc up to the CAGR value */}
          <path
            d="M 20 100 A 80 80 0 0 1 180 100"
            fill="none"
            stroke={color}
            strokeWidth="14"
            strokeLinecap="round"
            strokeDasharray={`${(angle / 180) * 251.3} 251.3`}
            className="transition-all duration-700 ease-out"
          />
          {/* Needle */}
          <line
            x1="100"
            y1="100"
            x2={100 + 60 * Math.cos(((180 - angle) * Math.PI) / 180)}
            y2={100 - 60 * Math.sin(((180 - angle) * Math.PI) / 180)}
            stroke={color}
            strokeWidth="2.5"
            strokeLinecap="round"
            className="transition-all duration-700 ease-out"
          />
          {/* Center dot */}
          <circle cx="100" cy="100" r="5" fill={color} className="transition-all duration-700 ease-out" />
          {/* Labels */}
          <text x="15" y="108" fontSize="10" fill="var(--color-text-muted)" fontFamily="var(--font-mono)">-50%</text>
          <text x="155" y="108" fontSize="10" fill="var(--color-text-muted)" fontFamily="var(--font-mono)">100%</text>
        </svg>
      </div>
      <div className="text-center -mt-2">
        <span className="text-3xl font-display font-semibold fin-number" style={{ color }}>
          {cagr.toFixed(2)}%
        </span>
        <p className="text-xs text-[var(--color-text-muted)] mt-1 uppercase tracking-wider">
          Compound Annual Growth Rate
        </p>
      </div>
    </div>
  );
}

/* ───── Stat card ───── */
function StatCard({
  icon: Icon,
  label,
  value,
  accent = false,
  negative = false,
}: {
  icon: React.ElementType;
  label: string;
  value: string;
  accent?: boolean;
  negative?: boolean;
}) {
  return (
    <div
      className={`glass-card p-5 ${
        accent ? 'border-t-2 border-t-[var(--color-accent-base)]' : ''
      } ${negative ? 'border-t-2 border-t-[var(--color-negative-base)]' : ''}`}
    >
      <div className="flex items-center gap-2 mb-2">
        <Icon className="w-4 h-4 text-[var(--color-text-muted)]" />
        <span className="text-xs text-[var(--color-text-muted)] font-medium uppercase tracking-wider">
          {label}
        </span>
      </div>
      <div
        className={`text-2xl font-display fin-number ${
          accent ? 'text-[var(--color-accent-base)]' : ''
        } ${negative ? 'text-[var(--color-negative-base)]' : ''}`}
      >
        {value}
      </div>
    </div>
  );
}

/* ───── Main page ───── */
export default function CAGRCalculator() {
  const [initialValue, setInitialValue] = useState('100000');
  const [finalValue, setFinalValue] = useState('500000');
  const [years, setYears] = useState('5');
  const [hasCalculated, setHasCalculated] = useState(false);

  const result = useMemo(() => {
    const iv = Number(initialValue) || 0;
    const fv = Number(finalValue) || 0;
    const yr = Number(years) || 0;
    return calculateCagr(iv, fv, yr);
  }, [initialValue, finalValue, years]);

  const handleCalculate = (e: React.FormEvent) => {
    e.preventDefault();
    setHasCalculated(true);
  };

  const showResult = hasCalculated && result;
  const isPositive = (result?.cagr ?? 0) >= 0;

  const chartData = useMemo(
    () =>
      result?.yearlyData.map((d) => ({
        year: `Yr ${d.year}`,
        Value: d.value,
      })) ?? [],
    [result],
  );

  return (
    <div className="flex flex-col md:flex-row flex-1 max-w-[1600px] mx-auto w-full">
      {/* ── Side panel ── */}
      <aside className="w-full md:w-[350px] lg:w-[400px] border-b md:border-b-0 md:border-r border-white/5 bg-[var(--color-paper-1)] flex-shrink-0 md:sticky md:top-16 h-auto md:h-[calc(100vh-64px)] overflow-y-auto">
        <div className="p-6 lg:p-8">
          <div className="mb-8">
            <h1 className="text-2xl font-display font-semibold mb-2">
              CAGR Calculator
            </h1>
            <p className="text-sm text-[var(--color-text-muted)]">
              Compute the Compound Annual Growth Rate of your investments over
              any time period.
            </p>
          </div>

          <form onSubmit={handleCalculate} className="space-y-6">
            {/* Initial Investment */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-[var(--color-text-muted)] flex items-center justify-between">
                Initial Value (Rs)
                <span className="fin-number text-[var(--color-accent-base)] text-xs">
                  {formatCurrency(Number(initialValue) || 0)}
                </span>
              </label>
              <input
                type="range"
                min="10000"
                max="10000000"
                step="10000"
                value={initialValue}
                onChange={(e) => setInitialValue(e.target.value)}
                className="w-full h-2 rounded-full appearance-none cursor-pointer bg-[var(--color-paper-3)] accent-[var(--color-accent-base)]"
              />
              <input
                type="number"
                min="1"
                step="any"
                value={initialValue}
                onChange={(e) => setInitialValue(e.target.value)}
                placeholder="e.g. 100000"
                className="w-full bg-[var(--color-paper-2)] border border-white/5 rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-[var(--color-accent-base)] transition-hallmark fin-number"
                required
              />
              <div className="flex flex-wrap gap-2 mt-1">
                {[100000, 500000, 1000000, 5000000].map((preset) => (
                  <button
                    key={preset}
                    type="button"
                    onClick={() => setInitialValue(String(preset))}
                    className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-hallmark border ${
                      Number(initialValue) === preset
                        ? 'bg-[var(--color-accent-base)]/15 border-[var(--color-accent-base)]/30 text-[var(--color-accent-base)]'
                        : 'bg-[var(--color-paper-2)] border-white/5 text-[var(--color-text-muted)] hover:border-white/10'
                    }`}
                  >
                    {preset >= 1e6
                      ? `${(preset / 1e6).toFixed(0)}M`
                      : preset >= 1e5
                        ? `${(preset / 1e5).toFixed(0)}L`
                        : `${(preset / 1e3).toFixed(0)}K`}
                  </button>
                ))}
              </div>
            </div>

            {/* Final Value */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-[var(--color-text-muted)] flex items-center justify-between">
                Final Value (Rs)
                <span className="fin-number text-[var(--color-accent-base)] text-xs">
                  {formatCurrency(Number(finalValue) || 0)}
                </span>
              </label>
              <input
                type="range"
                min="10000"
                max="50000000"
                step="10000"
                value={finalValue}
                onChange={(e) => setFinalValue(e.target.value)}
                className="w-full h-2 rounded-full appearance-none cursor-pointer bg-[var(--color-paper-3)] accent-[var(--color-accent-base)]"
              />
              <input
                type="number"
                min="1"
                step="any"
                value={finalValue}
                onChange={(e) => setFinalValue(e.target.value)}
                placeholder="e.g. 500000"
                className="w-full bg-[var(--color-paper-2)] border border-white/5 rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-[var(--color-accent-base)] transition-hallmark fin-number"
                required
              />
              <div className="flex flex-wrap gap-2 mt-1">
                {[500000, 1000000, 5000000, 10000000].map((preset) => (
                  <button
                    key={preset}
                    type="button"
                    onClick={() => setFinalValue(String(preset))}
                    className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-hallmark border ${
                      Number(finalValue) === preset
                        ? 'bg-[var(--color-accent-base)]/15 border-[var(--color-accent-base)]/30 text-[var(--color-accent-base)]'
                        : 'bg-[var(--color-paper-2)] border-white/5 text-[var(--color-text-muted)] hover:border-white/10'
                    }`}
                  >
                    {preset >= 1e7
                      ? `${(preset / 1e7).toFixed(0)}Cr`
                      : preset >= 1e6
                        ? `${(preset / 1e6).toFixed(0)}M`
                        : `${(preset / 1e5).toFixed(0)}L`}
                  </button>
                ))}
              </div>
            </div>

            {/* Duration */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-[var(--color-text-muted)] flex items-center justify-between">
                Duration (Years)
                <span className="fin-number text-[var(--color-accent-base)] text-xs">
                  {years} yrs
                </span>
              </label>
              <input
                type="range"
                min="1"
                max="40"
                step="1"
                value={years}
                onChange={(e) => setYears(e.target.value)}
                className="w-full h-2 rounded-full appearance-none cursor-pointer bg-[var(--color-paper-3)] accent-[var(--color-accent-base)]"
              />
              <div className="flex flex-wrap gap-2 mt-2">
                {[1, 3, 5, 10, 15, 20].map((preset) => (
                  <button
                    key={preset}
                    type="button"
                    onClick={() => setYears(String(preset))}
                    className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-hallmark border ${
                      Number(years) === preset
                        ? 'bg-[var(--color-accent-base)]/15 border-[var(--color-accent-base)]/30 text-[var(--color-accent-base)]'
                        : 'bg-[var(--color-paper-2)] border-white/5 text-[var(--color-text-muted)] hover:border-white/10'
                    }`}
                  >
                    {preset}Y
                  </button>
                ))}
              </div>
            </div>

            <button
              type="submit"
              className="w-full bg-[var(--color-accent-base)] hover:bg-[var(--color-accent-hover)] text-[var(--color-navy)] font-medium py-3.5 rounded-lg transition-hallmark flex items-center justify-center gap-2 mt-4 shadow-[0_0_20px_rgba(0,200,150,0.2)]"
            >
              <Calculator className="w-5 h-5" />
              Calculate CAGR
            </button>
          </form>

          {/* Quick info */}
          <div className="mt-8 p-4 rounded-xl bg-[var(--color-paper-2)] border border-white/5">
            <h4 className="text-xs font-medium text-[var(--color-text-muted)] uppercase tracking-wider mb-3">
              What is CAGR?
            </h4>
            <p className="text-xs text-[var(--color-text-muted)] leading-relaxed">
              Compound Annual Growth Rate (CAGR) measures the <strong className="text-[var(--color-text)]">mean annual growth rate</strong> of
              an investment over a specified period longer than one year. It smooths out volatility and shows
              the <strong className="text-[var(--color-text)]">steady rate</strong> at which your investment would have grown if it
              grew consistently each year.
            </p>
            <div className="mt-3 p-3 rounded-lg bg-[var(--color-paper-3)] border border-white/5">
              <p className="text-xs text-[var(--color-text-muted)] font-mono text-center">
                CAGR = (FV / PV)<sup>1/n</sup> − 1
              </p>
            </div>
          </div>
        </div>
      </aside>

      {/* ── Main results ── */}
      <main className="flex-1 bg-[var(--color-paper-1)] min-h-[500px] flex flex-col relative">
        {!showResult ? (
          <div className="flex-1 flex flex-col items-center justify-center p-8 text-center">
            <div className="w-24 h-24 rounded-full bg-[var(--color-paper-2)] flex items-center justify-center mb-6">
              <TrendingUp className="w-10 h-10 text-[var(--color-text-muted)]/30" />
            </div>
            <h2 className="text-2xl font-display mb-2">
              Enter your investment values
            </h2>
            <p className="text-[var(--color-text-muted)] max-w-sm">
              Input your initial investment value, final value, and the number of
              years to calculate the Compound Annual Growth Rate.
            </p>
          </div>
        ) : result ? (
          <div className="p-6 lg:p-10 max-w-5xl animate-[fadeIn_0.4s_ease-out]">
            {/* Header */}
            <div className="mb-6">
              <p className="text-sm text-[var(--color-text-muted)]">
                CAGR Analysis
              </p>
              <h2 className="text-3xl font-display font-medium">
                {formatCurrencyFull(Number(initialValue))}
                <span className="text-lg text-[var(--color-text-muted)] font-normal mx-2">→</span>
                {formatCurrencyFull(Number(finalValue))}
                <span className="text-lg text-[var(--color-text-muted)] font-normal ml-2">
                  over {years} years
                </span>
              </h2>
            </div>

            {/* Stat cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
              <StatCard
                icon={IndianRupee}
                label="Initial Value"
                value={formatCurrencyFull(Number(initialValue))}
              />
              <StatCard
                icon={Target}
                label="Final Value"
                value={formatCurrencyFull(Number(finalValue))}
                accent={isPositive}
                negative={!isPositive}
              />
              <StatCard
                icon={TrendingUp}
                label="Absolute Gain"
                value={formatCurrencyFull(Math.round(result.absoluteGain))}
                accent={isPositive}
                negative={!isPositive}
              />
              <StatCard
                icon={Percent}
                label="Total Return"
                value={`${result.totalReturn.toFixed(1)}%`}
                accent={isPositive}
                negative={!isPositive}
              />
            </div>

            {/* CAGR Gauge + Summary */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
              <div className="glass-card p-6 flex items-center justify-center">
                <CagrGauge cagr={result.cagr} />
              </div>

              <div className="glass-card p-6 flex flex-col justify-between gap-4">
                <h3 className="font-display font-medium mb-2">
                  Growth Summary
                </h3>
                <div className="space-y-4 flex-1">
                  <div className="flex justify-between items-center py-3 border-b border-white/5">
                    <span className="text-sm text-[var(--color-text-muted)] flex items-center gap-2">
                      <Clock className="w-4 h-4" />
                      Duration
                    </span>
                    <span className="fin-number text-sm font-medium">
                      {years} years
                    </span>
                  </div>
                  <div className="flex justify-between items-center py-3 border-b border-white/5">
                    <span className="text-sm text-[var(--color-text-muted)] flex items-center gap-2">
                      <IndianRupee className="w-4 h-4" />
                      Initial Value
                    </span>
                    <span className="fin-number text-sm font-medium">
                      {formatCurrencyFull(Number(initialValue))}
                    </span>
                  </div>
                  <div className="flex justify-between items-center py-3 border-b border-white/5">
                    <span className="text-sm text-[var(--color-text-muted)] flex items-center gap-2">
                      <Target className="w-4 h-4" />
                      Final Value
                    </span>
                    <span className="fin-number text-sm font-medium">
                      {formatCurrencyFull(Number(finalValue))}
                    </span>
                  </div>
                  <div className="flex justify-between items-center py-3 border-b border-white/5">
                    <span className="text-sm text-[var(--color-text-muted)] flex items-center gap-2">
                      <TrendingUp className="w-4 h-4" />
                      Growth Multiple
                    </span>
                    <span className={`fin-number text-sm font-medium ${isPositive ? 'text-[var(--color-accent-base)]' : 'text-[var(--color-negative-base)]'}`}>
                      {(Number(finalValue) / Number(initialValue)).toFixed(2)}x
                    </span>
                  </div>
                  <div className="flex justify-between items-center py-3">
                    <span className="text-sm text-[var(--color-text-muted)] flex items-center gap-2">
                      <Percent className="w-4 h-4" />
                      CAGR
                    </span>
                    <span className={`fin-number text-sm font-bold ${isPositive ? 'text-[var(--color-accent-base)]' : 'text-[var(--color-negative-base)]'}`}>
                      {result.cagr.toFixed(2)}%
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Growth projection chart */}
            <div className="glass-card p-6 mb-8">
              <div className="flex items-center justify-between mb-6">
                <h3 className="font-display font-medium">
                  Growth Trajectory at {result.cagr.toFixed(2)}% CAGR
                </h3>
                <div className="text-xs text-[var(--color-text-muted)]">
                  Smooth compounded growth path
                </div>
              </div>
              <div className="h-[300px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart
                    data={chartData}
                    margin={{ top: 10, right: 0, left: 0, bottom: 0 }}
                  >
                    <defs>
                      <linearGradient
                        id="cagrGradient"
                        x1="0"
                        y1="0"
                        x2="0"
                        y2="1"
                      >
                        <stop
                          offset="5%"
                          stopColor={isPositive ? 'var(--color-accent-base)' : 'var(--color-negative-base)'}
                          stopOpacity={0.25}
                        />
                        <stop
                          offset="95%"
                          stopColor={isPositive ? 'var(--color-accent-base)' : 'var(--color-negative-base)'}
                          stopOpacity={0}
                        />
                      </linearGradient>
                    </defs>
                    <CartesianGrid
                      strokeDasharray="3 3"
                      vertical={false}
                      stroke="rgba(255,255,255,0.05)"
                    />
                    <XAxis
                      dataKey="year"
                      axisLine={false}
                      tickLine={false}
                      tick={{
                        fill: 'var(--color-text-muted)',
                        fontSize: 12,
                        fontFamily: 'var(--font-mono)',
                      }}
                      dy={10}
                    />
                    <YAxis
                      axisLine={false}
                      tickLine={false}
                      tick={{
                        fill: 'var(--color-text-muted)',
                        fontSize: 12,
                        fontFamily: 'var(--font-mono)',
                      }}
                      tickFormatter={(val) => {
                        const n = Number(val);
                        if (n >= 1e7) return `${(n / 1e7).toFixed(1)}Cr`;
                        if (n >= 1e5) return `${(n / 1e5).toFixed(0)}L`;
                        if (n >= 1e3) return `${(n / 1e3).toFixed(0)}K`;
                        return String(n);
                      }}
                      dx={-10}
                    />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: 'var(--color-paper-2)',
                        borderColor: 'rgba(255,255,255,0.1)',
                        borderRadius: '8px',
                      }}
                      itemStyle={{
                        color: 'var(--color-text)',
                        fontFamily: 'var(--font-mono)',
                      }}
                      labelStyle={{
                        color: 'var(--color-text-muted)',
                        marginBottom: '4px',
                      }}
                      formatter={(value: unknown) => [
                        formatCurrencyFull(Number(value)),
                        'Value',
                      ]}
                    />
                    <Area
                      type="monotone"
                      dataKey="Value"
                      stroke={isPositive ? 'var(--color-accent-base)' : 'var(--color-negative-base)'}
                      strokeWidth={2}
                      fill="url(#cagrGradient)"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Year-by-year table */}
            <div className="mb-8">
              <h3 className="font-display font-medium mb-4 px-1">
                Year-by-Year Growth
              </h3>
              <div className="glass-card overflow-hidden">
                <table className="w-full text-sm text-left">
                  <thead className="text-xs uppercase tracking-wider text-[var(--color-text-muted)]">
                    <tr>
                      <th className="px-6 py-3">Year</th>
                      <th className="px-6 py-3 text-right">Portfolio Value</th>
                      <th className="px-6 py-3 text-right">Gain from Start</th>
                      <th className="px-6 py-3 text-right">% from Start</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    {result.yearlyData.map((row) => {
                      const gain = row.value - Number(initialValue);
                      const pct = Number(initialValue) > 0
                        ? ((row.value - Number(initialValue)) / Number(initialValue)) * 100
                        : 0;
                      const rowPositive = gain >= 0;
                      return (
                        <tr
                          key={row.year}
                          className="hover:bg-white/[0.02] transition-hallmark"
                        >
                          <td className="px-6 py-3 fin-number">{row.year}</td>
                          <td className="px-6 py-3 text-right fin-number font-medium">
                            {formatCurrencyFull(row.value)}
                          </td>
                          <td className={`px-6 py-3 text-right fin-number ${rowPositive ? 'text-[var(--color-accent-base)]' : 'text-[var(--color-negative-base)]'}`}>
                            {gain >= 0 ? '+' : ''}{formatCurrencyFull(Math.round(gain))}
                          </td>
                          <td className={`px-6 py-3 text-right fin-number ${rowPositive ? 'text-[var(--color-accent-base)]' : 'text-[var(--color-negative-base)]'}`}>
                            {pct >= 0 ? '+' : ''}{pct.toFixed(1)}%
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Interpretation card */}
            <div className="glass-card p-6 mb-8">
              <h3 className="font-display font-medium mb-3">
                What This Means
              </h3>
              <p className="text-sm text-[var(--color-text-muted)] leading-relaxed">
                Your investment grew at a compounded annual rate of{' '}
                <strong className={isPositive ? 'text-[var(--color-accent-base)]' : 'text-[var(--color-negative-base)]'}>
                  {result.cagr.toFixed(2)}%
                </strong>{' '}
                per year. This means if your investment of{' '}
                <strong className="text-[var(--color-text)]">{formatCurrencyFull(Number(initialValue))}</strong>{' '}
                grew steadily each year at this rate, it would reach{' '}
                <strong className="text-[var(--color-text)]">{formatCurrencyFull(Number(finalValue))}</strong>{' '}
                in <strong className="text-[var(--color-text)]">{years} years</strong>.
                {Number(result.cagr) > 15 && (
                  <span>
                    {' '}This is an excellent growth rate, significantly above typical market returns.
                  </span>
                )}
                {Number(result.cagr) > 0 && Number(result.cagr) <= 15 && (
                  <span>
                    {' '}This is a healthy growth rate, in line with or above average market returns.
                  </span>
                )}
                {Number(result.cagr) < 0 && (
                  <span>
                    {' '}A negative CAGR indicates your investment lost value over this period.
                  </span>
                )}
              </p>
            </div>
          </div>
        ) : null}
      </main>
    </div>
  );
}
