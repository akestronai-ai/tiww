import { useState } from 'react';
import { ChevronDown, ChevronUp, ArrowRight, ArrowLeft, RefreshCw, AlertCircle } from 'lucide-react';

interface RecompositionItem {
  direction: string;
  ticker: string;
  name: string;
  reason?: string;
}

interface Props {
  data: RecompositionItem[];
}

export default function WhatChangedPanel({ data }: Props) {
  const [isOpen, setIsOpen] = useState(true);
  const [activeTab, setActiveTab] = useState<'incoming' | 'outgoing'>('incoming');
  
  const incoming = data.filter(d => d.direction === 'Incoming');
  const outgoing = data.filter(d => d.direction === 'Outgoing');

  return (
    <div className="bg-[var(--color-paper-2)] border border-[var(--color-border-subtle)] rounded-2xl overflow-hidden shadow-md">
      {/* Header Bar */}
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between p-4 bg-[var(--color-paper-2)] hover:bg-[var(--color-paper-3)]/50 transition-all duration-200"
      >
        <div className="flex items-center gap-3 text-left">
          <div className="w-10 h-10 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400 shrink-0">
            <RefreshCw className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-display font-semibold text-base text-[var(--color-text)] leading-tight">
              Index Recomposition
            </h3>
            <p className="text-xs text-[var(--color-text-muted)] mt-0.5">
              {incoming.length} incoming • {outgoing.length} outgoing
            </p>
          </div>
        </div>
        <div className="p-1 rounded-lg bg-[var(--color-paper-1)] border border-[var(--color-border-subtle)] text-[var(--color-text-muted)]">
          {isOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        </div>
      </button>

      {isOpen && (
        <div className="p-4 pt-3 border-t border-[var(--color-border-subtle)] space-y-4">
          {/* Tabs for Incoming vs Outgoing */}
          <div className="flex bg-[var(--color-paper-1)] p-1 rounded-xl border border-[var(--color-border-subtle)]">
            <button
              onClick={() => setActiveTab('incoming')}
              className={`flex-1 flex items-center justify-center gap-2 py-2 px-3 rounded-lg text-xs font-semibold transition-all ${
                activeTab === 'incoming'
                  ? 'bg-emerald-500 text-black shadow-sm font-bold'
                  : 'text-[var(--color-text-muted)] hover:text-[var(--color-text)]'
              }`}
            >
              <ArrowRight className="w-3.5 h-3.5" />
              <span>Incoming ({incoming.length})</span>
            </button>
            
            <button
              onClick={() => setActiveTab('outgoing')}
              className={`flex-1 flex items-center justify-center gap-2 py-2 px-3 rounded-lg text-xs font-semibold transition-all ${
                activeTab === 'outgoing'
                  ? 'bg-rose-500 text-white shadow-sm font-bold'
                  : 'text-[var(--color-text-muted)] hover:text-[var(--color-text)]'
              }`}
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Outgoing ({outgoing.length})</span>
            </button>
          </div>

          {/* Incoming List */}
          {activeTab === 'incoming' && (
            <div className="space-y-1.5">
              <div className="flex items-center justify-between text-[11px] font-semibold text-[var(--color-text-muted)] uppercase tracking-wider px-1 pb-1">
                <span>Company Name</span>
                <span>Symbol</span>
              </div>
              <ul className="space-y-1.5 max-h-80 overflow-y-auto pr-1 text-xs">
                {incoming.map((item, idx) => (
                  <li key={idx} className="flex justify-between items-center p-2.5 rounded-xl bg-[var(--color-paper-1)] border border-[var(--color-border-subtle)]/70 hover:border-emerald-500/30 transition-colors">
                    <span className="font-medium text-[var(--color-text)] truncate mr-2" title={item.name}>
                      {item.name}
                    </span>
                    <span className="font-mono font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-2 py-0.5 rounded text-[10px] shrink-0">
                      {item.ticker}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Outgoing List */}
          {activeTab === 'outgoing' && (
            <div className="space-y-1.5">
              <div className="flex items-center justify-between text-[11px] font-semibold text-[var(--color-text-muted)] uppercase tracking-wider px-1 pb-1">
                <span>Company Name</span>
                <span>Symbol</span>
              </div>
              <ul className="space-y-2 max-h-80 overflow-y-auto pr-1 text-xs">
                {outgoing.map((item, idx) => (
                  <li key={idx} className="p-2.5 rounded-xl bg-[var(--color-paper-1)] border border-[var(--color-border-subtle)]/70 hover:border-rose-500/30 transition-colors">
                    <div className="flex justify-between items-center">
                      <span className="font-medium text-[var(--color-text)] truncate mr-2" title={item.name}>
                        {item.name}
                      </span>
                      <span className="font-mono font-bold bg-rose-500/10 text-rose-400 border border-rose-500/20 px-2 py-0.5 rounded text-[10px] shrink-0">
                        {item.ticker}
                      </span>
                    </div>
                    {item.reason && (
                      <div className="text-[11px] text-rose-400/90 mt-2 pt-1.5 border-t border-[var(--color-border-subtle)]/40 flex items-center gap-1.5">
                        <AlertCircle className="w-3 h-3 text-rose-400 shrink-0" />
                        <span className="truncate">{item.reason}</span>
                      </div>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
