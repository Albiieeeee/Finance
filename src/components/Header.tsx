import React from 'react';
import {
  TrendingUp,
  DollarSign,
  ShieldAlert,
  ShieldCheck,
  Building2,
  GitCompare,
  Search,
  BookOpen,
  Sparkles,
  Layers,
  ArrowUpDown,
} from 'lucide-react';

interface HeaderProps {
  activeTab: 'directory' | 'screener' | 'compare' | 'live-search' | 'guide';
  setActiveTab: (tab: 'directory' | 'screener' | 'compare' | 'live-search' | 'guide') => void;
  searchQuery: string;
  setSearchQuery: (q: string) => void;
  selectedCount: number;
  openCompare: () => void;
  openLiveSearch: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  setActiveTab,
  searchQuery,
  setSearchQuery,
  selectedCount,
  openCompare,
  openLiveSearch,
}) => {
  return (
    <header className="sticky top-0 z-30 bg-slate-900 border-b border-slate-800 text-white shadow-xl">
      {/* Top Banner / Ticker tape */}
      <div className="bg-slate-950 px-4 py-1.5 border-b border-slate-800/80 text-xs flex flex-wrap items-center justify-between text-slate-400">
        <div className="flex items-center gap-2">
          <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-[11px] font-medium bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
            Real Audited Data
          </span>
          <span>BSE &amp; NSE Regulatory Filings (Consolidated Ind AS)</span>
          <span className="hidden sm:inline text-slate-600">•</span>
          <span className="hidden sm:inline text-slate-400">Currency: Indian Rupees (₹ Crores)</span>
        </div>
        <div className="flex items-center gap-4 text-xs font-mono">
          <span className="text-slate-400">FY 2023-24 Audited</span>
          <span className="text-slate-500">|</span>
          <button
            onClick={openLiveSearch}
            className="text-amber-400 hover:text-amber-300 flex items-center gap-1 cursor-pointer transition-colors"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Search Any Indian Co. via Live AI</span>
          </button>
        </div>
      </div>

      {/* Main Navbar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5 flex flex-col md:flex-row md:items-center justify-between gap-4">
        {/* Brand */}
        <div className="flex items-center justify-between">
          <div
            onClick={() => setActiveTab('directory')}
            className="flex items-center gap-3 cursor-pointer group"
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 via-blue-600 to-cyan-500 flex items-center justify-center shadow-lg shadow-indigo-500/20 group-hover:scale-105 transition-transform">
              <Building2 className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-lg font-bold tracking-tight text-white group-hover:text-blue-400 transition-colors">
                  IndiaCorp
                </span>
                <span className="text-xs px-2 py-0.5 rounded font-mono font-bold bg-blue-500/20 text-blue-400 border border-blue-500/30">
                  FINANCIALS
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Balance Sheet &amp; P&amp;L Intelligence for India’s Marquee Companies
              </p>
            </div>
          </div>

          {/* Mobile compare button */}
          <div className="flex md:hidden items-center gap-2">
            {selectedCount > 0 && (
              <button
                onClick={openCompare}
                className="px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-xs font-semibold flex items-center gap-1.5 text-white"
              >
                <GitCompare className="w-3.5 h-3.5" />
                <span>Compare ({selectedCount})</span>
              </button>
            )}
          </div>
        </div>

        {/* Global Instant Search */}
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search company (e.g. Reliance, TCS, HDFC, Tata Motors, ITC)..."
            className="w-full bg-slate-800/90 hover:bg-slate-800 focus:bg-slate-800 border border-slate-700 focus:border-blue-500 rounded-xl pl-10 pr-4 py-2 text-sm text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/30 transition-all"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-white"
            >
              Clear
            </button>
          )}
        </div>

        {/* Navigation Tabs & Actions */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 md:pb-0">
          <button
            onClick={() => setActiveTab('directory')}
            className={`px-3 py-2 rounded-lg text-xs font-medium flex items-center gap-1.5 transition-colors whitespace-nowrap ${
              activeTab === 'directory'
                ? 'bg-blue-600 text-white shadow-md shadow-blue-600/30'
                : 'text-slate-300 hover:bg-slate-800 hover:text-white'
            }`}
          >
            <Layers className="w-4 h-4" />
            <span>Directory</span>
          </button>

          <button
            onClick={() => setActiveTab('screener')}
            className={`px-3 py-2 rounded-lg text-xs font-medium flex items-center gap-1.5 transition-colors whitespace-nowrap ${
              activeTab === 'screener'
                ? 'bg-blue-600 text-white shadow-md shadow-blue-600/30'
                : 'text-slate-300 hover:bg-slate-800 hover:text-white'
            }`}
          >
            <ArrowUpDown className="w-4 h-4" />
            <span>Screener</span>
          </button>

          <button
            onClick={() => setActiveTab('compare')}
            className={`px-3 py-2 rounded-lg text-xs font-medium flex items-center gap-1.5 transition-colors whitespace-nowrap relative ${
              activeTab === 'compare'
                ? 'bg-blue-600 text-white shadow-md shadow-blue-600/30'
                : 'text-slate-300 hover:bg-slate-800 hover:text-white'
            }`}
          >
            <GitCompare className="w-4 h-4" />
            <span>Compare</span>
            {selectedCount > 0 && (
              <span className="ml-1 px-1.5 py-0.2 rounded-full text-[10px] font-bold bg-amber-400 text-slate-900">
                {selectedCount}
              </span>
            )}
          </button>

          <button
            onClick={openLiveSearch}
            className="px-3 py-2 rounded-lg text-xs font-semibold flex items-center gap-1.5 bg-gradient-to-r from-amber-500/20 to-orange-500/20 hover:from-amber-500/30 hover:to-orange-500/30 text-amber-300 border border-amber-500/30 transition-all whitespace-nowrap cursor-pointer"
          >
            <Sparkles className="w-4 h-4 text-amber-400" />
            <span>Live AI Lookup</span>
          </button>

          <button
            onClick={() => setActiveTab('guide')}
            className={`px-3 py-2 rounded-lg text-xs font-medium flex items-center gap-1.5 transition-colors whitespace-nowrap ${
              activeTab === 'guide'
                ? 'bg-blue-600 text-white shadow-md shadow-blue-600/30'
                : 'text-slate-300 hover:bg-slate-800 hover:text-white'
            }`}
            title="Learn how Revenue, Profit, Assets, Liabilities, and Debt-to-Equity are calculated"
          >
            <BookOpen className="w-4 h-4" />
            <span>Metric Guide</span>
          </button>
        </div>
      </div>
    </header>
  );
};
