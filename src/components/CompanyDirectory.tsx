import React, { useState, useMemo } from 'react';
import {
  Building2,
  TrendingUp,
  DollarSign,
  ChevronRight,
  GitCompare,
  Sparkles,
  Filter,
  CheckCircle2,
  ShieldCheck,
  Scale,
  Activity,
  Layers,
  ArrowRight,
} from 'lucide-react';
import { CompanyData, SectorCategory } from '../types/financials';
import { SECTOR_LIST } from '../data/indianCompaniesData';
import {
  formatCrores,
  getSolvencyRating,
  getLiquidityRating,
} from '../utils/financialCalculations';

interface CompanyDirectoryProps {
  companies: CompanyData[];
  onSelectCompany: (company: CompanyData) => void;
  onCompareToggle: (company: CompanyData) => void;
  comparedIds: string[];
  searchQuery: string;
  openLiveSearch: () => void;
  onOpenScreener: () => void;
}

export const CompanyDirectory: React.FC<CompanyDirectoryProps> = ({
  companies,
  onSelectCompany,
  onCompareToggle,
  comparedIds,
  searchQuery,
  openLiveSearch,
  onOpenScreener,
}) => {
  const [selectedSector, setSelectedSector] = useState<string>('ALL');

  const filteredCompanies = useMemo(() => {
    return companies.filter((c) => {
      if (selectedSector !== 'ALL' && c.sector !== selectedSector) return false;
      if (searchQuery) {
        const q = searchQuery.toLowerCase();
        const matchName = c.name.toLowerCase().includes(q);
        const matchTicker = c.tickerNSE.toLowerCase().includes(q) || c.tickerBSE.toLowerCase().includes(q);
        const matchSector = c.sector.toLowerCase().includes(q);
        const matchSummary = c.summary.toLowerCase().includes(q);
        if (!matchName && !matchTicker && !matchSector && !matchSummary) return false;
      }
      return true;
    });
  }, [companies, selectedSector, searchQuery]);

  // Aggregate marquee stats
  const totalRevenue = companies.reduce((acc, c) => acc + c.latestMetrics.revenue, 0);
  const totalNetProfit = companies.reduce((acc, c) => acc + c.latestMetrics.netProfit, 0);
  const totalEquity = companies.reduce((acc, c) => acc + c.latestMetrics.totalEquity, 0);

  return (
    <div className="space-y-6">
      {/* Hero Marquee Highlights Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950/40 to-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-xl relative overflow-hidden">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 relative z-10">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-blue-500/10 text-blue-400 border border-blue-500/20 mb-3">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>Official Audited Financial Statements (FY 2023-24 Consolidated)</span>
            </div>
            <h1 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight">
              India Inc. Real Financial Intelligence
            </h1>
            <p className="mt-2 text-sm text-slate-300 leading-relaxed">
              Explore authentic, audited numbers for India's leading corporations: <strong className="text-white">Revenue, Operating Profit, Net Profit, Current Assets, Current Liabilities, Total Debt</strong>, and <strong className="text-white">Total Equity</strong> from regulatory filings with BSE and NSE.
            </p>

            <div className="mt-4 flex flex-wrap items-center gap-3">
              <button
                onClick={onOpenScreener}
                className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs transition-colors flex items-center gap-2 shadow-md shadow-blue-600/30"
              >
                <span>Open Multi-Metric Screener</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>

              <button
                onClick={openLiveSearch}
                className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-amber-300 font-semibold text-xs border border-amber-500/30 transition-colors flex items-center gap-2"
              >
                <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                <span>Search Any Indian Company Live</span>
              </button>
            </div>
          </div>

          {/* Aggregate Market Stats */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 min-w-[280px]">
            <div className="bg-slate-900/90 border border-slate-800 p-3.5 rounded-2xl">
              <span className="text-[10px] text-slate-400 font-mono uppercase block">
                Total Corp Revenue
              </span>
              <span className="text-lg font-bold font-mono text-white block">
                {formatCrores(totalRevenue)}
              </span>
              <span className="text-[10px] text-slate-500 font-mono">Consolidated FY24</span>
            </div>

            <div className="bg-slate-900/90 border border-slate-800 p-3.5 rounded-2xl">
              <span className="text-[10px] text-slate-400 font-mono uppercase block">
                Total Net Profit
              </span>
              <span className="text-lg font-bold font-mono text-emerald-400 block">
                {formatCrores(totalNetProfit)}
              </span>
              <span className="text-[10px] text-slate-500 font-mono">Cumulative PAT</span>
            </div>

            <div className="bg-slate-900/90 border border-slate-800 p-3.5 rounded-2xl col-span-2 sm:col-span-1">
              <span className="text-[10px] text-slate-400 font-mono uppercase block">
                Total Net Worth
              </span>
              <span className="text-lg font-bold font-mono text-teal-300 block">
                {formatCrores(totalEquity)}
              </span>
              <span className="text-[10px] text-slate-500 font-mono">Shareholders' Equity</span>
            </div>
          </div>
        </div>
      </div>

      {/* Sector Filter Bar */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2">
        <button
          onClick={() => setSelectedSector('ALL')}
          className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-colors ${
            selectedSector === 'ALL'
              ? 'bg-blue-600 text-white shadow-md shadow-blue-600/30'
              : 'bg-slate-800/80 hover:bg-slate-800 text-slate-300'
          }`}
        >
          All Sectors ({companies.length})
        </button>

        {SECTOR_LIST.map((sec) => {
          const count = companies.filter((c) => c.sector === sec).length;
          return (
            <button
              key={sec}
              onClick={() => setSelectedSector(sec)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-colors ${
                selectedSector === sec
                  ? 'bg-blue-600 text-white shadow-md shadow-blue-600/30'
                  : 'bg-slate-800/80 hover:bg-slate-800 text-slate-300'
              }`}
            >
              {sec} ({count})
            </button>
          );
        })}
      </div>

      {/* Company Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredCompanies.map((company) => {
          const m = company.latestMetrics;
          const isCompared = comparedIds.includes(company.id);
          const isFinancial = company.sector === 'Banking & Financials';
          const solvency = getSolvencyRating(m.debtToEquityRatio ?? 0, isFinancial);
          const liquidity = getLiquidityRating(m.currentRatio ?? 0, isFinancial);

          return (
            <div
              key={company.id}
              onClick={() => onSelectCompany(company)}
              className="bg-slate-900 border border-slate-800 hover:border-slate-700/80 rounded-3xl p-5 transition-all shadow-md hover:shadow-xl hover:-translate-y-0.5 group cursor-pointer flex flex-col justify-between"
            >
              {/* Card Header */}
              <div>
                <div className="flex items-start justify-between gap-3 mb-2">
                  <div>
                    <span className="text-[10px] font-mono font-semibold px-2 py-0.5 rounded bg-blue-500/10 text-blue-400 border border-blue-500/20">
                      {company.sector}
                    </span>
                    <h3 className="text-base font-bold text-white group-hover:text-blue-400 transition-colors mt-1.5">
                      {company.name}
                    </h3>
                  </div>

                  <div className="text-right">
                    <span className="text-[11px] font-mono text-slate-400 block">
                      NSE: <strong className="text-white">{company.tickerNSE}</strong>
                    </span>
                    <span className="text-[10px] font-mono text-slate-500 block">
                      BSE: {company.tickerBSE}
                    </span>
                  </div>
                </div>

                <p className="text-xs text-slate-400 line-clamp-2 mt-1 mb-4">
                  {company.summary}
                </p>

                {/* Key Metrics Mini Grid */}
                <div className="grid grid-cols-2 gap-2 bg-slate-950/70 p-3 rounded-2xl border border-slate-800/70 text-xs font-mono mb-4">
                  <div>
                    <span className="text-[10px] text-slate-500 uppercase block">
                      Revenue
                    </span>
                    <span className="font-bold text-white text-xs">
                      {formatCrores(m.revenue)}
                    </span>
                  </div>

                  <div>
                    <span className="text-[10px] text-slate-500 uppercase block">
                      Operating Profit (EBITDA)
                    </span>
                    <span className="font-bold text-indigo-300 text-xs">
                      {formatCrores(m.operatingProfit)}
                    </span>
                    <span className="text-[10px] text-slate-400 ml-1">
                      ({m.operatingMarginPercent}%)
                    </span>
                  </div>

                  <div>
                    <span className="text-[10px] text-slate-500 uppercase block">
                      Net Profit (PAT)
                    </span>
                    <span
                      className={`font-bold text-xs ${
                        m.netProfit >= 0 ? 'text-emerald-400' : 'text-rose-400'
                      }`}
                    >
                      {formatCrores(m.netProfit)}
                    </span>
                  </div>

                  <div>
                    <span className="text-[10px] text-slate-500 uppercase block">
                      Total Debt
                    </span>
                    <span
                      className={`font-bold text-xs ${
                        m.totalDebt === 0 ? 'text-emerald-400' : 'text-rose-300'
                      }`}
                    >
                      {m.totalDebt === 0 ? 'Zero Debt' : formatCrores(m.totalDebt)}
                    </span>
                  </div>

                  <div>
                    <span className="text-[10px] text-slate-500 uppercase block">
                      Current Assets
                    </span>
                    <span className="font-medium text-cyan-300 text-xs">
                      {formatCrores(m.currentAssets)}
                    </span>
                  </div>

                  <div>
                    <span className="text-[10px] text-slate-500 uppercase block">
                      Current Liab.
                    </span>
                    <span className="font-medium text-amber-300 text-xs">
                      {formatCrores(m.currentLiabilities)}
                    </span>
                  </div>

                  <div className="col-span-2 pt-2 border-t border-slate-800/60 flex items-center justify-between">
                    <div>
                      <span className="text-[10px] text-slate-500 uppercase block">
                        Total Equity (Net Worth)
                      </span>
                      <span className="font-bold text-teal-300 text-xs">
                        {formatCrores(m.totalEquity)}
                      </span>
                    </div>

                    <div className="text-right">
                      <span className="text-[10px] text-slate-500 uppercase block">
                        Debt-to-Equity
                      </span>
                      <span className="font-bold text-white text-xs">
                        {m.debtToEquityRatio}x
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Bottom Card Actions */}
              <div
                className="flex items-center justify-between pt-3 border-t border-slate-800/80 gap-2"
                onClick={(e) => e.stopPropagation()}
              >
                <span
                  className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border truncate max-w-[170px] ${solvency.badgeColor}`}
                  title={solvency.description}
                >
                  {solvency.rating}
                </span>

                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => onCompareToggle(company)}
                    className={`p-1.5 rounded-lg text-xs font-semibold transition-colors ${
                      isCompared
                        ? 'bg-amber-400 text-slate-900 font-bold'
                        : 'bg-slate-800 hover:bg-slate-700 text-slate-300'
                    }`}
                    title={isCompared ? 'Remove from compare' : 'Add to compare'}
                  >
                    <GitCompare className="w-3.5 h-3.5" />
                  </button>

                  <button
                    onClick={() => onSelectCompany(company)}
                    className="px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs flex items-center gap-1 transition-colors"
                  >
                    <span>Dossier</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {filteredCompanies.length === 0 && (
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-12 text-center text-slate-400 space-y-4">
          <Building2 className="w-12 h-12 text-slate-600 mx-auto" />
          <h4 className="text-base font-bold text-white">
            No matching companies in the preloaded directory
          </h4>
          <p className="text-xs text-slate-400 max-w-md mx-auto">
            You can search for "{searchQuery}" using our Live AI Filing tool which queries the latest BSE/NSE regulatory reports directly.
          </p>
          <button
            onClick={openLiveSearch}
            className="px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs inline-flex items-center gap-2 transition-colors cursor-pointer"
          >
            <Sparkles className="w-4 h-4" />
            <span>Search "{searchQuery}" via Live AI</span>
          </button>
        </div>
      )}
    </div>
  );
};
