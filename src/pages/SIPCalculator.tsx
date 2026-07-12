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
import {
  Calculator,
  TrendingUp,
  IndianRupee,
  Percent,
  Wallet,
  ArrowLeft,
  ArrowRight,
  ShieldCheck,
  ArrowUpCircle,
} from 'lucide-react';

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

  const adjustedFutureValue = futureValue / Math.pow(1 + inflationRate / 100, years);
  const adjustedWealthGained = Math.max(0, adjustedFutureValue - totalInvested);

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

/* ───── Donut Chart Component ───── */
function DonutChart({
  invested,
  returns,
  title = "Nominal Total",
}: {
  invested: number;
  returns: number;
  title?: string;
}) {
  const total = invested + returns;
  const investedPct = total > 0 ? (invested / total) * 100 : 50;
  const returnsPct = total > 0 ? (returns / total) * 100 : 50;

  const radius = 54;
  const circumference = 2 * Math.PI * radius;
  const investedStroke = (investedPct / 100) * circumference;
  const returnsStroke = (returnsPct / 100) * circumference;

  return (
    <div className="flex flex-col items-center gap-5">
      <div className="relative w-44 h-44">
        <svg className="w-full h-full -rotate-90" viewBox="0 0 128 128">
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
          <span className="text-[10px] text-[var(--color-text-muted)] uppercase tracking-wider">
            {title}
          </span>
          <span className="text-lg font-display font-semibold fin-number">
            {formatCurrency(total)}
          </span>
        </div>
      </div>
      <div className="flex items-center gap-6 text-xs">
        <div className="flex items-center gap-2">
          <span className="w-3 h-3 rounded-full bg-[var(--color-accent-base)]/30" />
          <span className="text-[var(--color-text-muted)] font-medium">Invested</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-3 h-3 rounded-full bg-[var(--color-accent-base)]" />
          <span className="text-[var(--color-text-muted)] font-medium">Nominal Returns</span>
        </div>
      </div>
    </div>
  );
}

/* ───── Stat Card Component ───── */
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
      className={`glass-card p-5 transition-hallmark ${
        accent ? 'border-t-2 border-t-[var(--color-accent-base)]' : ''
      } ${
        warning ? 'border-t-2 border-t-[#eab308]' : ''
      }`}
    >
      <div className="flex items-center gap-2 mb-2">
        <Icon className="w-4 h-4 text-[var(--color-text-muted)]" />
        <span className="text-[10px] text-[var(--color-text-muted)] font-medium uppercase tracking-wider">
          {label}
        </span>
      </div>
      <div
        className={`text-lg xl:text-xl font-display font-semibold fin-number ${
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

/* ───── Step Up SIP calculation engine ───── */
function calculateStepUpSip(
  initialMonthlyAmount: number,
  annualRate: number,
  years: number,
  stepUpPercent: number,
) {
  const monthlyRate = annualRate / 100 / 12;
  let totalInvested = 0;
  let futureValue = 0;
  const yearlyData: {
    year: number;
    invested: number;
    returns: number;
    total: number;
  }[] = [];

  let currentMonthlyAmount = initialMonthlyAmount;

  for (let y = 1; y <= years; y++) {
    const investedThisYear = currentMonthlyAmount * 12;
    totalInvested += investedThisYear;

    let yearEndValue = 0;
    if (monthlyRate === 0) {
      yearEndValue = investedThisYear;
    } else {
      yearEndValue =
        currentMonthlyAmount *
        (((1 + monthlyRate) ** 12 - 1) / monthlyRate) *
        (1 + monthlyRate);
    }

    // Previous futureValue compounds for 1 year
    futureValue = futureValue * (1 + annualRate / 100) + yearEndValue;

    yearlyData.push({
      year: y,
      invested: totalInvested,
      total: futureValue,
      returns: futureValue - totalInvested,
    });

    // Step up the monthly amount for the next year
    currentMonthlyAmount = currentMonthlyAmount * (1 + stepUpPercent / 100);
  }

  const wealthGained = futureValue - totalInvested;
  const returnPercent = totalInvested > 0 ? (wealthGained / totalInvested) * 100 : 0;

  return {
    totalInvested,
    futureValue,
    wealthGained,
    returnPercent,
    yearlyData,
  };
}

/* ───── Main Component ───── */
export default function SIPCalculator() {
  const [viewMode, setViewMode] = useState<'selection' | 'sip' | 'inflation' | 'stepup'>('selection');

  // Standard SIP Calculator state
  const [sipMonthlyAmount, setSipMonthlyAmount] = useState('25000');
  const [sipAnnualRate, setSipAnnualRate] = useState('15');
  const [sipYears, setSipYears] = useState('10');
  const [sipCalculated, setSipCalculated] = useState(false);

  // Inflation Adjusted Calculator state
  const [infMonthlyAmount, setInfMonthlyAmount] = useState('25000');
  const [infAnnualRate, setInfAnnualRate] = useState('15');
  const [infInflationRate, setInfInflationRate] = useState('6');
  const [infYears, setInfYears] = useState('10');
  const [infCalculated, setInfCalculated] = useState(false);

  // Step Up SIP Calculator state
  const [stepUpMonthlyAmount, setStepUpMonthlyAmount] = useState('25000');
  const [stepUpAnnualRate, setStepUpAnnualRate] = useState('15');
  const [stepUpPercent, setStepUpPercent] = useState('10');
  const [stepUpYears, setStepUpYears] = useState('10');
  const [stepUpCalculated, setStepUpCalculated] = useState(false);

  // Calculate results for Standard SIP
  const sipResult = useMemo(() => {
    const amt = Number(sipMonthlyAmount) || 0;
    const rate = Number(sipAnnualRate) || 0;
    const yr = Number(sipYears) || 0;
    if (amt <= 0 || yr <= 0) return null;
    return calculateSip(amt, rate, yr, 0); // 0% inflation
  }, [sipMonthlyAmount, sipAnnualRate, sipYears]);

  // Calculate results for Inflation Adjusted SIP
  const infResult = useMemo(() => {
    const amt = Number(infMonthlyAmount) || 0;
    const rate = Number(infAnnualRate) || 0;
    const yr = Number(infYears) || 0;
    const inf = Number(infInflationRate) || 0;
    if (amt <= 0 || yr <= 0) return null;
    return calculateSip(amt, rate, yr, inf);
  }, [infMonthlyAmount, infAnnualRate, infYears, infInflationRate]);

  // Calculate results for Step Up SIP
  const stepUpResult = useMemo(() => {
    const amt = Number(stepUpMonthlyAmount) || 0;
    const rate = Number(stepUpAnnualRate) || 0;
    const yr = Number(stepUpYears) || 0;
    const step = Number(stepUpPercent) || 0;
    if (amt <= 0 || yr <= 0) return null;
    return calculateStepUpSip(amt, rate, yr, step);
  }, [stepUpMonthlyAmount, stepUpAnnualRate, stepUpYears, stepUpPercent]);

  // Handle calculator form submissions
  const handleSipSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSipCalculated(true);
  };

  const handleInfSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setInfCalculated(true);
  };

  const handleStepUpSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setStepUpCalculated(true);
  };

  // Preset arrays
  const amountPresets = [5000, 10000, 25000, 50000, 100000];
  const yearPresets = [3, 5, 10, 15, 20, 30];

  return (
    <div className="flex-1 flex flex-col bg-[var(--color-paper-1)] text-[var(--color-text)]">
      {/* ── Dashboard Menu ── */}
      {viewMode === 'selection' && (
        <div className="flex-1 max-w-7xl mx-auto w-full px-4 py-12 md:py-20 flex flex-col justify-center animate-[fadeIn_0.4s_ease-out]">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h1 className="text-4xl md:text-6xl font-display font-semibold mb-4 text-gradient tracking-tight leading-tight">
              SIP Calculator Suite
            </h1>
            <p className="text-[var(--color-text-muted)] text-base md:text-lg leading-relaxed">
              Plan, analyze, and build your automated wealth-building strategy. Select one of the modules below to get started.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Card 1: Standard SIP */}
            <div
              onClick={() => setViewMode('sip')}
              className="glass-card p-8 cursor-pointer group hover:border-[var(--color-accent-base)]/40 hover:-translate-y-1 transition-all duration-300 flex flex-col h-full relative"
            >
              <div className="w-14 h-14 rounded-2xl bg-[var(--color-accent-base)]/10 text-[var(--color-accent-base)] flex items-center justify-center mb-8 group-hover:scale-110 transition-transform duration-300">
                <Calculator className="w-7 h-7" />
              </div>
              <h3 className="text-2xl font-display font-semibold mb-3 group-hover:text-[var(--color-accent-base)] transition-colors">
                SIP Calculator
              </h3>
              <p className="text-[var(--color-text-muted)] text-sm leading-relaxed mb-8 flex-1">
                Calculate standard wealth accumulation based on compound interest rates. Estimate nominal gains and terminal value for systemic investments.
              </p>
              <div className="text-[var(--color-accent-base)] text-sm font-medium flex items-center gap-2">
                Launch Calculator
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1.5 transition-transform" />
              </div>
            </div>

            {/* Card 2: Inflation Adjusted SIP */}
            <div
              onClick={() => setViewMode('inflation')}
              className="glass-card p-8 cursor-pointer group hover:border-[#eab308]/40 hover:-translate-y-1 transition-all duration-300 flex flex-col h-full relative"
            >
              <div className="w-14 h-14 rounded-2xl bg-[#eab308]/10 text-[#eab308] flex items-center justify-center mb-8 group-hover:scale-110 transition-transform duration-300">
                <TrendingUp className="w-7 h-7" />
              </div>
              <h3 className="text-2xl font-display font-semibold mb-3 group-hover:text-[#eab308] transition-colors">
                Inflation Adjusted Calculator
              </h3>
              <p className="text-[var(--color-text-muted)] text-sm leading-relaxed mb-8 flex-1">
                Discount your future returns against expected inflation. Model what your future wealth will actually purchase in terms of today's money.
              </p>
              <div className="text-[#eab308] text-sm font-medium flex items-center gap-2">
                Launch Calculator
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1.5 transition-transform" />
              </div>
            </div>

            {/* Card 3: Step Up SIP */}
            <div
              onClick={() => setViewMode('stepup')}
              className="glass-card p-8 cursor-pointer group hover:border-[var(--color-accent-base)]/40 hover:-translate-y-1 transition-all duration-300 flex flex-col h-full relative"
            >
              <div className="w-14 h-14 rounded-2xl bg-[var(--color-accent-base)]/10 text-[var(--color-accent-base)] flex items-center justify-center mb-8 group-hover:scale-110 transition-transform duration-300">
                <TrendingUp className="w-7 h-7" />
              </div>
              <h3 className="text-2xl font-display font-semibold mb-3 group-hover:text-[var(--color-accent-base)] transition-colors">
                Step Up SIP
              </h3>
              <p className="text-[var(--color-text-muted)] text-sm leading-relaxed mb-8 flex-1">
                Account for annual salary hikes by increasing your SIP contribution every year. Model accelerated wealth creation.
              </p>
              <div className="text-[var(--color-accent-base)] text-sm font-medium flex items-center gap-2">
                Launch Calculator
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1.5 transition-transform" />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── Sub-header Navigation when inside a tool ── */}
      {viewMode !== 'selection' && (
        <div className="border-b border-[var(--color-border-subtle)] bg-[var(--color-paper-2)]/40 backdrop-blur-xl px-4 py-4 z-40 sticky top-16">
          <div className="max-w-7xl mx-auto flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <button
              onClick={() => {
                setViewMode('selection');
              }}
              className="flex items-center gap-2 text-sm text-[var(--color-text-muted)] hover:text-[var(--color-text)] transition-hallmark self-start"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Calculator Suite
            </button>
            <div className="flex bg-[var(--color-paper-3)] p-1 rounded-xl border border-[var(--color-border-subtle)]">
              {[
                { id: 'sip', label: 'SIP Calculator' },
                { id: 'inflation', label: 'Inflation Adjusted' },
                { id: 'stepup', label: 'Step Up SIP' },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => {
                    setViewMode(tab.id as any);
                  }}
                  className={`px-4 py-2 rounded-lg text-xs font-semibold transition-hallmark ${
                    viewMode === tab.id
                      ? 'bg-[var(--color-accent-base)] text-[var(--color-navy)] shadow-sm'
                      : 'text-[var(--color-text-muted)] hover:text-[var(--color-text)]'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ── 1. Standard SIP Calculator Module ── */}
      {viewMode === 'sip' && (
        <div className="flex-1 flex flex-col md:flex-row max-w-[1600px] mx-auto w-full min-w-0 overflow-hidden animate-[fadeIn_0.3s_ease-out]">
          <aside className="w-full md:w-[350px] lg:w-[400px] border-b md:border-b-0 md:border-r border-[var(--color-border-subtle)] bg-[var(--color-paper-1)] flex-shrink-0 md:sticky md:top-32 h-auto md:h-[calc(100vh-128px)] overflow-y-auto">
            <div className="p-6">
              <div className="mb-6">
                <h1 className="text-xl font-display font-semibold mb-2">Standard SIP Calculator</h1>
                <p className="text-xs text-[var(--color-text-muted)]">
                  Simulate your systematic investment compounding and project nominal wealth targets.
                </p>
              </div>

              <form onSubmit={handleSipSubmit} className="space-y-6">
                {/* Monthly Investment */}
                <div className="space-y-2">
                  <label className="text-xs font-semibold text-[var(--color-text-muted)] flex items-center justify-between uppercase tracking-wider">
                    Monthly Investment
                    <span className="fin-number text-[var(--color-accent-base)] font-bold">
                      {formatCurrencyFull(Number(sipMonthlyAmount) || 0)}
                    </span>
                  </label>
                  <input
                    type="range"
                    min="1000"
                    max="500000"
                    step="1000"
                    value={sipMonthlyAmount}
                    onChange={(e) => setSipMonthlyAmount(e.target.value)}
                    className="w-full h-2 rounded-full appearance-none cursor-pointer bg-[var(--color-paper-3)] accent-[var(--color-accent-base)]"
                  />
                  <div className="flex flex-wrap gap-1.5 mt-2">
                    {amountPresets.map((preset) => (
                      <button
                        key={preset}
                        type="button"
                        onClick={() => setSipMonthlyAmount(String(preset))}
                        className={`px-2.5 py-1.5 rounded-lg text-[10px] font-bold transition-hallmark border ${
                          Number(sipMonthlyAmount) === preset
                            ? 'bg-[var(--color-accent-base)]/15 border-[var(--color-accent-base)]/30 text-[var(--color-accent-base)]'
                            : 'bg-[var(--color-paper-2)] border-[var(--color-border-subtle)] text-[var(--color-text-muted)] hover:border-white/10'
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
                    value={sipMonthlyAmount}
                    onChange={(e) => setSipMonthlyAmount(e.target.value)}
                    className="w-full bg-[var(--color-paper-2)] border border-[var(--color-border-subtle)] rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[var(--color-accent-base)] transition-hallmark fin-number"
                    required
                  />
                </div>

                {/* Expected Return */}
                <div className="space-y-2">
                  <label className="text-xs font-semibold text-[var(--color-text-muted)] flex items-center justify-between uppercase tracking-wider">
                    Expected Return (%)
                    <span className="fin-number text-[var(--color-accent-base)] font-bold">
                      {sipAnnualRate}%
                    </span>
                  </label>
                  <input
                    type="range"
                    min="1"
                    max="50"
                    step="0.5"
                    value={sipAnnualRate}
                    onChange={(e) => setSipAnnualRate(e.target.value)}
                    className="w-full h-2 rounded-full appearance-none cursor-pointer bg-[var(--color-paper-3)] accent-[var(--color-accent-base)]"
                  />
                  <input
                    type="number"
                    min="0.1"
                    max="100"
                    step="0.1"
                    value={sipAnnualRate}
                    onChange={(e) => setSipAnnualRate(e.target.value)}
                    className="w-full bg-[var(--color-paper-2)] border border-[var(--color-border-subtle)] rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[var(--color-accent-base)] transition-hallmark fin-number"
                    required
                  />
                </div>

                {/* Years */}
                <div className="space-y-2">
                  <label className="text-xs font-semibold text-[var(--color-text-muted)] flex items-center justify-between uppercase tracking-wider">
                    Duration (Years)
                    <span className="fin-number text-[var(--color-accent-base)] font-bold">
                      {sipYears} yrs
                    </span>
                  </label>
                  <input
                    type="range"
                    min="1"
                    max="40"
                    step="1"
                    value={sipYears}
                    onChange={(e) => setSipYears(e.target.value)}
                    className="w-full h-2 rounded-full appearance-none cursor-pointer bg-[var(--color-paper-3)] accent-[var(--color-accent-base)]"
                  />
                  <div className="flex flex-wrap gap-1.5 mt-2">
                    {yearPresets.map((preset) => (
                      <button
                        key={preset}
                        type="button"
                        onClick={() => setSipYears(String(preset))}
                        className={`px-2.5 py-1.5 rounded-lg text-[10px] font-bold transition-hallmark border ${
                          Number(sipYears) === preset
                            ? 'bg-[var(--color-accent-base)]/15 border-[var(--color-accent-base)]/30 text-[var(--color-accent-base)]'
                            : 'bg-[var(--color-paper-2)] border-[var(--color-border-subtle)] text-[var(--color-text-muted)] hover:border-white/10'
                        }`}
                      >
                        {preset}Y
                      </button>
                    ))}
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full bg-[var(--color-accent-base)] hover:bg-[var(--color-accent-hover)] text-[var(--color-navy)] font-semibold py-3 rounded-lg transition-hallmark flex items-center justify-center gap-2 mt-4 shadow-sm"
                >
                  <Calculator className="w-4 h-4" />
                  Calculate Nominal Returns
                </button>
              </form>
            </div>
          </aside>

          <main className="flex-1 bg-[var(--color-paper-1)] min-h-[500px] flex flex-col min-w-0 w-full overflow-hidden">
            {!sipCalculated ? (
              <div className="flex-1 flex flex-col items-center justify-center p-8 text-center animate-[fadeIn_0.2s_ease-out]">
                <div className="w-16 h-16 rounded-full bg-[var(--color-paper-2)] border border-[var(--color-border-subtle)] flex items-center justify-center mb-4">
                  <Calculator className="w-6 h-6 text-[var(--color-text-muted)]" />
                </div>
                <h3 className="text-xl font-display font-semibold mb-1">Set SIP Parameters</h3>
                <p className="text-xs text-[var(--color-text-muted)] max-w-xs">
                  Adjust investment amount, growth rate, and duration on the left to view compound return projections.
                </p>
              </div>
            ) : sipResult ? (
              <div className="p-6 max-w-5xl w-full mx-auto space-y-8 overflow-y-auto animate-[fadeIn_0.3s_ease-out]">
                {/* Header overview */}
                <div className="border-b border-[var(--color-border-subtle)] pb-4">
                  <p className="text-xs text-[var(--color-text-muted)] uppercase tracking-wider font-semibold">Projected Outlook</p>
                  <h2 className="text-2xl md:text-3xl font-display font-semibold mt-1">
                    {formatCurrencyFull(Number(sipMonthlyAmount))} / mo{' '}
                    <span className="text-base text-[var(--color-text-muted)] font-normal">
                      for {sipYears} Years @ {sipAnnualRate}% returns
                    </span>
                  </h2>
                </div>

                {/* Stat cards */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <StatCard icon={IndianRupee} label="Total Invested" value={formatCurrencyFull(sipResult.totalInvested)} />
                  <StatCard icon={Wallet} label="Nominal Value" value={formatCurrencyFull(Math.round(sipResult.futureValue))} accent />
                  <StatCard icon={TrendingUp} label="Wealth Gained" value={formatCurrencyFull(Math.round(sipResult.wealthGained))} />
                  <StatCard icon={Percent} label="Nominal Return" value={`${sipResult.returnPercent.toFixed(1)}%`} accent />
                </div>

                {/* Donut and metrics summary */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="glass-card p-6 flex items-center justify-center bg-[var(--color-paper-2)]">
                    <DonutChart invested={sipResult.totalInvested} returns={sipResult.wealthGained} />
                  </div>
                  <div className="glass-card p-6 flex flex-col justify-between bg-[var(--color-paper-2)]">
                    <h4 className="font-display font-semibold text-sm mb-4 border-b border-[var(--color-border-subtle)] pb-2 uppercase tracking-wider text-[var(--color-text-muted)]">
                      Investment Ledger
                    </h4>
                    <div className="space-y-4 flex-1 text-sm">
                      <div className="flex justify-between items-center py-2 border-b border-[var(--color-border-subtle)]">
                        <span className="text-[var(--color-text-muted)] font-medium">Investments Made</span>
                        <span className="fin-number font-semibold">{Number(sipYears) * 12} monthly payments</span>
                      </div>
                      <div className="flex justify-between items-center py-2 border-b border-[var(--color-border-subtle)]">
                        <span className="text-[var(--color-text-muted)] font-medium">Principal Invested</span>
                        <span className="fin-number font-semibold">{formatCurrencyFull(sipResult.totalInvested)}</span>
                      </div>
                      <div className="flex justify-between items-center py-2 border-b border-[var(--color-border-subtle)]">
                        <span className="text-[var(--color-text-muted)] font-medium">Compounded Returns</span>
                        <span className="fin-number font-semibold text-[var(--color-accent-base)]">+{formatCurrencyFull(Math.round(sipResult.wealthGained))}</span>
                      </div>
                      <div className="flex justify-between items-center py-2">
                        <span className="text-[var(--color-text-muted)] font-medium">Growth Multiple</span>
                        <span className="fin-number font-bold text-[var(--color-accent-base)]">
                          {(sipResult.futureValue / sipResult.totalInvested).toFixed(2)}x
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Line Chart */}
                <div className="glass-card p-6 bg-[var(--color-paper-2)]">
                  <h3 className="font-display font-semibold text-sm mb-6 uppercase tracking-wider text-[var(--color-text-muted)]">
                    Nominal Growth Projection
                  </h3>
                  <div className="h-[280px] w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart
                        data={sipResult.yearlyData.map((d) => ({
                          year: `Yr ${d.year}`,
                          Invested: Math.round(d.invested),
                          Total: Math.round(d.total),
                        }))}
                        margin={{ top: 10, right: 5, left: 5, bottom: 0 }}
                      >
                        <defs>
                          <linearGradient id="sipTotalGrad" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="var(--color-accent-base)" stopOpacity={0.2} />
                            <stop offset="95%" stopColor="var(--color-accent-base)" stopOpacity={0} />
                          </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--color-border)" opacity={0.1} />
                        <XAxis dataKey="year" axisLine={false} tickLine={false} tick={{ fill: 'var(--color-text-muted)', fontSize: 10, fontFamily: 'var(--font-mono)' }} />
                        <YAxis
                          axisLine={false}
                          tickLine={false}
                          tick={{ fill: 'var(--color-text-muted)', fontSize: 10, fontFamily: 'var(--font-mono)' }}
                          tickFormatter={(val) => {
                            const n = Number(val);
                            if (n >= 1e7) return `${(n / 1e7).toFixed(1)}Cr`;
                            if (n >= 1e5) return `${(n / 1e5).toFixed(0)}L`;
                            return `${(n / 1e3).toFixed(0)}K`;
                          }}
                        />
                        <Tooltip
                          contentStyle={{ backgroundColor: 'var(--color-paper-2)', borderColor: 'var(--color-border)', borderRadius: '8px' }}
                          labelStyle={{ color: 'var(--color-text-muted)', fontWeight: 'bold' }}
                          formatter={(value: unknown, name: any) => [formatCurrencyFull(Number(value)), name]}
                        />
                        <Area type="monotone" dataKey="Total" stroke="var(--color-accent-base)" strokeWidth={2} fill="url(#sipTotalGrad)" name="Total Portfolio" />
                        <Area type="monotone" dataKey="Invested" stroke="var(--color-text-muted)" strokeWidth={1} strokeDasharray="3 3" fill="none" name="Invested Capital" />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                {/* Table breakdown */}
                <div className="glass-card overflow-hidden bg-[var(--color-paper-2)]">
                  <div className="px-6 py-4 border-b border-[var(--color-border-subtle)]">
                    <h3 className="font-display font-semibold text-sm uppercase tracking-wider text-[var(--color-text-muted)]">
                      Yearly Breakdown Ledger
                    </h3>
                  </div>
                  <div className="overflow-x-auto">
                    <table className="w-full text-xs text-left">
                      <thead className="text-[10px] uppercase tracking-wider text-[var(--color-text-muted)] border-b border-[var(--color-border-subtle)] bg-[var(--color-paper-3)]/30">
                        <tr>
                          <th className="px-6 py-3 font-semibold">Year</th>
                          <th className="px-6 py-3 font-semibold text-right">Invested Principal</th>
                          <th className="px-6 py-3 font-semibold text-right">Returns Accrued</th>
                          <th className="px-6 py-3 font-semibold text-right">Future Nominal Value</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-[var(--color-border-subtle)]">
                        {sipResult.yearlyData.map((row) => (
                          <tr key={row.year} className="hover:bg-white/[0.01] transition-hallmark">
                            <td className="px-6 py-3.5 fin-number font-medium">Year {row.year}</td>
                            <td className="px-6 py-3.5 text-right fin-number">{formatCurrencyFull(row.invested)}</td>
                            <td className="px-6 py-3.5 text-right fin-number text-[var(--color-accent-base)]">+{formatCurrencyFull(Math.round(row.returns))}</td>
                            <td className="px-6 py-3.5 text-right fin-number font-semibold">{formatCurrencyFull(Math.round(row.total))}</td>
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
      )}

      {/* ── 2. Inflation Adjusted Calculator Module ── */}
      {viewMode === 'inflation' && (
        <div className="flex-1 flex flex-col md:flex-row max-w-[1600px] mx-auto w-full min-w-0 overflow-hidden animate-[fadeIn_0.3s_ease-out]">
          <aside className="w-full md:w-[350px] lg:w-[400px] border-b md:border-b-0 md:border-r border-[var(--color-border-subtle)] bg-[var(--color-paper-1)] flex-shrink-0 md:sticky md:top-32 h-auto md:h-[calc(100vh-128px)] overflow-y-auto">
            <div className="p-6">
              <div className="mb-6">
                <h1 className="text-xl font-display font-semibold mb-2">Inflation Adjusted Calculator</h1>
                <p className="text-xs text-[var(--color-text-muted)]">
                  Measure what your future portfolio value is actually worth in terms of today's purchasing power.
                </p>
              </div>

              <form onSubmit={handleInfSubmit} className="space-y-6">
                {/* Monthly Investment */}
                <div className="space-y-2">
                  <label className="text-xs font-semibold text-[var(--color-text-muted)] flex items-center justify-between uppercase tracking-wider">
                    Monthly Investment
                    <span className="fin-number text-[var(--color-accent-base)] font-bold">
                      {formatCurrencyFull(Number(infMonthlyAmount) || 0)}
                    </span>
                  </label>
                  <input
                    type="range"
                    min="1000"
                    max="500000"
                    step="1000"
                    value={infMonthlyAmount}
                    onChange={(e) => setInfMonthlyAmount(e.target.value)}
                    className="w-full h-2 rounded-full appearance-none cursor-pointer bg-[var(--color-paper-3)] accent-[var(--color-accent-base)]"
                  />
                  <div className="flex flex-wrap gap-1.5 mt-2">
                    {amountPresets.map((preset) => (
                      <button
                        key={preset}
                        type="button"
                        onClick={() => setInfMonthlyAmount(String(preset))}
                        className={`px-2.5 py-1.5 rounded-lg text-[10px] font-bold transition-hallmark border ${
                          Number(infMonthlyAmount) === preset
                            ? 'bg-[var(--color-accent-base)]/15 border-[var(--color-accent-base)]/30 text-[var(--color-accent-base)]'
                            : 'bg-[var(--color-paper-2)] border-[var(--color-border-subtle)] text-[var(--color-text-muted)] hover:border-white/10'
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
                    value={infMonthlyAmount}
                    onChange={(e) => setInfMonthlyAmount(e.target.value)}
                    className="w-full bg-[var(--color-paper-2)] border border-[var(--color-border-subtle)] rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[var(--color-accent-base)] transition-hallmark fin-number"
                    required
                  />
                </div>

                {/* Expected Return */}
                <div className="space-y-2">
                  <label className="text-xs font-semibold text-[var(--color-text-muted)] flex items-center justify-between uppercase tracking-wider">
                    Expected Return (%)
                    <span className="fin-number text-[var(--color-accent-base)] font-bold">
                      {infAnnualRate}%
                    </span>
                  </label>
                  <input
                    type="range"
                    min="1"
                    max="50"
                    step="0.5"
                    value={infAnnualRate}
                    onChange={(e) => setInfAnnualRate(e.target.value)}
                    className="w-full h-2 rounded-full appearance-none cursor-pointer bg-[var(--color-paper-3)] accent-[var(--color-accent-base)]"
                  />
                  <input
                    type="number"
                    min="0.1"
                    max="100"
                    step="0.1"
                    value={infAnnualRate}
                    onChange={(e) => setInfAnnualRate(e.target.value)}
                    className="w-full bg-[var(--color-paper-2)] border border-[var(--color-border-subtle)] rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[var(--color-accent-base)] transition-hallmark fin-number"
                    required
                  />
                </div>

                {/* Expected Inflation */}
                <div className="space-y-2">
                  <label className="text-xs font-semibold text-[var(--color-text-muted)] flex items-center justify-between uppercase tracking-wider">
                    Expected Inflation (%)
                    <span className="fin-number text-[#eab308] font-bold">
                      {infInflationRate}%
                    </span>
                  </label>
                  <input
                    type="range"
                    min="0"
                    max="25"
                    step="0.5"
                    value={infInflationRate}
                    onChange={(e) => setInfInflationRate(e.target.value)}
                    className="w-full h-2 rounded-full appearance-none cursor-pointer bg-[var(--color-paper-3)] accent-[#eab308]"
                  />
                  <input
                    type="number"
                    min="0"
                    max="30"
                    step="0.1"
                    value={infInflationRate}
                    onChange={(e) => setInfInflationRate(e.target.value)}
                    className="w-full bg-[var(--color-paper-2)] border border-[var(--color-border-subtle)] rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#eab308] transition-hallmark fin-number"
                    required
                  />
                </div>

                {/* Duration */}
                <div className="space-y-2">
                  <label className="text-xs font-semibold text-[var(--color-text-muted)] flex items-center justify-between uppercase tracking-wider">
                    Duration (Years)
                    <span className="fin-number text-[var(--color-accent-base)] font-bold">
                      {infYears} yrs
                    </span>
                  </label>
                  <input
                    type="range"
                    min="1"
                    max="40"
                    step="1"
                    value={infYears}
                    onChange={(e) => setInfYears(e.target.value)}
                    className="w-full h-2 rounded-full appearance-none cursor-pointer bg-[var(--color-paper-3)] accent-[var(--color-accent-base)]"
                  />
                  <div className="flex flex-wrap gap-1.5 mt-2">
                    {yearPresets.map((preset) => (
                      <button
                        key={preset}
                        type="button"
                        onClick={() => setInfYears(String(preset))}
                        className={`px-2.5 py-1.5 rounded-lg text-[10px] font-bold transition-hallmark border ${
                          Number(infYears) === preset
                            ? 'bg-[var(--color-accent-base)]/15 border-[var(--color-accent-base)]/30 text-[var(--color-accent-base)]'
                            : 'bg-[var(--color-paper-2)] border-[var(--color-border-subtle)] text-[var(--color-text-muted)] hover:border-white/10'
                        }`}
                      >
                        {preset}Y
                      </button>
                    ))}
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full bg-[#eab308] hover:bg-[#d9a307] text-[var(--color-navy)] font-semibold py-3 rounded-lg transition-hallmark flex items-center justify-center gap-2 mt-4 shadow-sm"
                >
                  <TrendingUp className="w-4 h-4" />
                  Calculate Real Purchasing Value
                </button>
              </form>
            </div>
          </aside>

          <main className="flex-1 bg-[var(--color-paper-1)] min-h-[500px] flex flex-col min-w-0 w-full overflow-hidden">
            {!infCalculated ? (
              <div className="flex-1 flex flex-col items-center justify-center p-8 text-center animate-[fadeIn_0.2s_ease-out]">
                <div className="w-16 h-16 rounded-full bg-[var(--color-paper-2)] border border-[var(--color-border-subtle)] flex items-center justify-center mb-4">
                  <TrendingUp className="w-6 h-6 text-[var(--color-text-muted)]" />
                </div>
                <h3 className="text-xl font-display font-semibold mb-1">Compute Real Values</h3>
                <p className="text-xs text-[var(--color-text-muted)] max-w-xs">
                  Set amounts, returns, and expected inflation on the left to see the inflation-discounted value of your portfolio.
                </p>
              </div>
            ) : infResult ? (
              <div className="p-6 max-w-5xl w-full mx-auto space-y-8 overflow-y-auto animate-[fadeIn_0.3s_ease-out]">
                {/* Header */}
                <div className="border-b border-[var(--color-border-subtle)] pb-4">
                  <p className="text-xs text-[var(--color-text-muted)] uppercase tracking-wider font-semibold">Real purchasing power outlook</p>
                  <h2 className="text-2xl md:text-3xl font-display font-semibold mt-1">
                    {formatCurrencyFull(Number(infMonthlyAmount))} / mo{' '}
                    <span className="text-base text-[var(--color-text-muted)] font-normal">
                      for {infYears} yrs @ {infAnnualRate}% returns (Discounted @ {infInflationRate}% inflation)
                    </span>
                  </h2>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
                  <StatCard icon={IndianRupee} label="Invested Principal" value={formatCurrencyFull(infResult.totalInvested)} />
                  <StatCard icon={Wallet} label="Nominal Value" value={formatCurrencyFull(Math.round(infResult.futureValue))} accent />
                  <StatCard icon={ShieldCheck} label="Adjusted Value" value={formatCurrencyFull(Math.round(infResult.adjustedFutureValue))} warning />
                  <StatCard icon={TrendingUp} label="Real Wealth Gained" value={formatCurrencyFull(Math.round(infResult.adjustedWealthGained))} />
                  <StatCard icon={Percent} label="Real Multiplier" value={`${(infResult.adjustedFutureValue / infResult.totalInvested).toFixed(2)}x`} warning />
                </div>

                {/* Donut & Callout Info */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="glass-card p-6 flex items-center justify-center bg-[var(--color-paper-2)]">
                    <DonutChart invested={infResult.totalInvested} returns={infResult.adjustedWealthGained} title="Adjusted Value" />
                  </div>
                  <div className="glass-card p-6 flex flex-col justify-center bg-[var(--color-paper-2)] border-l-4 border-l-[#eab308]">
                    <h4 className="font-display font-bold text-sm text-[#eab308] uppercase tracking-wider mb-2">
                      Understanding Inflation Risk
                    </h4>
                    <div className="text-xs text-[var(--color-text-muted)] leading-relaxed space-y-2">
                      Inflation erodes the purchasing power of capital over time. 
                      While your nominal returns show a portfolio value of <strong>{formatCurrency(infResult.futureValue)}</strong> in {infYears} years, 
                      its purchasing power will be equivalent to only <strong>{formatCurrency(infResult.adjustedFutureValue)}</strong> in today's rupee valuation.
                      <br /><br />
                      This means that if you target a particular purchase in {infYears} years, you must plan your savings based on the <strong>Inflation Adjusted Value</strong>, not the nominal target.
                    </div>
                  </div>
                </div>

                {/* Area Chart showing widening gap */}
                <div className="glass-card p-6 bg-[var(--color-paper-2)]">
                  <h3 className="font-display font-semibold text-sm mb-6 uppercase tracking-wider text-[var(--color-text-muted)]">
                    Nominal Value vs Inflation-Adjusted Value Over Time
                  </h3>
                  <div className="h-[300px] w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart
                        data={infResult.yearlyData.map((d) => ({
                          year: `Yr ${d.year}`,
                          Invested: Math.round(d.invested),
                          Nominal: Math.round(d.total),
                          Adjusted: Math.round(d.adjustedTotal),
                        }))}
                        margin={{ top: 10, right: 5, left: 5, bottom: 0 }}
                      >
                        <defs>
                          <linearGradient id="nomGrad" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="var(--color-accent-base)" stopOpacity={0.15} />
                            <stop offset="95%" stopColor="var(--color-accent-base)" stopOpacity={0} />
                          </linearGradient>
                          <linearGradient id="adjGrad" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#eab308" stopOpacity={0.15} />
                            <stop offset="95%" stopColor="#eab308" stopOpacity={0} />
                          </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--color-border)" opacity={0.1} />
                        <XAxis dataKey="year" axisLine={false} tickLine={false} tick={{ fill: 'var(--color-text-muted)', fontSize: 10, fontFamily: 'var(--font-mono)' }} />
                        <YAxis
                          axisLine={false}
                          tickLine={false}
                          tick={{ fill: 'var(--color-text-muted)', fontSize: 10, fontFamily: 'var(--font-mono)' }}
                          tickFormatter={(val) => {
                            const n = Number(val);
                            if (n >= 1e7) return `${(n / 1e7).toFixed(1)}Cr`;
                            if (n >= 1e5) return `${(n / 1e5).toFixed(0)}L`;
                            return `${(n / 1e3).toFixed(0)}K`;
                          }}
                        />
                        <Tooltip
                          contentStyle={{ backgroundColor: 'var(--color-paper-2)', borderColor: 'var(--color-border)', borderRadius: '8px' }}
                          labelStyle={{ color: 'var(--color-text-muted)', fontWeight: 'bold' }}
                          formatter={(value: unknown, name: any) => [formatCurrencyFull(Number(value)), name]}
                        />
                        <Area type="monotone" dataKey="Nominal" stroke="var(--color-accent-base)" strokeWidth={2} fill="url(#nomGrad)" name="Nominal Value" />
                        <Area type="monotone" dataKey="Adjusted" stroke="#eab308" strokeWidth={2} fill="url(#adjGrad)" name="Adjusted Value" />
                        <Area type="monotone" dataKey="Invested" stroke="var(--color-text-muted)" strokeWidth={1} strokeDasharray="3 3" fill="none" name="Invested Principal" />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                {/* Table comparison */}
                <div className="glass-card overflow-hidden bg-[var(--color-paper-2)]">
                  <div className="px-6 py-4 border-b border-[var(--color-border-subtle)]">
                    <h3 className="font-display font-semibold text-sm uppercase tracking-wider text-[var(--color-text-muted)]">
                      Year-wise Nominal vs. Adjusted Values
                    </h3>
                  </div>
                  <div className="overflow-x-auto">
                    <table className="w-full text-xs text-left">
                      <thead className="text-[10px] uppercase tracking-wider text-[var(--color-text-muted)] border-b border-[var(--color-border-subtle)] bg-[var(--color-paper-3)]/30">
                        <tr>
                          <th className="px-6 py-3 font-semibold">Year</th>
                          <th className="px-6 py-3 font-semibold text-right">Invested Principal</th>
                          <th className="px-6 py-3 font-semibold text-right">Nominal Value</th>
                          <th className="px-6 py-3 font-semibold text-right">Inflation Adjusted</th>
                          <th className="px-6 py-3 font-semibold text-right">Purchasing Loss</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-[var(--color-border-subtle)]">
                        {infResult.yearlyData.map((row) => {
                          const loss = row.total - row.adjustedTotal;
                          return (
                            <tr key={row.year} className="hover:bg-white/[0.01] transition-hallmark">
                              <td className="px-6 py-3.5 fin-number font-medium">Year {row.year}</td>
                              <td className="px-6 py-3.5 text-right fin-number">{formatCurrencyFull(row.invested)}</td>
                              <td className="px-6 py-3.5 text-right fin-number text-[var(--color-accent-base)]">{formatCurrencyFull(Math.round(row.total))}</td>
                              <td className="px-6 py-3.5 text-right fin-number text-[#eab308] font-semibold">{formatCurrencyFull(Math.round(row.adjustedTotal))}</td>
                              <td className="px-6 py-3.5 text-right fin-number text-[var(--color-negative-base)]">-{formatCurrencyFull(Math.round(loss))}</td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            ) : null}
          </main>
        </div>
      )}

      {/* ── 3. Step Up SIP Calculator Module ── */}
      {viewMode === 'stepup' && (
        <div className="flex-1 flex flex-col md:flex-row max-w-[1600px] mx-auto w-full min-w-0 overflow-hidden animate-[fadeIn_0.3s_ease-out]">
          <aside className="w-full md:w-[350px] lg:w-[400px] border-b md:border-b-0 md:border-r border-[var(--color-border-subtle)] bg-[var(--color-paper-1)] flex-shrink-0 md:sticky md:top-32 h-auto md:h-[calc(100vh-128px)] overflow-y-auto">
            <div className="p-6">
              <div className="mb-6">
                <h1 className="text-xl font-display font-semibold mb-2">Step Up SIP Calculator</h1>
                <p className="text-xs text-[var(--color-text-muted)]">
                  Account for annual salary hikes by automatically increasing your SIP contribution every year.
                </p>
              </div>

              <form onSubmit={handleStepUpSubmit} className="space-y-6">
                {/* Monthly Investment */}
                <div className="space-y-2">
                  <label className="text-xs font-semibold text-[var(--color-text-muted)] flex items-center justify-between uppercase tracking-wider">
                    Initial Monthly Investment
                    <span className="fin-number text-[var(--color-accent-base)] font-bold">
                      {formatCurrencyFull(Number(stepUpMonthlyAmount) || 0)}
                    </span>
                  </label>
                  <input
                    type="range"
                    min="1000"
                    max="500000"
                    step="1000"
                    value={stepUpMonthlyAmount}
                    onChange={(e) => setStepUpMonthlyAmount(e.target.value)}
                    className="w-full h-2 rounded-full appearance-none cursor-pointer bg-[var(--color-paper-3)] accent-[var(--color-accent-base)]"
                  />
                  <input
                    type="number"
                    min="1000"
                    step="1000"
                    value={stepUpMonthlyAmount}
                    onChange={(e) => setStepUpMonthlyAmount(e.target.value)}
                    className="w-full bg-[var(--color-paper-2)] border border-[var(--color-border-subtle)] rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[var(--color-accent-base)] transition-hallmark fin-number"
                    required
                  />
                </div>

                {/* Expected Return */}
                <div className="space-y-2">
                  <label className="text-xs font-semibold text-[var(--color-text-muted)] flex items-center justify-between uppercase tracking-wider">
                    Expected Return (%)
                    <span className="fin-number text-[var(--color-accent-base)] font-bold">
                      {stepUpAnnualRate}%
                    </span>
                  </label>
                  <input
                    type="range"
                    min="1"
                    max="50"
                    step="0.5"
                    value={stepUpAnnualRate}
                    onChange={(e) => setStepUpAnnualRate(e.target.value)}
                    className="w-full h-2 rounded-full appearance-none cursor-pointer bg-[var(--color-paper-3)] accent-[var(--color-accent-base)]"
                  />
                  <input
                    type="number"
                    min="0.1"
                    max="100"
                    step="0.1"
                    value={stepUpAnnualRate}
                    onChange={(e) => setStepUpAnnualRate(e.target.value)}
                    className="w-full bg-[var(--color-paper-2)] border border-[var(--color-border-subtle)] rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[var(--color-accent-base)] transition-hallmark fin-number"
                    required
                  />
                </div>

                {/* Step Up Percent */}
                <div className="space-y-2">
                  <label className="text-xs font-semibold text-[var(--color-text-muted)] flex items-center justify-between uppercase tracking-wider">
                    Annual Step Up (%)
                    <span className="fin-number text-[var(--color-accent-base)] font-bold">
                      {stepUpPercent}%
                    </span>
                  </label>
                  <input
                    type="range"
                    min="0"
                    max="50"
                    step="1"
                    value={stepUpPercent}
                    onChange={(e) => setStepUpPercent(e.target.value)}
                    className="w-full h-2 rounded-full appearance-none cursor-pointer bg-[var(--color-paper-3)] accent-[var(--color-accent-base)]"
                  />
                  <input
                    type="number"
                    min="0"
                    max="100"
                    step="1"
                    value={stepUpPercent}
                    onChange={(e) => setStepUpPercent(e.target.value)}
                    className="w-full bg-[var(--color-paper-2)] border border-[var(--color-border-subtle)] rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[var(--color-accent-base)] transition-hallmark fin-number"
                    required
                  />
                </div>

                {/* Years */}
                <div className="space-y-2">
                  <label className="text-xs font-semibold text-[var(--color-text-muted)] flex items-center justify-between uppercase tracking-wider">
                    Duration (Years)
                    <span className="fin-number text-[var(--color-accent-base)] font-bold">
                      {stepUpYears} yrs
                    </span>
                  </label>
                  <input
                    type="range"
                    min="1"
                    max="40"
                    step="1"
                    value={stepUpYears}
                    onChange={(e) => setStepUpYears(e.target.value)}
                    className="w-full h-2 rounded-full appearance-none cursor-pointer bg-[var(--color-paper-3)] accent-[var(--color-accent-base)]"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full bg-[var(--color-accent-base)] hover:bg-[var(--color-accent-hover)] text-[var(--color-navy)] font-semibold py-3 rounded-lg transition-hallmark flex items-center justify-center gap-2 mt-4 shadow-sm"
                >
                  <ArrowUpCircle className="w-4 h-4" />
                  Calculate Step Up Wealth
                </button>
              </form>
            </div>
          </aside>

          <main className="flex-1 bg-[var(--color-paper-1)] min-h-[500px] flex flex-col min-w-0 w-full overflow-hidden">
            {!stepUpCalculated ? (
              <div className="flex-1 flex flex-col items-center justify-center p-8 text-center animate-[fadeIn_0.2s_ease-out]">
                <div className="w-16 h-16 rounded-full bg-[var(--color-paper-2)] border border-[var(--color-border-subtle)] flex items-center justify-center mb-4">
                  <ArrowUpCircle className="w-6 h-6 text-[var(--color-text-muted)]" />
                </div>
                <h3 className="text-xl font-display font-semibold mb-1">Accelerated Wealth Planning</h3>
                <p className="text-xs text-[var(--color-text-muted)] max-w-xs">
                  Set your initial amount, expected returns, and how much you plan to increase your contribution each year.
                </p>
              </div>
            ) : stepUpResult ? (
              <div className="p-6 max-w-5xl w-full mx-auto space-y-8 overflow-y-auto animate-[fadeIn_0.3s_ease-out]">
                {/* Header overview */}
                <div className="border-b border-[var(--color-border-subtle)] pb-4">
                  <p className="text-xs text-[var(--color-text-muted)] uppercase tracking-wider font-semibold">Step Up Projection</p>
                  <h2 className="text-2xl md:text-3xl font-display font-semibold mt-1">
                    {formatCurrencyFull(Number(stepUpMonthlyAmount))} / mo{' '}
                    <span className="text-base text-[var(--color-text-muted)] font-normal">
                      stepping up {stepUpPercent}% yearly, for {stepUpYears} Years @ {stepUpAnnualRate}% returns
                    </span>
                  </h2>
                </div>

                {/* Stat cards */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <StatCard icon={IndianRupee} label="Total Invested" value={formatCurrencyFull(stepUpResult.totalInvested)} />
                  <StatCard icon={Wallet} label="Nominal Value" value={formatCurrencyFull(Math.round(stepUpResult.futureValue))} accent />
                  <StatCard icon={TrendingUp} label="Wealth Gained" value={formatCurrencyFull(Math.round(stepUpResult.wealthGained))} />
                  <StatCard icon={Percent} label="Return Multiple" value={`${(stepUpResult.futureValue / stepUpResult.totalInvested).toFixed(2)}x`} accent />
                </div>

                {/* Line Chart */}
                <div className="glass-card p-6 bg-[var(--color-paper-2)]">
                  <h3 className="font-display font-semibold text-sm mb-6 uppercase tracking-wider text-[var(--color-text-muted)]">
                    Accelerated Growth Curve
                  </h3>
                  <div className="h-[280px] w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart
                        data={stepUpResult.yearlyData.map((d) => ({
                          year: `Yr ${d.year}`,
                          Invested: Math.round(d.invested),
                          Total: Math.round(d.total),
                        }))}
                        margin={{ top: 10, right: 5, left: 5, bottom: 0 }}
                      >
                        <defs>
                          <linearGradient id="stepTotalGrad" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="var(--color-accent-base)" stopOpacity={0.2} />
                            <stop offset="95%" stopColor="var(--color-accent-base)" stopOpacity={0} />
                          </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--color-border)" opacity={0.1} />
                        <XAxis dataKey="year" axisLine={false} tickLine={false} tick={{ fill: 'var(--color-text-muted)', fontSize: 10, fontFamily: 'var(--font-mono)' }} />
                        <YAxis
                          axisLine={false}
                          tickLine={false}
                          tick={{ fill: 'var(--color-text-muted)', fontSize: 10, fontFamily: 'var(--font-mono)' }}
                          tickFormatter={(val) => {
                            const n = Number(val);
                            if (n >= 1e7) return `${(n / 1e7).toFixed(1)}Cr`;
                            if (n >= 1e5) return `${(n / 1e5).toFixed(0)}L`;
                            return `${(n / 1e3).toFixed(0)}K`;
                          }}
                        />
                        <Tooltip
                          contentStyle={{ backgroundColor: 'var(--color-paper-2)', borderColor: 'var(--color-border)', borderRadius: '8px' }}
                          labelStyle={{ color: 'var(--color-text-muted)', fontWeight: 'bold' }}
                          formatter={(value, name) => [formatCurrencyFull(Number(value)), name]}
                        />
                        <Area type="monotone" dataKey="Total" stroke="var(--color-accent-base)" strokeWidth={2} fill="url(#stepTotalGrad)" name="Total Portfolio" />
                        <Area type="monotone" dataKey="Invested" stroke="var(--color-text-muted)" strokeWidth={1} strokeDasharray="3 3" fill="none" name="Invested Capital" />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                {/* Table breakdown */}
                <div className="glass-card overflow-hidden bg-[var(--color-paper-2)]">
                  <div className="px-6 py-4 border-b border-[var(--color-border-subtle)]">
                    <h3 className="font-display font-semibold text-sm uppercase tracking-wider text-[var(--color-text-muted)]">
                      Yearly Contribution Ledger
                    </h3>
                  </div>
                  <div className="overflow-x-auto">
                    <table className="w-full text-xs text-left">
                      <thead className="text-[10px] uppercase tracking-wider text-[var(--color-text-muted)] border-b border-[var(--color-border-subtle)] bg-[var(--color-paper-3)]/30">
                        <tr>
                          <th className="px-6 py-3 font-semibold">Year</th>
                          <th className="px-6 py-3 font-semibold text-right">Cumulative Principal</th>
                          <th className="px-6 py-3 font-semibold text-right">Returns Accrued</th>
                          <th className="px-6 py-3 font-semibold text-right">Future Value</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-[var(--color-border-subtle)]">
                        {stepUpResult.yearlyData.map((row) => (
                          <tr key={row.year} className="hover:bg-white/[0.01] transition-hallmark">
                            <td className="px-6 py-3.5 fin-number font-medium">Year {row.year}</td>
                            <td className="px-6 py-3.5 text-right fin-number">{formatCurrencyFull(row.invested)}</td>
                            <td className="px-6 py-3.5 text-right fin-number text-[var(--color-accent-base)]">+{formatCurrencyFull(Math.round(row.returns))}</td>
                            <td className="px-6 py-3.5 text-right fin-number font-semibold">{formatCurrencyFull(Math.round(row.total))}</td>
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
      )}
    </div>
  );
}
