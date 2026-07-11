import { useEffect, useState } from 'react';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import { Search, ChevronDown, Download, Share2, Calculator, TrendingUp, AlertCircle } from 'lucide-react';
import { AxiosError } from 'axios';
import { calculateRoi, searchCompanies, type Company, type RoiResult } from '../api/marketData';

const years = Array.from({ length: new Date().getFullYear() - 2001 }, (_, index) => String(2002 + index));

function formatCurrency(value: number | null | undefined) {
  if (value === null || value === undefined || Number.isNaN(value)) {
    return '-';
  }
  return `Rs ${value.toLocaleString(undefined, { maximumFractionDigits: 2 })}`;
}

function formatNumber(value: number | null | undefined, suffix = '') {
  if (value === null || value === undefined || Number.isNaN(value)) {
    return '-';
  }
  return `${value.toLocaleString(undefined, { maximumFractionDigits: 4 })}${suffix}`;
}

function getApiError(error: unknown) {
  if (error instanceof AxiosError) {
    const detail = error.response?.data?.detail;
    return typeof detail === 'string' ? detail : error.message;
  }
  return 'Something went wrong while calculating ROI.';
}

export default function ROICalculator() {
  const [symbol, setSymbol] = useState('MEBL');
  const [year, setYear] = useState('2002');
  const [shares, setShares] = useState('1000');
  const [price, setPrice] = useState('100');
  const [reinvestDividend, setReinvestDividend] = useState(false);
  const [companies, setCompanies] = useState<Company[]>([]);
  const [companyDropdownOpen, setCompanyDropdownOpen] = useState(false);
  const [companySearchLoading, setCompanySearchLoading] = useState(false);
  const [result, setResult] = useState<RoiResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const trimmedSymbol = symbol.trim();
    if (!trimmedSymbol) {
      setCompanies([]);
      setCompanySearchLoading(false);
      return;
    }

    setCompanySearchLoading(true);
    const timer = window.setTimeout(async () => {
      try {
        setCompanies(await searchCompanies(trimmedSymbol, 10));
      } catch {
        setCompanies([]);
      } finally {
        setCompanySearchLoading(false);
      }
    }, 250);

    return () => window.clearTimeout(timer);
  }, [symbol]);

  const selectCompany = (company: Company) => {
    setSymbol(company.symbol);
    setCompanyDropdownOpen(false);
  };

  const handleCalculate = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const roi = await calculateRoi({
        symbol: symbol.trim().toUpperCase(),
        initialYear: Number(year),
        sharesBought: Number(shares),
        buyPrice: price ? Number(price) : undefined,
        reinvestDividend,
      });
      setResult(roi);
    } catch (err) {
      setResult(null);
      setError(getApiError(err));
    } finally {
      setLoading(false);
    }
  };

  const chartData = result?.chart.map((point) => ({
    year: String(point.year),
    value: point.return,
  })) ?? [];

  const returnPercent = result && result.initialInvestment > 0
    ? ((result.totalReturn - result.initialInvestment) / result.initialInvestment) * 100
    : null;
  const isPositiveReturn = (returnPercent ?? 0) >= 0;

  return (
    <div className="flex flex-col md:flex-row flex-1 max-w-[1600px] mx-auto w-full">
      <aside className="w-full md:w-[350px] lg:w-[400px] border-b md:border-b-0 md:border-r border-white/5 bg-[var(--color-paper-1)] flex-shrink-0 md:sticky md:top-16 h-auto md:h-[calc(100vh-64px)] overflow-y-auto">
        <div className="p-6 lg:p-8">
          <div className="mb-8">
            <h1 className="text-2xl font-display font-semibold mb-2">ROI Calculator</h1>
            <p className="text-sm text-[var(--color-text-muted)]">
              Calculate total returns including dividends & bonus shares.
            </p>
          </div>

          <form onSubmit={handleCalculate} className="space-y-6">
            <div className="space-y-2">
              <label className="text-sm font-medium text-[var(--color-text-muted)]">Company Symbol</label>
              <div
                className="relative"
                onBlur={() => window.setTimeout(() => setCompanyDropdownOpen(false), 150)}
              >
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--color-text-muted)]" />
                <input
                  type="text"
                  value={symbol}
                  onChange={(e) => {
                    setSymbol(e.target.value.toUpperCase());
                    setCompanyDropdownOpen(true);
                  }}
                  onFocus={() => setCompanyDropdownOpen(true)}
                  placeholder="Search by symbol or company name"
                  className="w-full bg-[var(--color-paper-2)] border border-white/5 rounded-lg pl-10 pr-10 py-3 text-sm focus:outline-none focus:border-[var(--color-accent-base)] transition-hallmark"
                  autoComplete="off"
                  required
                />
                <ChevronDown className={`absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--color-text-muted)] transition-transform pointer-events-none ${companyDropdownOpen ? 'rotate-180' : ''}`} />

                {companyDropdownOpen && symbol.trim() && (
                  <div className="absolute left-0 right-0 top-[calc(100%+8px)] z-30 overflow-hidden rounded-xl border border-white/10 bg-[var(--color-paper-2)] shadow-2xl shadow-black/30">
                    <div className="max-h-72 overflow-y-auto py-2">
                      {companySearchLoading ? (
                        <div className="px-4 py-3 text-sm text-[var(--color-text-muted)]">Searching companies...</div>
                      ) : companies.length > 0 ? (
                        companies.map((company) => (
                          <button
                            key={company.id}
                            type="button"
                            onMouseDown={(event) => event.preventDefault()}
                            onClick={() => selectCompany(company)}
                            className="flex w-full items-center justify-between gap-3 px-4 py-3 text-left text-sm transition-hallmark hover:bg-white/5 focus:bg-white/5 focus:outline-none"
                          >
                            <span>
                              <span className="block font-semibold text-[var(--color-text)]">{company.symbol}</span>
                              <span className="block text-xs text-[var(--color-text-muted)]">{company.name}</span>
                            </span>
                            {company.sector && (
                              <span className="max-w-24 truncate rounded-full bg-white/5 px-2 py-1 text-[10px] uppercase tracking-wider text-[var(--color-text-muted)]">
                                {company.sector}
                              </span>
                            )}
                          </button>
                        ))
                      ) : (
                        <div className="px-4 py-3 text-sm text-[var(--color-text-muted)]">No companies found for "{symbol}"</div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-[var(--color-text-muted)]">Investment Year</label>
              <div className="relative">
                <select
                  value={year}
                  onChange={(e) => setYear(e.target.value)}
                  className="w-full bg-[var(--color-paper-2)] border border-white/5 rounded-lg pl-4 pr-10 py-3 text-sm focus:outline-none focus:border-[var(--color-accent-base)] transition-hallmark appearance-none"
                >
                  {years.map((yearOption) => (
                    <option key={yearOption} value={yearOption}>{yearOption}</option>
                  ))}
                </select>
                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--color-text-muted)] pointer-events-none" />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-[var(--color-text-muted)]">No. of Shares</label>
                <input
                  type="number"
                  min="1"
                  step="any"
                  value={shares}
                  onChange={(e) => setShares(e.target.value)}
                  placeholder="e.g. 1000"
                  className="w-full bg-[var(--color-paper-2)] border border-white/5 rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-[var(--color-accent-base)] transition-hallmark fin-number"
                  required
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-[var(--color-text-muted)]">Purchase Price (Rs)</label>
                <input
                  type="number"
                  min="0.01"
                  step="any"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  placeholder="Optional"
                  className="w-full bg-[var(--color-paper-2)] border border-white/5 rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-[var(--color-accent-base)] transition-hallmark fin-number"
                />
              </div>
            </div>

            <label className="flex items-center gap-3 text-sm text-[var(--color-text-muted)]">
              <input
                type="checkbox"
                checked={reinvestDividend}
                onChange={(e) => setReinvestDividend(e.target.checked)}
                className="h-4 w-4 accent-[var(--color-accent-base)]"
              />
              Reinvest cash dividends into more shares
            </label>

            {error && (
              <div className="flex gap-2 rounded-lg border border-red-500/20 bg-red-500/10 p-3 text-sm text-red-400">
                <AlertCircle className="mt-0.5 h-4 w-4 flex-shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[var(--color-accent-base)] hover:bg-[var(--color-accent-hover)] disabled:opacity-60 disabled:cursor-wait text-[var(--color-navy)] font-medium py-3.5 rounded-lg transition-hallmark flex items-center justify-center gap-2 mt-4 shadow-[0_0_20px_rgba(0,200,150,0.2)]"
            >
              <Calculator className="w-5 h-5" />
              {loading ? 'Calculating...' : 'Calculate Returns'}
            </button>
          </form>
        </div>
      </aside>

      <main className="flex-1 bg-[var(--color-paper-1)] min-h-[500px] flex flex-col relative">
        {!result ? (
          <div className="flex-1 flex flex-col items-center justify-center p-8 text-center">
            <div className="w-24 h-24 rounded-full bg-[var(--color-paper-2)] flex items-center justify-center mb-6">
              <TrendingUp className="w-10 h-10 text-[var(--color-text-muted)]/30" />
            </div>
            <h2 className="text-2xl font-display mb-2">Enter details to see your returns</h2>
            <p className="text-[var(--color-text-muted)] max-w-sm">
              Input a company symbol, investment year, and number of shares on the left to calculate historical performance from the backend.
            </p>
          </div>
        ) : (
          <div className="p-6 lg:p-10 max-w-5xl">
            <div className="mb-6">
              <p className="text-sm text-[var(--color-text-muted)]">Calculated for</p>
              <h2 className="text-3xl font-display font-medium">{result.symbol}</h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
              <div className="glass-card p-5">
                <div className="text-xs text-[var(--color-text-muted)] font-medium uppercase tracking-wider mb-2">Initial Investment</div>
                <div className="text-2xl font-display fin-number">{formatCurrency(result.initialInvestment)}</div>
              </div>
              <div className="glass-card p-5 border-t-2 border-t-[var(--color-accent-base)]">
                <div className="text-xs text-[var(--color-text-muted)] font-medium uppercase tracking-wider mb-2">Current Value</div>
                <div className="text-2xl font-display fin-number">{formatCurrency(result.currentInvestment)}</div>
              </div>
              <div className="glass-card p-5 bg-[var(--color-accent-base)]/5 border-[var(--color-accent-base)]/20">
                <div className="text-xs text-[var(--color-text-muted)] font-medium uppercase tracking-wider mb-2">Total Return</div>
                <div className={`text-2xl font-display fin-number flex items-center gap-2 ${isPositiveReturn ? 'text-[var(--color-accent-base)]' : 'text-red-400'}`}>
                  <TrendingUp className="w-5 h-5" />
                  {formatNumber(returnPercent, '%')}
                </div>
              </div>
              <div className="glass-card p-5">
                <div className="text-xs text-[var(--color-text-muted)] font-medium uppercase tracking-wider mb-2">CAGR</div>
                <div className={`text-2xl font-display fin-number ${Number(result.cagr ?? 0) >= 0 ? 'text-[var(--color-accent-base)]' : 'text-red-400'}`}>
                  {formatNumber(result.cagr, '%')}
                </div>
              </div>
            </div>

            <div className="glass-card p-6 mb-8">
              <div className="flex items-center justify-between mb-6">
                <h3 className="font-display font-medium">Portfolio Growth</h3>
                <div className="text-xs text-[var(--color-text-muted)]">
                  {result.reinvestDividend ? 'Includes reinvested dividends' : 'Includes cash dividends'}
                </div>
              </div>
              <div className="h-[300px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={chartData} margin={{ top: 10, right: 0, left: 0, bottom: 0 }}>
                    <defs>
                      <linearGradient id="colorValueChart" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="var(--color-accent-base)" stopOpacity={0.2} />
                        <stop offset="95%" stopColor="var(--color-accent-base)" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.05)" />
                    <XAxis
                      dataKey="year"
                      axisLine={false}
                      tickLine={false}
                      tick={{ fill: 'var(--color-text-muted)', fontSize: 12, fontFamily: 'var(--font-mono)' }}
                      dy={10}
                    />
                    <YAxis
                      axisLine={false}
                      tickLine={false}
                      tick={{ fill: 'var(--color-text-muted)', fontSize: 12, fontFamily: 'var(--font-mono)' }}
                      tickFormatter={(val) => `Rs ${Number(val) / 1000}k`}
                      dx={-10}
                    />
                    <Tooltip
                      contentStyle={{ backgroundColor: 'var(--color-paper-2)', borderColor: 'rgba(255,255,255,0.1)', borderRadius: '8px' }}
                      itemStyle={{ color: 'var(--color-text)', fontFamily: 'var(--font-mono)' }}
                      labelStyle={{ color: 'var(--color-text-muted)', marginBottom: '4px' }}
                      formatter={(value: unknown) => [formatCurrency(Number(value)), 'Value']}
                    />
                    <Area
                      type="monotone"
                      dataKey="value"
                      stroke="var(--color-accent-base)"
                      strokeWidth={2}
                      fill="url(#colorValueChart)"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="mb-8">
              <h3 className="font-display font-medium mb-4 px-1">Detailed Breakdown</h3>
              <div className="glass-card overflow-hidden">
                <table className="w-full text-sm text-left">
                  <tbody className="divide-y divide-white/5">
                    <tr className="hover:bg-white/[0.02] transition-hallmark">
                      <td className="py-4 px-6 text-[var(--color-text-muted)]">Initial Investment</td>
                      <td className="py-4 px-6 text-right fin-number">{formatCurrency(result.initialInvestment)}</td>
                    </tr>
                    <tr className="hover:bg-white/[0.02] transition-hallmark">
                      <td className="py-4 px-6 text-[var(--color-text-muted)]">Bonus Shares Received</td>
                      <td className="py-4 px-6 text-right fin-number">
                        {formatNumber(result.currentShares - result.initialShares, ' shares')}
                      </td>
                    </tr>
                    <tr className="hover:bg-white/[0.02] transition-hallmark">
                      <td className="py-4 px-6 text-[var(--color-text-muted)]">Total Shares Now</td>
                      <td className="py-4 px-6 text-right fin-number text-[var(--color-text)] font-medium">
                        {formatNumber(result.currentShares, ' shares')}
                      </td>
                    </tr>
                    <tr className="hover:bg-white/[0.02] transition-hallmark">
                      <td className="py-4 px-6 text-[var(--color-text-muted)]">Cash Dividends Received</td>
                      <td className="py-4 px-6 text-right fin-number">{formatCurrency(result.totalDividend)}</td>
                    </tr>
                    <tr className="hover:bg-white/[0.02] transition-hallmark">
                      <td className="py-4 px-6 text-[var(--color-text-muted)]">Current Share Price</td>
                      <td className="py-4 px-6 text-right fin-number">{formatCurrency(result.currentPrice)}</td>
                    </tr>
                    <tr className="bg-white/[0.03] border-t border-white/10">
                      <td className="py-5 px-6 font-medium text-[var(--color-text)]">Total Portfolio Value</td>
                      <td className="py-5 px-6 text-right fin-number text-lg font-medium text-[var(--color-accent-base)]">
                        {formatCurrency(result.totalReturn)}
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            {result.details.length > 0 && (
              <div className="mb-8">
                <h3 className="font-display font-medium mb-4 px-1">Corporate Actions</h3>
                <div className="glass-card overflow-x-auto">
                  <table className="w-full text-sm text-left">
                    <thead className="text-xs uppercase tracking-wider text-[var(--color-text-muted)]">
                      <tr>
                        <th className="px-6 py-3">Year</th>
                        <th className="px-6 py-3">Type</th>
                        <th className="px-6 py-3 text-right">Percentage</th>
                        <th className="px-6 py-3 text-right">Dividend/Share</th>
                        <th className="px-6 py-3 text-right">Shares</th>
                        <th className="px-6 py-3 text-right">Dividend Paid</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                      {result.details.map((detail, index) => (
                        <tr key={`${detail.year}-${detail.payoutType}-${index}`} className="hover:bg-white/[0.02] transition-hallmark">
                          <td className="px-6 py-3">{detail.year}</td>
                          <td className="px-6 py-3 capitalize">{detail.payoutType}</td>
                          <td className="px-6 py-3 text-right fin-number">{formatNumber(detail.payoutPercentage, '%')}</td>
                          <td className="px-6 py-3 text-right fin-number">{formatCurrency(detail.dividendPerShare)}</td>
                          <td className="px-6 py-3 text-right fin-number">{formatNumber(detail.shares)}</td>
                          <td className="px-6 py-3 text-right fin-number">{formatCurrency(detail.dividendPaid)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            <div className="flex items-center gap-4">
              <button className="flex items-center gap-2 bg-[var(--color-paper-2)] hover:bg-[var(--color-paper-3)] border border-white/10 px-6 py-2.5 rounded-lg text-sm font-medium transition-hallmark">
                <Share2 className="w-4 h-4" />
                Share Result
              </button>
              <button className="flex items-center gap-2 bg-[var(--color-paper-2)] hover:bg-[var(--color-paper-3)] border border-white/10 px-6 py-2.5 rounded-lg text-sm font-medium transition-hallmark">
                <Download className="w-4 h-4" />
                Download PDF
              </button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
