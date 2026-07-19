import { useState, useMemo, useEffect } from 'react';
import { Search, Filter, ShieldCheck, ShieldAlert, Clock, Info } from 'lucide-react';
import CompanyCard, { type Company } from '../components/ShariahScreener/CompanyCard';
import WhatChangedPanel from '../components/ShariahScreener/WhatChangedPanel';

// Assuming we load JSON directly at build time
import shariahData from '../data/shariah_data.json';

type FilterType = 'All' | 'Compliant' | 'Non-Compliant' | 'Pending';

export default function ShariahScreener() {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeFilter, setActiveFilter] = useState<FilterType>('All');
  const [displayLimit, setDisplayLimit] = useState(50);

  // Parse data
  const universe = shariahData.universe as Company[];
  const recomposition = shariahData.recomposition;

  // Filter and search logic
  const filteredData = useMemo(() => {
    let data = universe;

    // Apply Filter
    if (activeFilter === 'Compliant') {
      data = data.filter(c => c.shariah_status?.toLowerCase() === 'compliant');
    } else if (activeFilter === 'Non-Compliant') {
      data = data.filter(c => c.shariah_status?.toLowerCase() === 'non-compliant' || c.shariah_status?.toLowerCase() === 'nc by nature');
    } else if (activeFilter === 'Pending') {
      data = data.filter(c => c.category === 'Pending' || c.shariah_status?.toLowerCase().includes('pending'));
    }

    // Apply Search
    if (searchTerm.trim()) {
      const lowerQuery = searchTerm.toLowerCase();
      data = data.filter(c => 
        c.ticker.toLowerCase().includes(lowerQuery) || 
        c.name.toLowerCase().includes(lowerQuery)
      );
    }

    // Sort by name alphabetically (or keep original order which is roughly by name/ticker)
    return data;
  }, [universe, searchTerm, activeFilter]);

  const displayedData = filteredData.slice(0, displayLimit);
  
  const hasMore = displayLimit < filteredData.length;
  
  const loadMore = () => {
    setDisplayLimit(prev => prev + 50);
  };

  // Reset limit when search or filter changes
  useEffect(() => {
    setDisplayLimit(50);
  }, [searchTerm, activeFilter]);

  return (
    <div className="max-w-4xl mx-auto w-full px-4 py-8 flex-1">
      {/* Header Section */}
      <div className="mb-10 text-center">
        <h1 className="text-3xl sm:text-4xl font-display font-medium mb-4">Shariah Screener</h1>
        <p className="text-[var(--color-text-muted)] max-w-2xl mx-auto">
          Search and filter PSX companies by their Shariah compliance status. Based on the latest KMI Index screening for Dec 2025.
        </p>
      </div>

      {/* Main Search and Filters */}
      <div className="bg-[var(--color-paper-2)] border border-[var(--color-border-subtle)] rounded-2xl p-4 sm:p-6 mb-8 shadow-sm">
        <div className="relative mb-6">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[var(--color-text-muted)]" />
          <input 
            type="text" 
            placeholder="Search by ticker (e.g. OGDC) or name..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-[var(--color-paper-1)] border border-[var(--color-border-subtle)] rounded-xl pl-12 pr-4 py-3.5 focus:outline-none focus:border-[var(--color-accent-base)] transition-hallmark text-[var(--color-text)] placeholder:text-[var(--color-text-muted)]/50"
          />
        </div>

        <div className="flex flex-col sm:flex-row gap-3 overflow-x-auto pb-2 sm:pb-0 custom-scrollbar">
          <div className="flex items-center gap-2 mr-2 text-sm text-[var(--color-text-muted)] font-medium">
            <Filter className="w-4 h-4" />
            Filters:
          </div>
          
          <div className="flex gap-2">
            {(['All', 'Compliant', 'Non-Compliant', 'Pending'] as FilterType[]).map(f => (
              <button
                key={f}
                onClick={() => setActiveFilter(f)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-hallmark whitespace-nowrap flex items-center gap-2 ${
                  activeFilter === f 
                    ? 'bg-[var(--color-accent-base)] text-white shadow-sm' 
                    : 'bg-[var(--color-paper-1)] text-[var(--color-text-muted)] border border-[var(--color-border-subtle)] hover:border-[var(--color-accent-base)]/50 hover:text-[var(--color-text)]'
                }`}
              >
                {f === 'Compliant' && <ShieldCheck className="w-4 h-4" />}
                {f === 'Non-Compliant' && <ShieldAlert className="w-4 h-4" />}
                {f === 'Pending' && <Clock className="w-4 h-4" />}
                {f}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          {/* Results List */}
          <div className="mb-4 flex justify-between items-center text-sm">
            <span className="text-[var(--color-text-muted)]">
              Showing {filteredData.length > 0 ? Math.min(displayLimit, filteredData.length) : 0} of {filteredData.length} results
            </span>
          </div>

          <div className="space-y-4">
            {displayedData.length > 0 ? (
              displayedData.map((company, idx) => (
                <CompanyCard key={`${company.ticker}-${idx}`} company={company} />
              ))
            ) : (
              <div className="bg-[var(--color-paper-2)] border border-[var(--color-border-subtle)] rounded-xl p-10 text-center flex flex-col items-center">
                <div className="w-16 h-16 bg-[var(--color-paper-1)] rounded-full flex items-center justify-center mb-4">
                  <Search className="w-8 h-8 text-[var(--color-text-muted)]/50" />
                </div>
                <h3 className="text-lg font-medium text-[var(--color-text)] mb-2">No companies found</h3>
                <p className="text-[var(--color-text-muted)] max-w-sm mx-auto text-sm">
                  {searchTerm ? (
                    `Not currently in the KMI Shariah screening universe — this usually means it's a conventional bank, insurer, leasing company, or hasn't been reviewed yet.`
                  ) : (
                    "Try adjusting your filters to see more results."
                  )}
                </p>
              </div>
            )}
          </div>

          {hasMore && (
            <div className="mt-8 text-center">
              <button 
                onClick={loadMore}
                className="px-6 py-2.5 rounded-lg bg-[var(--color-paper-2)] border border-[var(--color-border-subtle)] text-[var(--color-text)] hover:bg-[var(--color-paper-1)] hover:border-[var(--color-accent-base)] transition-hallmark font-medium text-sm"
              >
                Load More
              </button>
            </div>
          )}
        </div>

        <div className="lg:col-span-1 space-y-6">
          {/* Side Panel */}
          <WhatChangedPanel data={recomposition} />
          
          <div className="bg-blue-500/5 border border-blue-500/20 rounded-xl p-5">
            <h4 className="flex items-center gap-2 font-medium text-[var(--color-text)] mb-2">
              <Info className="w-4 h-4 text-blue-500" />
              Disclaimer
            </h4>
            <p className="text-xs text-[var(--color-text-muted)] leading-relaxed">
              Shariah screening based on PSX-KMI All Share Islamic Index, using accounts as of Dec 31, 2025, per PSX Notice PSX/N-659. Approved by the Shariah Supervisory Board of KMI Index Partner, Meezan Bank. For informational purposes only — verify with your own Shariah advisor before investing.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
