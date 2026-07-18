import React, { useState } from 'react';
import { ChevronDown, ChevronUp, CheckCircle2, XCircle, AlertCircle, Info } from 'lucide-react';

export interface Company {
  ticker: string;
  name: string;
  objective: string;
  debt_ratio?: string;
  investment_ratio?: string;
  income_ratio?: string;
  illiquid_assets_ratio?: string;
  net_liquid_assets?: string;
  share_price?: string;
  shariah_status?: string;
  note?: string;
  category: string;
}

interface Props {
  company: Company;
}

const noteMappings: Record<string, string> = {
  '1': 'Based on September 2025 accounts',
  '2': 'Based on last available annual/half-yearly accounts',
  '3': 'Due to non-availability of Dec 2025 accounts, Sept 2025 accounts used',
  '4': 'Screened on Dec 2025 financials while KMI-30 list used June 2025',
};

function parseRatio(val: string | undefined): number | null {
  if (!val || val === 'N/A' || val === '-') return null;
  return parseFloat(val.replace('%', '').trim());
}

function parseCurrency(val: string | undefined): number | null {
  if (!val || val === 'N/A' || val === '-') return null;
  // Handle parenthesis for negative
  let s = val.trim();
  let isNeg = false;
  if (s.startsWith('(') && s.endsWith(')')) {
    isNeg = true;
    s = s.substring(1, s.length - 1);
  }
  const n = parseFloat(s.replace(/,/g, ''));
  return isNeg ? -n : n;
}

const RatioBar = ({ 
  label, 
  valueStr, 
  threshold, 
  isMin = false, 
  valueNum 
}: { 
  label: string, 
  valueStr: string | undefined, 
  threshold: number, 
  isMin?: boolean,
  valueNum: number | null 
}) => {
  if (!valueStr || valueStr === 'N/A' || valueStr === '-') {
    return (
      <div className="flex flex-col mb-3">
        <div className="flex justify-between text-xs mb-1">
          <span className="text-[var(--color-text-muted)]">{label}</span>
          <span className="text-[var(--color-text-muted)] font-mono text-[10px]">N/A</span>
        </div>
        <div className="h-1.5 w-full bg-[var(--color-paper-1)] rounded-full overflow-hidden"></div>
      </div>
    );
  }

  const isCompliant = valueNum !== null && (isMin ? valueNum >= threshold : valueNum < threshold);
  // cap percentage for bar at 100
  const barWidth = valueNum !== null ? Math.min(Math.max(valueNum, 0), 100) : 0;
  
  return (
    <div className="flex flex-col mb-3">
      <div className="flex justify-between text-xs mb-1">
        <span className="text-[var(--color-text-muted)]">{label}</span>
        <div className="flex items-center gap-1.5">
          <span className="font-mono">{valueStr}</span>
          <span className="text-[10px] text-[var(--color-text-muted)]">
            ({isMin ? '>=' : '<'} {threshold}%)
          </span>
          {isCompliant ? (
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
          ) : (
            <XCircle className="w-3.5 h-3.5 text-rose-500" />
          )}
        </div>
      </div>
      <div className="h-1.5 w-full bg-[var(--color-paper-1)] rounded-full overflow-hidden relative">
        <div 
          className={`absolute top-0 left-0 h-full rounded-full ${isCompliant ? 'bg-[var(--color-accent-base)]' : 'bg-rose-500'}`}
          style={{ width: `${barWidth}%` }}
        ></div>
        {!isMin && (
          <div 
            className="absolute top-0 h-full w-px bg-white/50 dark:bg-black/50 z-10" 
            style={{ left: `${threshold}%` }}
          ></div>
        )}
      </div>
    </div>
  );
};

export default function CompanyCard({ company }: Props) {
  const [expanded, setExpanded] = useState(false);
  
  const status = company.shariah_status?.trim() || (company.category === 'Pending' ? 'Pending Review' : 'Unknown');
  const isCompliant = status.toLowerCase() === 'compliant';
  const isPending = status.toLowerCase().includes('pending');
  const isNonCompliant = !isCompliant && !isPending;

  const debt = parseRatio(company.debt_ratio);
  const investment = parseRatio(company.investment_ratio);
  const income = parseRatio(company.income_ratio);
  const illiquid = parseRatio(company.illiquid_assets_ratio);
  
  const netLiquid = parseCurrency(company.net_liquid_assets);
  const price = parseCurrency(company.share_price);

  const netLiquidCompliant = netLiquid !== null && price !== null && netLiquid < price;

  const badgeColor = isCompliant 
    ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20' 
    : isPending 
      ? 'bg-amber-500/10 text-amber-500 border-amber-500/20' 
      : 'bg-rose-500/10 text-rose-500 border-rose-500/20';

  return (
    <div className="bg-[var(--color-paper-2)] border border-[var(--color-border-subtle)] rounded-xl overflow-hidden shadow-sm hover:border-[var(--color-accent-base)]/30 transition-hallmark">
      <div 
        className="p-4 sm:p-5 cursor-pointer flex flex-col sm:flex-row sm:items-center justify-between gap-4"
        onClick={() => setExpanded(!expanded)}
      >
        <div className="flex items-start sm:items-center gap-4">
          <div className="w-12 h-12 shrink-0 rounded-lg bg-[var(--color-paper-1)] border border-[var(--color-border-subtle)] flex items-center justify-center font-display font-medium text-[var(--color-text)] shadow-sm">
            {company.ticker}
          </div>
          <div>
            <h3 className="font-medium text-[var(--color-text)] leading-tight">{company.name}</h3>
            <div className="flex items-center gap-2 mt-1.5 flex-wrap">
              <span className="text-xs text-[var(--color-text-muted)] font-mono bg-[var(--color-paper-1)] px-1.5 py-0.5 rounded border border-[var(--color-border-subtle)]">
                {company.category}
              </span>
              {price !== null && price > 0 && (
                <span className="text-xs text-[var(--color-text-muted)]">
                  Rs. {price.toFixed(2)}
                </span>
              )}
            </div>
          </div>
        </div>
        
        <div className="flex items-center justify-between sm:justify-end gap-4 w-full sm:w-auto">
          <div className={`px-2.5 py-1 rounded-full text-xs font-medium border ${badgeColor} whitespace-nowrap flex items-center gap-1.5`}>
            {isCompliant && <CheckCircle2 className="w-3.5 h-3.5" />}
            {isNonCompliant && <XCircle className="w-3.5 h-3.5" />}
            {isPending && <AlertCircle className="w-3.5 h-3.5" />}
            {status}
          </div>
          {expanded ? <ChevronUp className="w-5 h-5 text-[var(--color-text-muted)]" /> : <ChevronDown className="w-5 h-5 text-[var(--color-text-muted)]" />}
        </div>
      </div>

      {expanded && (
        <div className="px-4 sm:px-5 pb-5 pt-2 border-t border-[var(--color-border-subtle)] bg-[var(--color-paper-1)]/30">
          {company.category !== 'ETF' && company.category !== 'Pending' ? (
            <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-2">
              <RatioBar label="Debt to Assets" valueStr={company.debt_ratio} valueNum={debt} threshold={37} />
              <RatioBar label="Non-Compliant Inv." valueStr={company.investment_ratio} valueNum={investment} threshold={33} />
              <RatioBar label="Non-Compliant Income" valueStr={company.income_ratio} valueNum={income} threshold={5} />
              <RatioBar label="Illiquid Assets" valueStr={company.illiquid_assets_ratio} valueNum={illiquid} threshold={25} isMin={true} />
              
              <div className="flex flex-col mb-3">
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-[var(--color-text-muted)]">Net Liquid Assets vs Price</span>
                  <div className="flex items-center gap-1.5">
                    <span className="font-mono">{company.net_liquid_assets} {company.net_liquid_assets !== 'N/A' && '<'} {company.share_price}</span>
                    {company.net_liquid_assets !== 'N/A' && company.share_price !== 'N/A' && (
                      netLiquidCompliant ? (
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                      ) : (
                        <XCircle className="w-3.5 h-3.5 text-rose-500" />
                      )
                    )}
                  </div>
                </div>
                <div className="text-[10px] text-[var(--color-text-muted)]/70">
                  Net liquid assets per share must be less than market price.
                </div>
              </div>
            </div>
          ) : (
             <div className="mt-4 text-sm text-[var(--color-text-muted)] italic">
               {company.category === 'ETF' ? 'ETFs are screened based on their underlying constituents. No separate ratio limits apply.' : 'Financials are currently under review or unavailable for full ratio calculation.'}
             </div>
          )}

          {company.note && noteMappings[company.note] && (
            <div className="mt-4 p-3 bg-blue-500/5 border border-blue-500/10 rounded-lg flex items-start gap-2.5">
              <Info className="w-4 h-4 text-blue-500 shrink-0 mt-0.5" />
              <span className="text-xs text-[var(--color-text-muted)] leading-relaxed">
                <strong className="text-[var(--color-text)] font-medium">Note {company.note}:</strong> {noteMappings[company.note]}
              </span>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
