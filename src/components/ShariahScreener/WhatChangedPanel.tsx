import React, { useState } from 'react';
import { ChevronDown, ChevronUp, ArrowRight, ArrowLeft } from 'lucide-react';

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
  const [isOpen, setIsOpen] = useState(false);
  
  const incoming = data.filter(d => d.direction === 'Incoming');
  const outgoing = data.filter(d => d.direction === 'Outgoing');

  return (
    <div className="bg-[var(--color-paper-2)] border border-[var(--color-border-subtle)] rounded-xl overflow-hidden shadow-sm">
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between p-4 hover:bg-black/5 dark:hover:bg-white/5 transition-hallmark"
      >
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-[var(--color-paper-1)] border border-[var(--color-border-subtle)] flex items-center justify-center">
            <span className="text-lg">🔄</span>
          </div>
          <div className="text-left">
            <h3 className="font-medium text-[var(--color-text)]">Index Recomposition</h3>
            <p className="text-xs text-[var(--color-text-muted)] mt-0.5">
              {incoming.length} incoming, {outgoing.length} outgoing (Effective June 5, 2026)
            </p>
          </div>
        </div>
        {isOpen ? <ChevronUp className="w-5 h-5 text-[var(--color-text-muted)]" /> : <ChevronDown className="w-5 h-5 text-[var(--color-text-muted)]" />}
      </button>

      {isOpen && (
        <div className="p-4 pt-0 border-t border-[var(--color-border-subtle)] grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
          <div>
            <h4 className="flex items-center gap-2 font-medium text-[var(--color-text)] mb-3 pb-2 border-b border-[var(--color-border-subtle)]">
              <span className="w-6 h-6 rounded-full bg-emerald-500/10 text-emerald-500 flex items-center justify-center">
                <ArrowRight className="w-3.5 h-3.5" />
              </span>
              Incoming Companies ({incoming.length})
            </h4>
            <ul className="space-y-2 max-h-64 overflow-y-auto pr-2 custom-scrollbar">
              {incoming.map((item, idx) => (
                <li key={idx} className="flex justify-between items-center text-sm">
                  <span className="text-[var(--color-text-muted)] truncate mr-2" title={item.name}>{item.name}</span>
                  <span className="font-mono bg-[var(--color-paper-1)] border border-[var(--color-border-subtle)] px-1.5 py-0.5 rounded text-[10px] whitespace-nowrap">
                    {item.ticker}
                  </span>
                </li>
              ))}
            </ul>
          </div>
          
          <div>
            <h4 className="flex items-center gap-2 font-medium text-[var(--color-text)] mb-3 pb-2 border-b border-[var(--color-border-subtle)]">
              <span className="w-6 h-6 rounded-full bg-rose-500/10 text-rose-500 flex items-center justify-center">
                <ArrowLeft className="w-3.5 h-3.5" />
              </span>
              Outgoing Companies ({outgoing.length})
            </h4>
            <ul className="space-y-2 max-h-64 overflow-y-auto pr-2 custom-scrollbar">
              {outgoing.map((item, idx) => (
                <li key={idx} className="flex flex-col text-sm border-b border-[var(--color-border-subtle)]/50 pb-2 last:border-0">
                  <div className="flex justify-between items-center">
                    <span className="text-[var(--color-text-muted)] truncate mr-2" title={item.name}>{item.name}</span>
                    <span className="font-mono bg-[var(--color-paper-1)] border border-[var(--color-border-subtle)] px-1.5 py-0.5 rounded text-[10px] whitespace-nowrap">
                      {item.ticker}
                    </span>
                  </div>
                  {item.reason && (
                    <span className="text-[11px] text-rose-500/80 mt-1 pl-1 border-l-2 border-rose-500/30">
                      {item.reason}
                    </span>
                  )}
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
}
