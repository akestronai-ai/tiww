import { useState, useMemo } from 'react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  BarChart,
  Bar,
} from 'recharts';
import { Calculator, TrendingUp, IndianRupee, Percent, Clock, Wallet } from 'lucide-react';

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

/* ───── SIP calculation engine ───── */
type SipResult = {
  totalInvested: number;
  futureValue: number;
  wealthGained: number;
  returnPercent: number;
  adjustedFutureValue: number;
  adjustedWealthGained: number;
  yearlyData: {
    year: number;
    invested: number;
    returns: number;
    total: number;
    adjustedTotal: number;
  }[];
};

function calculateSip(
  monthlyAmount: number,
  annualRate: number,
  years: number,
  inflationRate: number,
): SipResult {
  const monthlyRate = annualRate / 100 / 12;
  const totalMonths = years * 12;
  const totalInvested = monthlyAmount * totalMonths;

  // Future value of annuity formula: FV = P × [((1 + r)^n − 1) / r] × (1 + r)
  let futureValue: number;
  if (monthlyRate === 0) {
    futureValue = totalInvested;
  } else {
    futureValue =
      monthlyAmount *
      (((1 + monthlyRate) ** totalMonths - 1) / monthlyRate) *
      (1 + monthlyRate);
  }

  const wealthGained = futureValue - totalInvested;
  const returnPercent =
    totalInvested > 0 ? ((futureValue - totalInvested) / totalInvested) * 100 : 0;

  // Inflation adjustment: discount the future value to today's purchasing power
  const adjustedFutureValue = futureValue / Math.pow(1 + inflationRate / 100, years);
  const adjustedWealthGained = Math.max(0, adjustedFutureValue - totalInvested);

  // Build yearly breakdown
  const yearlyData: SipResult['yearlyData'] = [];
  for (let y = 1; y <= years; y++) {
    const months = y * 12;
    const invested = monthlyAmount * months;
    let total: number;
    if (monthlyRate === 0) {
      total = invested;
    } else {
      total =
        monthlyAmount *
        (((1 + monthlyRate) ** months - 1) / monthlyRate) *
        (1 + monthlyRate);
    }
    const adjustedTotal = total / Math.pow(1 + inflationRate / 100, y);
    yearlyData.push({
      year: y,
      invested,
      returns: total - invested,
      total,
      adjustedTotal,
    });
  }

  return {
    totalInvested,
    futureValue,
    wealthGained,
    returnPercent,
    adjustedFutureValue,
    adjustedWealthGained,
    yearlyData,
  };
}

/* ───── Donut component ───── */
function DonutChart({
  invested,
  returns,
}: {
  invested: number;
  returns: number;
}) {
  const total = invested + returns;
  const investedPct = total > 0 ? (invested / total) * 100 : 50;
  const returnsPct = total > 0 ? (returns / total) * 100 : 50;

  // SVG donut
  const radius = 54;
  const circumference = 2 * Math.PI * radius;
  const investedStroke = (investedPct / 100) * circumference;
  const returnsStroke = (returnsPct / 100) * circumference;

  return (
    <div className="flex flex-col items-center gap-5">
      <div className="relative w-44 h-44">
        <svg className="w-full h-full -rotate-90" viewBox="0 0 128 128">
          {/* Invested arc */}
          <circle
            cx="64"
            cy="64"
            r={radius}
            fill="none"
            stroke="var(--color-accent-base)"
            strokeWidth="14"
            strokeDasharray={`${investedStroke} ${circumference}`}
            strokeLinecap="round"
            className="transition-all duration-700 ease-out"
            opacity={0.3}
          />
          {/* Returns arc */}
          <circle
            cx="64"
            cy="64"
            r={radius}
            fill="none"
            stroke="var(--color-accent-base)"
            strokeWidth="14"
            strokeDasharray={`${returnsStroke} ${circumference}`}
            strokeDashoffset={-investedStroke}
            strokeLinecap="round"
            className="transition-all duration-700 ease-out"
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-xs text-[var(--color-text-muted)] uppercase tracking-wider">
            Nominal Total
          </span>
          <span className="text-lg font-display font-semibold fin-number">
            {formatCurrency(total)}
          </span>
        </div>
      </div>
      <div className="flex items-center gap-6 text-sm">
        <div className="flex items-center gap-2">
          <span className="w-3 h-3 rounded-full bg-[var(--color-accent-base)]/30" />
          <span className="text-[var(--color-text-muted)]">Invested</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-3 h-3 rounded-full bg-[var(--color-accent-base)]" />
          <span className="text-[var(--color-text-muted)]">Nominal Returns</span>
        </div>
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
  warning = false,
}: {
  icon: React.ElementType;
  label: string;
  value: string;
  accent?: boolean;
  warning?: boolean;
}) {
  return (
    <div
      className={`glass-card p-5 ${
        accent ? 'border-t-2 border-t-[var(--color-accent-base)]' : ''
      } ${
        warning ? 'border-t-2 border-t-[#eab308]' : ''
      }`}
    >
      <div className="flex items-center gap-2 mb-2">
        <Icon className="w-4 h-4 text-[var(--color-text-muted)]" />
        <span className="text-xs text-[var(--color-text-muted)] font-medium uppercase tracking-wider">
          {label}
        </span>
      </div>
      <div
        className={`text-xl xl:text-2xl font-display fin-number ${
          accent ? 'text-[var(--color-accent-base)]' : ''
        } ${
          warning ? 'text-[#eab308]' : ''
        }`}
      >
        {value}
      </div>
    </div>
  );
}

/* ───── Main page ───── */
export default function SIPCalculator() {
  const [monthlyAmount, setMonthlyAmount] = useState('25000');
  const [annualRate, setAnnualRate] = useState('15');
  const [years, setYears] = useState('10');
  const [inflationRate, setInflationRate] = useState('6');
  const [hasCalculated, setHasCalculated] = useState(false);

  const result = useMemo(() => {
    const amt = Number(monthlyAmount) || 0;
    const rate = Number(annualRate) || 0;
    const yr = Number(years) || 0;
    const inf = Number(inflationRate) || 0;
    if (amt <= 0 || yr <= 0) return null;
    return calculateSip(amt, rate, yr, inf);
  }, [monthlyAmount, annualRate, years, inflationRate]);

  const handleCalculate = (e: React.FormEvent) => {
    e.preventDefault();
    setHasCalculated(true);
  };

  const showResult = hasCalculated && result;

  const chartData = useMemo(
    () =>
      result?.yearlyData.map((d) => ({
        year: `Yr ${d.year}`,
        Invested: Math.round(d.invested),
        Returns: Math.round(d.returns),
        Total: Math.round(d.total),
        AdjustedTotal: Math.round(d.adjustedTotal),
      })) ?? [],
    [result],
  );

  // Slider presets
  const amountPresets = [5000, 10000, 25000, 50000, 100000];

  return (
    <div className="flex flex-col md:flex-row flex-1 max-w-[1600px] mx-auto w-full min-w-0 overflow-hidden">
      {/* ── Side panel ── */}
      <aside className="w-full md:w-[350px] lg:w-[400px] border-b md:border-b-0 md:border-r border-white/5 bg-[var(--color-paper-1)] flex-shrink-0 md:sticky md:top-16 h-auto md:h-[calc(100vh-64px)] overflow-y-auto">
        <div className="p-6 lg:p-8">
          <div className="mb-8">
            <h1 className="text-2xl font-display font-semibold mb-2">
              SIP Calculator
            </h1>
            <p className="text-sm text-[var(--color-text-muted)]">
              Plan systematic investments and project future wealth with
              compound growth & inflation adjustments.
            </p>
          </div>

          <form onSubmit={handleCalculate} className="space-y-6">
            {/* Monthly Amount */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-[var(--color-text-muted)] flex items-center justify-between">
                Monthly Investment
                <span className="fin-number text-[var(--color-accent-base)] text-xs">
                  {formatCurrencyFull(Number(monthlyAmount) || 0)}
                </span>
              </label>
              <input
                type="range"
                min="1000"
                max="500000"
                step="1000"
                value={monthlyAmount}
                onChange={(e) => setMonthlyAmount(e.target.value)}
                className="w-full h-2 rounded-full appearance-none cursor-pointer bg-[var(--color-paper-3)] accent-[var(--color-accent-base)]"
              />
              <div className="flex flex-wrap gap-2 mt-2">
                {amountPresets.map((preset) => (
                  <button
                    key={preset}
                    type="button"
                    onClick={() => setMonthlyAmount(String(preset))}
                    className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-hallmark border ${
                      Number(monthlyAmount) === preset
                        ? 'bg-[var(--color-accent-base)]/15 border-[var(--color-accent-base)]/30 text-[var(--color-accent-base)]'
                        : 'bg-[var(--color-paper-2)] border-white/5 text-[var(--color-text-muted)] hover:border-white/10'
                    }`}
                  >
                    {preset >= 1e5 ? `${preset / 1e5}L` : `${(preset / 1e3).toFixed(0)}K`}
                  </button>
                ))}
              </div>
              <input
                type="number"
                min="1000"
                step="1000"
                value={monthlyAmount}
                onChange={(e) => setMonthlyAmount(e.target.value)}
                placeholder="Enter amount"
                className="w-full bg-[var(--color-paper-2)] border border-white/5 rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-[var(--color-accent-base)] transition-hallmark fin-number mt-1"
                required
              />
            </div>

            {/* Expected Return */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-[var(--color-text-muted)] flex items-center justify-between">
                Expected Annual Return (%)
                <span className="fin-number text-[var(--color-accent-base)] text-xs">
                  {annualRate}%
                </span>
              </label>
              <input
                type="range"
                min="1"
                max="50"
                step="0.5"
                value={annualRate}
                onChange={(e) => setAnnualRate(e.target.value)}
                className="w-full h-2 rounded-full appearance-none cursor-pointer bg-[var(--color-paper-3)] accent-[var(--color-accent-base)]"
              />
              <input
                type="number"
                min="0.1"
                max="100"
                step="0.1"
                value={annualRate}
                onChange={(e) => setAnnualRate(e.target.value)}
                placeholder="e.g. 15"
                className="w-full bg-[var(--color-paper-2)] border border-white/5 rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-[var(--color-accent-base)] transition-hallmark fin-number"
                required
              />
            </div>

            {/* Inflation Rate */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-[var(--color-text-muted)] flex items-center justify-between">
                Expected Inflation Rate (%)
                <span className="fin-number text-[#eab308] text-xs">
                  {inflationRate}%
                </span>
              </label>
              <input
                type="range"
                min="0"
                max="25"
                step="0.5"
                value={inflationRate}
                onChange={(e) => setInflationRate(e.target.value)}
                className="w-full h-2 rounded-full appearance-none cursor-pointer bg-[var(--color-paper-3)] accent-[#eab308]"
              />
              <input
                type="number"
                min="0"
                max="50"
                step="0.1"
                value={inflationRate}
                onChange={(e) => setInflationRate(e.target.value)}
                placeholder="e.g. 6"
                className="w-full bg-[var(--color-paper-2)] border border-white/5 rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-[#eab308] transition-hallmark fin-number"
                required
              />
            </div>

            {/* Time Period */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-[var(--color-text-muted)] flex items-center justify-between">
                Time Period (Years)
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
                {[3, 5, 10, 15, 20, 30].map((preset) => (
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
              Calculate SIP Returns
            </button>
          </form>

          {/* Quick info */}
          <div className="mt-8 p-4 rounded-xl bg-[var(--color-paper-2)] border border-white/5">
            <h4 className="text-xs font-medium text-[var(--color-text-muted)] uppercase tracking-wider mb-3">
              Inflation & Purchasing Power
            </h4>
            <p className="text-xs text-[var(--color-text-muted)] leading-relaxed">
              Inflation decreases the purchasing power of your money over time.
              While standard SIP calculations show nominal figures, the{' '}
              <strong className="text-[var(--color-text)]">Inflation Adjusted Value</strong>{' '}
              tells you what your future wealth will be worth in terms of{' '}
              <strong className="text-[var(--color-text)]">today's money</strong>.
            </p>
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
              Configure your SIP plan
            </h2>
            <p className="text-[var(--color-text-muted)] max-w-sm">
              Set your monthly investment amount, expected return rate, inflation, and time
              horizon on the left to project your future wealth.
            </p>
          </div>
        ) : result ? (
          <div className="p-6 lg:p-10 max-w-5xl animate-[fadeIn_0.4s_ease-out]">
            {/* Header */}
            <div className="mb-6">
              <p className="text-sm text-[var(--color-text-muted)]">
                SIP Projection
              </p>
              <h2 className="text-3xl font-display font-medium">
                {formatCurrencyFull(Number(monthlyAmount))}{' '}
                <span className="text-lg text-[var(--color-text-muted)] font-normal">
                  / month for {years} years @ {annualRate}% p.a.
                </span>
              </h2>
            </div>

            {/* Stat cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
              <StatCard
                icon={IndianRupee}
                label="Total Invested"
                value={formatCurrencyFull(result.totalInvested)}
              />
              <StatCard
                icon={Wallet}
                label="Nominal Value"
                value={formatCurrencyFull(Math.round(result.futureValue))}
                accent
              />
              <StatCard
                icon={Wallet}
                label="Adjusted Value"
                value={formatCurrencyFull(Math.round(result.adjustedFutureValue))}
                warning
              />
              <StatCard
                icon={TrendingUp}
                label="Real Wealth Gain"
                value={formatCurrencyFull(Math.round(result.adjustedWealthGained))}
              />
              <StatCard
                icon={Percent}
                label="Nominal Return"
                value={`${result.returnPercent.toFixed(1)}%`}
                accent
              />
            </div>

            {/* Donut + key numbers */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
              <div className="glass-card p-6 flex items-center justify-center">
                <DonutChart
                  invested={result.totalInvested}
                  returns={result.wealthGained}
                />
              </div>

              <div className="glass-card p-6 flex flex-col justify-between gap-4">
                <h3 className="font-display font-medium mb-2">
                  Investment Summary
                </h3>
                <div className="space-y-4 flex-1">
                  <div className="flex justify-between items-center py-3 border-b border-white/5">
                    <span className="text-sm text-[var(--color-text-muted)] flex items-center gap-2">
                      <Clock className="w-4 h-4" />
                      Duration
                    </span>
                    <span className="fin-number text-sm font-medium">
                      {years} years ({Number(years) * 12} months)
                    </span>
                  </div>
                  <div className="flex justify-between items-center py-3 border-b border-white/5">
                    <span className="text-sm text-[var(--color-text-muted)] flex items-center gap-2">
                      <IndianRupee className="w-4 h-4" />
                      Monthly SIP
                    </span>
                    <span className="fin-number text-sm font-medium">
                      {formatCurrencyFull(Number(monthlyAmount))}
                    </span>
                  </div>
                  <div className="flex justify-between items-center py-3 border-b border-white/5">
                    <span className="text-sm text-[var(--color-text-muted)] flex items-center gap-2">
                      <Percent className="w-4 h-4" />
                      Expected / Inflation
                    </span>
                    <span className="fin-number text-sm font-medium">
                      {annualRate}% / {inflationRate}%
                    </span>
                  </div>
                  <div className="flex justify-between items-center py-3">
                    <span className="text-sm text-[var(--color-text-muted)] flex items-center gap-2">
                      <TrendingUp className="w-4 h-4" />
                      Real Growth Multiple
                    </span>
                    <span className="fin-number text-sm font-medium text-[var(--color-accent-base)]">
                      {(result.adjustedFutureValue / result.totalInvested).toFixed(2)}x
                      <span className="text-[var(--color-text-muted)] text-xs font-normal ml-1.5">
                        (Nominal {(result.futureValue / result.totalInvested).toFixed(2)}x)
                      </span>
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Wealth growth chart */}
            <div className="glass-card p-6 mb-8">
              <div className="flex items-center justify-between mb-6">
                <h3 className="font-display font-medium">
                  Wealth Growth (Nominal vs Inflation Adjusted)
                </h3>
                <div className="flex items-center gap-4 text-xs text-[var(--color-text-muted)] flex-wrap">
                  <span className="flex items-center gap-1.5">
                    <span className="w-3 h-1.5 rounded-full bg-[var(--color-accent-base)]/30" />
                    Invested
                  </span>
                  <span className="flex items-center gap-1.5">
                    <span className="w-3 h-1.5 rounded-full bg-[var(--color-accent-base)]" />
                    Nominal Value
                  </span>
                  <span className="flex items-center gap-1.5">
                    <span className="w-3 h-1.5 rounded-full bg-[#eab308]" />
                    Adjusted Value (Today's money)
                  </span>
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
                        id="sipInvested"
                        x1="0"
                        y1="0"
                        x2="0"
                        y2="1"
                      >
                        <stop
                          offset="5%"
                          stopColor="var(--color-accent-base)"
                          stopOpacity={0.1}
                        />
                        <stop
                          offset="95%"
                          stopColor="var(--color-accent-base)"
                          stopOpacity={0}
                        />
                      </linearGradient>
                      <linearGradient
                        id="sipTotal"
                        x1="0"
                        y1="0"
                        x2="0"
                        y2="1"
                      >
                        <stop
                          offset="5%"
                          stopColor="var(--color-accent-base)"
                          stopOpacity={0.25}
                        />
                        <stop
                          offset="95%"
                          stopColor="var(--color-accent-base)"
                          stopOpacity={0}
                        />
                      </linearGradient>
                      <linearGradient
                        id="sipAdjusted"
                        x1="0"
                        y1="0"
                        x2="0"
                        y2="1"
                      >
                        <stop
                          offset="5%"
                          stopColor="#eab308"
                          stopOpacity={0.25}
                        />
                        <stop
                          offset="95%"
                          stopColor="#eab308"
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
                        return `${(n / 1e3).toFixed(0)}K`;
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
                      formatter={(value: unknown, name: any) => {
                        const labelName = name === 'Total' ? 'Nominal Value' : name === 'AdjustedTotal' ? 'Adjusted Value' : name;
                        return [formatCurrencyFull(Number(value)), labelName];
                      }}
                    />
                    <Area
                      type="monotone"
                      dataKey="Invested"
                      stroke="var(--color-accent-base)"
                      strokeWidth={1.5}
                      strokeOpacity={0.4}
                      fill="url(#sipInvested)"
                    />
                    <Area
                      type="monotone"
                      dataKey="Total"
                      stroke="var(--color-accent-base)"
                      strokeWidth={2}
                      fill="url(#sipTotal)"
                    />
                    <Area
                      type="monotone"
                      dataKey="AdjustedTotal"
                      stroke="#eab308"
                      strokeWidth={2}
                      fill="url(#sipAdjusted)"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Stacked bar chart */}
            <div className="glass-card p-6 mb-8">
              <h3 className="font-display font-medium mb-6">
                Year-wise Invested vs Returns
              </h3>
              <div className="h-[280px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={chartData}
                    margin={{ top: 10, right: 0, left: 0, bottom: 0 }}
                  >
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
                        return `${(n / 1e3).toFixed(0)}K`;
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
                      ]}
                    />
                    <Bar
                      dataKey="Invested"
                      stackId="a"
                      fill="var(--color-accent-base)"
                      fillOpacity={0.25}
                      radius={[0, 0, 0, 0]}
                    />
                    <Bar
                      dataKey="Returns"
                      stackId="a"
                      fill="var(--color-accent-base)"
                      fillOpacity={0.8}
                      radius={[4, 4, 0, 0]}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Year-by-year table */}
            <div className="mb-8">
              <h3 className="font-display font-medium mb-4 px-1">
                Year-by-Year Breakdown
              </h3>
              <div className="glass-card overflow-hidden">
                <table className="w-full text-sm text-left">
                  <thead className="text-xs uppercase tracking-wider text-[var(--color-text-muted)]">
                    <tr>
                      <th className="px-6 py-3">Year</th>
                      <th className="px-6 py-3 text-right">Invested</th>
                      <th className="px-6 py-3 text-right">Nominal Value</th>
                      <th className="px-6 py-3 text-right">Inflation Adjusted</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    {result.yearlyData.map((row) => (
                      <tr
                        key={row.year}
                        className="hover:bg-white/[0.02] transition-hallmark"
                      >
                        <td className="px-6 py-3 fin-number">{row.year}</td>
                        <td className="px-6 py-3 text-right fin-number">
                          {formatCurrencyFull(row.invested)}
                        </td>
                        <td className="px-6 py-3 text-right fin-number font-medium">
                          {formatCurrencyFull(Math.round(row.total))}
                        </td>
                        <td className="px-6 py-3 text-right fin-number font-medium text-[#eab308]">
                          {formatCurrencyFull(Math.round(row.adjustedTotal))}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        ) : null}
      </main>
    </div>
  );
}
