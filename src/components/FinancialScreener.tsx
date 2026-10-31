import React, { useState, useMemo } from 'react';
import {
  ArrowUpDown,
  ArrowUp,
  ArrowDown,
  Filter,
  CheckCircle2,
  ChevronRight,
  GitCompare,
  Sparkles,
  Search,
  RotateCcw,
} from 'lucide-react';
import { CompanyData, SectorCategory } from '../types/financials';
import { SECTOR_LIST } from '../data/indianCompaniesData';
import {
  formatCrores,
  getSolvencyRating,
  getLiquidityRating,
} from '../utils/financialCalculations';

interface FinancialScreenerProps {
  companies: CompanyData[];
  onSelectCompany: (company: CompanyData) => void;
  onCompareToggle: (company: CompanyData) => void;
  comparedIds: string[];
  openLiveSearch: () => void;
}

type SortField =
  | 'name'
  | 'revenue'
  | 'operatingProfit'
  | 'netProfit'
  | 'currentAssets'
  | 'currentLiabilities'
  | 'totalDebt'
  | 'totalEquity'
  | 'debtToEquityRatio'
  | 'currentRatio'
  | 'marketCapCr';

export const FinancialScreener: React.FC<FinancialScreenerProps> = ({
  companies,
  onSelectCompany,
  onCompareToggle,
  comparedIds,
  openLiveSearch,
}) => {
  const [sectorFilter, setSectorFilter] = useState<string>('ALL');
  const [debtFilter, setDebtFilter] = useState<string>('ALL');
  const [minRevenue, setMinRevenue] = useState<number>(0);
  const [profitOnly, setProfitOnly] = useState<boolean>(false);
  const [sortField, setSortField] = useState<SortField>('marketCapCr');
  const [sortAsc, setSortAsc] = useState<boolean>(false);
  const [search, setSearch] = useState<string>('');

  const filteredCompanies = useMemo(() => {
    return companies
      .filter((c) => {
        // Sector filter
        if (sectorFilter !== 'ALL' && c.sector !== sectorFilter) return false;

        // Debt to Equity filter
        const de = c.latestMetrics.debtToEquityRatio ?? 0;
        if (debtFilter === 'DEBT_FREE') {
          if (c.latestMetrics.totalDebt > 100) return false;
        } else if (debtFilter === 'LOW_DEBT') {
          if (de > 0.5) return false;
        } else if (debtFilter === 'MODERATE') {
          if (de <= 0.5 || de > 1.5) return false;
        } else if (debtFilter === 'HIGH_DEBT') {
          if (de <= 1.5) return false;
        }

        // Min Revenue
        if (minRevenue > 0 && c.latestMetrics.revenue < minRevenue) return false;

        // Profit only
        if (profitOnly && c.latestMetrics.netProfit <= 0) return false;

        // Text search
        if (search) {
          const q = search.toLowerCase();
          const matchName = c.name.toLowerCase().includes(q);
          const matchNSE = c.tickerNSE.toLowerCase().includes(q);
          const matchBSE = c.tickerBSE.toLowerCase().includes(q);
          const matchSector = c.sector.toLowerCase().includes(q);
          if (!matchName && !matchNSE && !matchBSE && !matchSector) return false;
        }

        return true;
      })
      .sort((a, b) => {
        let valA: any;
        let valB: any;

        if (sortField === 'name') {
          valA = a.name;
          valB = b.name;
          return sortAsc ? valA.localeCompare(valB) : valB.localeCompare(valA);
        } else if (sortField === 'marketCapCr') {
          valA = a.marketCapCr;
          valB = b.marketCapCr;
        } else {
          valA = a.latestMetrics[sortField] ?? 0;
          valB = b.latestMetrics[sortField] ?? 0;
        }

        return sortAsc ? valA - valB : valB - valA;
      });
  }, [companies, sectorFilter, debtFilter, minRevenue, profitOnly, sortField, sortAsc, search]);

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortAsc(!sortAsc);
    } else {
      setSortField(field);
      setSortAsc(false); // default descending for financial magnitudes
    }
  };

  const resetFilters = () => {
    setSectorFilter('ALL');
    setDebtFilter('ALL');
    setMinRevenue(0);
    setProfitOnly(false);
    setSearch('');
    setSortField('marketCapCr');
    setSortAsc(false);
  };

  return (
    <div className="space-y-6">
      {/* Title & Stats */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-md">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="w-2.5 h-2.5 rounded-full bg-blue-500"></span>
            <h2 className="text-xl font-bold text-white tracking-tight">
              Corporate Financial Screener
            </h2>
            <span className="text-xs font-mono px-2 py-0.5 rounded bg-blue-500/20 text-blue-400 font-semibold border border-blue-500/30">
              {filteredCompanies.length} Companies
            </span>
          </div>
          <p className="text-xs text-slate-400">
            Screen and sort India’s top corporations across Revenue, Operating Profit, Net Profit, Assets, Liabilities, Debt, and Equity.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={resetFilters}
            className="px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs text-slate-300 hover:text-white font-medium flex items-center gap-1.5 transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset Filters</span>
          </button>

          <button
            onClick={openLiveSearch}
            className="px-4 py-2 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-slate-950 font-bold text-xs flex items-center gap-1.5 shadow-md shadow-amber-500/20 transition-all cursor-pointer"
          >
            <Sparkles className="w-4 h-4" />
            <span>Search Unlisted / Any Indian Firm</span>
          </button>
        </div>
      </div>

      {/* Filter Bar Controls */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 sm:p-5 shadow-sm space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Sector filter */}
          <div>
            <label className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 block mb-1.5 font-mono">
              Sector
            </label>
            <select
              value={sectorFilter}
              onChange={(e) => setSectorFilter(e.target.value)}
              className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-blue-500 font-medium"
            >
              <option value="ALL">All Sectors ({companies.length})</option>
              {SECTOR_LIST.map((sec) => (
                <option key={sec} value={sec}>
                  {sec}
                </option>
              ))}
            </select>
          </div>

          {/* Solvency / Debt to Equity filter */}
          <div>
            <label className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 block mb-1.5 font-mono">
              Debt-to-Equity Filter
            </label>
            <select
              value={debtFilter}
              onChange={(e) => setDebtFilter(e.target.value)}
              className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-blue-500 font-medium"
            >
              <option value="ALL">All Leverage Profiles</option>
              <option value="DEBT_FREE">Virtually Zero Debt (&lt; ₹100 Cr)</option>
              <option value="LOW_DEBT">Low Debt (D/E &le; 0.5)</option>
              <option value="MODERATE">Moderate Leverage (0.5 &lt; D/E &le; 1.5)</option>
              <option value="HIGH_DEBT">High Leverage (D/E &gt; 1.5)</option>
            </select>
          </div>

          {/* Minimum Revenue Threshold */}
          <div>
            <label className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 block mb-1.5 font-mono">
              Min Annual Revenue
            </label>
            <select
              value={minRevenue}
              onChange={(e) => setMinRevenue(Number(e.target.value))}
              className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-blue-500 font-medium"
            >
              <option value={0}>Any Revenue Size</option>
              <option value={10000}>&ge; ₹10,000 Cr</option>
              <option value={25000}>&ge; ₹25,000 Cr</option>
              <option value={50000}>&ge; ₹50,000 Cr</option>
              <option value={100000}>&ge; ₹1,00,000 Cr (Mega Caps)</option>
            </select>
          </div>

          {/* Quick Search inside Screener */}
          <div>
            <label className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 block mb-1.5 font-mono">
              Filter By Ticker / Name
            </label>
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Filter results..."
                className="w-full bg-slate-800 border border-slate-700 rounded-xl pl-9 pr-3 py-2 text-xs text-white focus:outline-none focus:border-blue-500"
              />
            </div>
          </div>
        </div>

        {/* Checkbox pills */}
        <div className="flex flex-wrap items-center gap-3 pt-2 border-t border-slate-800/80">
          <label className="inline-flex items-center gap-2 text-xs text-slate-300 cursor-pointer bg-slate-800/60 px-3 py-1.5 rounded-lg border border-slate-700/60 hover:bg-slate-800 transition-colors">
            <input
              type="checkbox"
              checked={profitOnly}
              onChange={(e) => setProfitOnly(e.target.checked)}
              className="rounded bg-slate-700 border-slate-600 text-blue-500 focus:ring-0"
            />
            <span>Profitable Only (Net Profit &gt; 0)</span>
          </label>

          <span className="text-xs text-slate-500">
            Tip: Click on any column header below to sort ascending or descending.
          </span>
        </div>
      </div>

      {/* Main Screener Table */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-mono border-collapse">
            <thead>
              <tr className="bg-slate-950/90 text-slate-400 uppercase tracking-wider border-b border-slate-800">
                <th
                  onClick={() => handleSort('name')}
                  className="py-3.5 px-4 font-bold text-slate-300 hover:text-white cursor-pointer select-none transition-colors"
                >
                  <div className="flex items-center gap-1.5">
                    <span>Company &amp; Sector</span>
                    <ArrowUpDown className="w-3 h-3 text-slate-500" />
                  </div>
                </th>

                <th
                  onClick={() => handleSort('revenue')}
                  className="py-3.5 px-4 font-bold text-right text-slate-300 hover:text-white cursor-pointer select-none transition-colors"
                >
                  <div className="flex items-center justify-end gap-1.5">
                    <span>Revenue (₹ Cr)</span>
                    <ArrowUpDown className="w-3 h-3 text-slate-500" />
                  </div>
                </th>

                <th
                  onClick={() => handleSort('operatingProfit')}
                  className="py-3.5 px-4 font-bold text-right text-slate-300 hover:text-white cursor-pointer select-none transition-colors"
                >
                  <div className="flex items-center justify-end gap-1.5">
                    <span>Operating Profit</span>
                    <ArrowUpDown className="w-3 h-3 text-slate-500" />
                  </div>
                </th>

                <th
                  onClick={() => handleSort('netProfit')}
                  className="py-3.5 px-4 font-bold text-right text-slate-300 hover:text-white cursor-pointer select-none transition-colors"
                >
                  <div className="flex items-center justify-end gap-1.5">
                    <span>Net Profit (PAT)</span>
                    <ArrowUpDown className="w-3 h-3 text-slate-500" />
                  </div>
                </th>

                <th
                  onClick={() => handleSort('currentAssets')}
                  className="py-3.5 px-4 font-bold text-right text-slate-300 hover:text-white cursor-pointer select-none transition-colors"
                >
                  <div className="flex items-center justify-end gap-1.5">
                    <span>Current Assets</span>
                    <ArrowUpDown className="w-3 h-3 text-slate-500" />
                  </div>
                </th>

                <th
                  onClick={() => handleSort('currentLiabilities')}
                  className="py-3.5 px-4 font-bold text-right text-slate-300 hover:text-white cursor-pointer select-none transition-colors"
                >
                  <div className="flex items-center justify-end gap-1.5">
                    <span>Current Liab.</span>
                    <ArrowUpDown className="w-3 h-3 text-slate-500" />
                  </div>
                </th>

                <th
                  onClick={() => handleSort('totalDebt')}
                  className="py-3.5 px-4 font-bold text-right text-slate-300 hover:text-white cursor-pointer select-none transition-colors"
                >
                  <div className="flex items-center justify-end gap-1.5">
                    <span>Total Debt</span>
                    <ArrowUpDown className="w-3 h-3 text-slate-500" />
                  </div>
                </th>

                <th
                  onClick={() => handleSort('totalEquity')}
                  className="py-3.5 px-4 font-bold text-right text-slate-300 hover:text-white cursor-pointer select-none transition-colors"
                >
                  <div className="flex items-center justify-end gap-1.5">
                    <span>Total Equity</span>
                    <ArrowUpDown className="w-3 h-3 text-slate-500" />
                  </div>
                </th>

                <th
                  onClick={() => handleSort('debtToEquityRatio')}
                  className="py-3.5 px-4 font-bold text-center text-slate-300 hover:text-white cursor-pointer select-none transition-colors"
                >
                  <div className="flex items-center justify-center gap-1.5">
                    <span>D/E Ratio</span>
                    <ArrowUpDown className="w-3 h-3 text-slate-500" />
                  </div>
                </th>

                <th
                  onClick={() => handleSort('currentRatio')}
                  className="py-3.5 px-4 font-bold text-center text-slate-300 hover:text-white cursor-pointer select-none transition-colors"
                >
                  <div className="flex items-center justify-center gap-1.5">
                    <span>Curr. Ratio</span>
                    <ArrowUpDown className="w-3 h-3 text-slate-500" />
                  </div>
                </th>

                <th className="py-3.5 px-4 text-center font-bold text-slate-300">
                  Actions
                </th>
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-800">
              {filteredCompanies.map((c) => {
                const m = c.latestMetrics;
                const isCompared = comparedIds.includes(c.id);
                const isFinancial = c.sector === 'Banking & Financials';
                const solvency = getSolvencyRating(m.debtToEquityRatio ?? 0, isFinancial);

                return (
                  <tr
                    key={c.id}
                    className="hover:bg-slate-800/50 transition-colors group cursor-pointer"
                    onClick={() => onSelectCompany(c)}
                  >
                    {/* Company Name & Sector */}
                    <td className="py-3.5 px-4">
                      <div>
                        <div className="font-bold text-white group-hover:text-blue-400 transition-colors font-sans flex items-center gap-2">
                          <span>{c.name}</span>
                          <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-slate-800 text-slate-300 border border-slate-700">
                            {c.tickerNSE}
                          </span>
                        </div>
                        <span className="text-[11px] text-slate-400 font-sans">
                          {c.sector}
                        </span>
                      </div>
                    </td>

                    {/* Revenue */}
                    <td className="py-3.5 px-4 text-right font-bold text-white">
                      {formatCrores(m.revenue)}
                    </td>

                    {/* Operating Profit */}
                    <td className="py-3.5 px-4 text-right">
                      <div className="font-bold text-indigo-300">
                        {formatCrores(m.operatingProfit)}
                      </div>
                      <span className="text-[10px] text-slate-400">
                        {m.operatingMarginPercent}% margin
                      </span>
                    </td>

                    {/* Net Profit */}
                    <td className="py-3.5 px-4 text-right">
                      <div
                        className={`font-bold ${
                          m.netProfit >= 0 ? 'text-emerald-400' : 'text-rose-400'
                        }`}
                      >
                        {formatCrores(m.netProfit)}
                      </div>
                      <span className="text-[10px] text-slate-400">
                        {m.netProfitMarginPercent}% PAT
                      </span>
                    </td>

                    {/* Current Assets */}
                    <td className="py-3.5 px-4 text-right font-medium text-cyan-300">
                      {formatCrores(m.currentAssets)}
                    </td>

                    {/* Current Liabilities */}
                    <td className="py-3.5 px-4 text-right font-medium text-amber-300">
                      {formatCrores(m.currentLiabilities)}
                    </td>

                    {/* Total Debt */}
                    <td className="py-3.5 px-4 text-right">
                      <span
                        className={`font-bold ${
                          m.totalDebt === 0 ? 'text-emerald-400 font-semibold' : 'text-rose-300'
                        }`}
                      >
                        {m.totalDebt === 0 ? '₹0 (Debt Free)' : formatCrores(m.totalDebt)}
                      </span>
                    </td>

                    {/* Total Equity */}
                    <td className="py-3.5 px-4 text-right font-medium text-teal-300">
                      {formatCrores(m.totalEquity)}
                    </td>

                    {/* D/E Ratio */}
                    <td className="py-3.5 px-4 text-center">
                      <span
                        className={`inline-block px-2 py-0.5 rounded text-[11px] font-bold border ${solvency.badgeColor}`}
                        title={solvency.description}
                      >
                        {m.debtToEquityRatio}x
                      </span>
                    </td>

                    {/* Current Ratio */}
                    <td className="py-3.5 px-4 text-center">
                      <span className="font-bold text-slate-300">
                        {m.currentRatio}x
                      </span>
                    </td>

                    {/* Actions */}
                    <td
                      className="py-3.5 px-4 text-center"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <div className="flex items-center justify-center gap-1.5">
                        <button
                          onClick={() => onCompareToggle(c)}
                          title={isCompared ? 'Remove from compare' : 'Add to compare'}
                          className={`p-1.5 rounded-lg text-xs font-semibold transition-colors ${
                            isCompared
                              ? 'bg-amber-400 text-slate-900'
                              : 'bg-slate-800 hover:bg-slate-700 text-slate-300'
                          }`}
                        >
                          <GitCompare className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => onSelectCompany(c)}
                          className="p-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white transition-colors"
                          title="View complete financial report"
                        >
                          <ChevronRight className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
