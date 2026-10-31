import React from 'react';
import {
  GitCompare,
  X,
  Plus,
  ArrowRight,
  TrendingUp,
  Scale,
  ShieldCheck,
  CheckCircle2,
  Building2,
  Trash2,
} from 'lucide-react';
import { CompanyData } from '../types/financials';
import {
  formatCrores,
  getSolvencyRating,
  getLiquidityRating,
} from '../utils/financialCalculations';

interface CompanyComparisonViewProps {
  companies: CompanyData[];
  onRemove: (companyId: string) => void;
  onClear: () => void;
  onSelectCompany: (company: CompanyData) => void;
  allCompanies: CompanyData[];
  onAddCompany: (company: CompanyData) => void;
}

export const CompanyComparisonView: React.FC<CompanyComparisonViewProps> = ({
  companies,
  onRemove,
  onClear,
  onSelectCompany,
  allCompanies,
  onAddCompany,
}) => {
  const [selectorOpen, setSelectorOpen] = React.useState(false);
  const [filterText, setFilterText] = React.useState('');

  const availableToAdd = allCompanies.filter(
    (c) => !companies.some((selected) => selected.id === c.id)
  );

  const filteredAvailable = availableToAdd.filter(
    (c) =>
      c.name.toLowerCase().includes(filterText.toLowerCase()) ||
      c.tickerNSE.toLowerCase().includes(filterText.toLowerCase()) ||
      c.sector.toLowerCase().includes(filterText.toLowerCase())
  );

  if (companies.length === 0) {
    return (
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-8 sm:p-12 text-center max-w-2xl mx-auto my-8 shadow-xl">
        <div className="w-16 h-16 rounded-2xl bg-blue-500/10 border border-blue-500/20 text-blue-400 flex items-center justify-center mx-auto mb-4">
          <GitCompare className="w-8 h-8" />
        </div>
        <h3 className="text-xl font-bold text-white mb-2">
          Side-by-Side Peer Comparison
        </h3>
        <p className="text-sm text-slate-400 mb-6">
          Compare 2 or more Indian companies side-by-side to evaluate who has higher revenue, superior operating margins, healthier current asset coverage, and lower debt-to-equity ratio.
        </p>

        <div className="flex flex-wrap items-center justify-center gap-2 mb-8">
          <span className="text-xs text-slate-400">Quick start recommendations:</span>
          <button
            onClick={() => {
              const tcs = allCompanies.find((c) => c.id === 'tcs');
              const infy = allCompanies.find((c) => c.id === 'infosys');
              const wipro = allCompanies.find((c) => c.id === 'wipro');
              if (tcs) onAddCompany(tcs);
              if (infy) onAddCompany(infy);
              if (wipro) onAddCompany(wipro);
            }}
            className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs text-slate-200 border border-slate-700 transition-colors"
          >
            TCS vs Infosys vs Wipro (IT Giants)
          </button>
          <button
            onClick={() => {
              const rel = allCompanies.find((c) => c.id === 'reliance-industries');
              const ongc = allCompanies.find((c) => c.id === 'ongc');
              const ntpc = allCompanies.find((c) => c.id === 'ntpc');
              if (rel) onAddCompany(rel);
              if (ongc) onAddCompany(ongc);
              if (ntpc) onAddCompany(ntpc);
            }}
            className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs text-slate-200 border border-slate-700 transition-colors"
          >
            Reliance vs ONGC vs NTPC (Energy)
          </button>
          <button
            onClick={() => {
              const hul = allCompanies.find((c) => c.id === 'hindustan-unilever');
              const itc = allCompanies.find((c) => c.id === 'itc');
              const nestle = allCompanies.find((c) => c.id === 'nestle-india');
              if (hul) onAddCompany(hul);
              if (itc) onAddCompany(itc);
              if (nestle) onAddCompany(nestle);
            }}
            className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs text-slate-200 border border-slate-700 transition-colors"
          >
            HUL vs ITC vs Nestlé (FMCG Moats)
          </button>
        </div>

        <button
          onClick={() => setSelectorOpen(true)}
          className="px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold text-sm transition-colors shadow-lg shadow-blue-600/30 inline-flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          <span>Select Companies to Compare</span>
        </button>

        {selectorOpen && (
          <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 max-w-xl w-full text-left max-h-[85vh] flex flex-col shadow-2xl">
              <div className="flex items-center justify-between pb-4 border-b border-slate-800">
                <h4 className="text-base font-bold text-white">
                  Add Company to Comparison
                </h4>
                <button
                  onClick={() => setSelectorOpen(false)}
                  className="p-1 rounded-lg text-slate-400 hover:text-white"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="py-3">
                <input
                  type="text"
                  value={filterText}
                  onChange={(e) => setFilterText(e.target.value)}
                  placeholder="Search company or sector..."
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-2 text-xs text-white placeholder-slate-400 focus:outline-none focus:border-blue-500"
                />
              </div>

              <div className="overflow-y-auto divide-y divide-slate-800 flex-1">
                {filteredAvailable.map((c) => (
                  <div
                    key={c.id}
                    onClick={() => {
                      onAddCompany(c);
                      setSelectorOpen(false);
                    }}
                    className="p-3 hover:bg-slate-800/60 cursor-pointer rounded-xl flex items-center justify-between transition-colors"
                  >
                    <div>
                      <div className="text-sm font-bold text-white">
                        {c.name} ({c.tickerNSE})
                      </div>
                      <div className="text-xs text-slate-400">{c.sector}</div>
                    </div>
                    <span className="text-xs font-mono text-emerald-400 font-bold">
                      Rev: {formatCrores(c.latestMetrics.revenue)}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }

  // Find maximum values for visual bars
  const maxRevenue = Math.max(...companies.map((c) => c.latestMetrics.revenue));
  const maxOpProfit = Math.max(...companies.map((c) => c.latestMetrics.operatingProfit));
  const maxNetProfit = Math.max(...companies.map((c) => Math.max(0, c.latestMetrics.netProfit)));
  const maxCurrentAssets = Math.max(...companies.map((c) => c.latestMetrics.currentAssets));
  const maxDebt = Math.max(...companies.map((c) => c.latestMetrics.totalDebt));
  const maxEquity = Math.max(...companies.map((c) => c.latestMetrics.totalEquity));

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-md">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <GitCompare className="w-5 h-5 text-blue-400" />
            <h2 className="text-xl font-bold text-white tracking-tight">
              Company Peer Comparison Matrix
            </h2>
            <span className="text-xs px-2 py-0.5 rounded bg-blue-500/20 text-blue-400 font-bold border border-blue-500/30">
              {companies.length} Selected
            </span>
          </div>
          <p className="text-xs text-slate-400">
            Side-by-side breakdown of audited Revenue, Operating Profit, PAT, Assets, Liabilities, Debt, and Equity.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setSelectorOpen(true)}
            className="px-3.5 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs flex items-center gap-1.5 transition-colors shadow-sm"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Peer</span>
          </button>
          <button
            onClick={onClear}
            className="px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white font-medium text-xs flex items-center gap-1.5 transition-colors"
          >
            <Trash2 className="w-3.5 h-3.5 text-rose-400" />
            <span>Clear All</span>
          </button>
        </div>
      </div>

      {/* Comparison Grid Table */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-mono border-collapse">
            <thead>
              <tr className="bg-slate-950 text-slate-400 uppercase tracking-wider border-b border-slate-800">
                <th className="py-4 px-4 font-bold text-slate-300 w-56 sticky left-0 bg-slate-950 z-10">
                  Financial Metric
                </th>
                {companies.map((c) => (
                  <th key={c.id} className="py-4 px-4 font-bold text-white min-w-[200px] border-l border-slate-800">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <div
                          onClick={() => onSelectCompany(c)}
                          className="font-bold text-sm text-white hover:text-blue-400 cursor-pointer font-sans"
                        >
                          {c.name}
                        </div>
                        <div className="text-[11px] text-slate-400 font-sans mt-0.5">
                          {c.tickerNSE} • {c.sector}
                        </div>
                      </div>
                      <button
                        onClick={() => onRemove(c.id)}
                        className="p-1 rounded-md text-slate-500 hover:text-rose-400 hover:bg-slate-800"
                        title="Remove from comparison"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  </th>
                ))}
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-800">
              {/* Reporting Period */}
              <tr className="hover:bg-slate-800/30">
                <td className="py-3 px-4 font-sans font-semibold text-slate-300 sticky left-0 bg-slate-900 z-10">
                  Audited Filing Year
                </td>
                {companies.map((c) => (
                  <td key={c.id} className="py-3 px-4 border-l border-slate-800 text-slate-300 font-medium">
                    {c.latestMetrics.fiscalYear}
                  </td>
                ))}
              </tr>

              {/* 1. Revenue */}
              <tr className="hover:bg-slate-800/30 bg-slate-950/20">
                <td className="py-3.5 px-4 font-sans font-bold text-white sticky left-0 bg-slate-900 z-10 flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-blue-400"></span>
                  1. Revenue from Operations
                </td>
                {companies.map((c) => {
                  const val = c.latestMetrics.revenue;
                  const pctOfMax = (val / (maxRevenue || 1)) * 100;
                  return (
                    <td key={c.id} className="py-3.5 px-4 border-l border-slate-800">
                      <div className="font-bold text-white text-sm">
                        {formatCrores(val)}
                      </div>
                      <div className="w-full bg-slate-800 h-1.5 rounded-full mt-1.5 overflow-hidden">
                        <div
                          className="bg-blue-500 h-full rounded-full"
                          style={{ width: `${pctOfMax}%` }}
                        ></div>
                      </div>
                    </td>
                  );
                })}
              </tr>

              {/* 2. Operating Profit */}
              <tr className="hover:bg-slate-800/30">
                <td className="py-3.5 px-4 font-sans font-bold text-white sticky left-0 bg-slate-900 z-10 flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-indigo-400"></span>
                  2. Operating Profit (EBITDA)
                </td>
                {companies.map((c) => {
                  const val = c.latestMetrics.operatingProfit;
                  const pctOfMax = (val / (maxOpProfit || 1)) * 100;
                  return (
                    <td key={c.id} className="py-3.5 px-4 border-l border-slate-800">
                      <div className="font-bold text-indigo-300 text-sm">
                        {formatCrores(val)}
                      </div>
                      <span className="text-[10px] text-slate-400">
                        Margin: {c.latestMetrics.operatingMarginPercent}%
                      </span>
                      <div className="w-full bg-slate-800 h-1.5 rounded-full mt-1.5 overflow-hidden">
                        <div
                          className="bg-indigo-500 h-full rounded-full"
                          style={{ width: `${pctOfMax}%` }}
                        ></div>
                      </div>
                    </td>
                  );
                })}
              </tr>

              {/* 3. Net Profit */}
              <tr className="hover:bg-slate-800/30 bg-slate-950/20">
                <td className="py-3.5 px-4 font-sans font-bold text-white sticky left-0 bg-slate-900 z-10 flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-400"></span>
                  3. Net Profit (PAT)
                </td>
                {companies.map((c) => {
                  const val = c.latestMetrics.netProfit;
                  const pctOfMax = (Math.max(0, val) / (maxNetProfit || 1)) * 100;
                  return (
                    <td key={c.id} className="py-3.5 px-4 border-l border-slate-800">
                      <div
                        className={`font-bold text-sm ${
                          val >= 0 ? 'text-emerald-400' : 'text-rose-400'
                        }`}
                      >
                        {formatCrores(val)}
                      </div>
                      <span className="text-[10px] text-slate-400">
                        PAT Margin: {c.latestMetrics.netProfitMarginPercent}%
                      </span>
                      <div className="w-full bg-slate-800 h-1.5 rounded-full mt-1.5 overflow-hidden">
                        <div
                          className="bg-emerald-500 h-full rounded-full"
                          style={{ width: `${pctOfMax}%` }}
                        ></div>
                      </div>
                    </td>
                  );
                })}
              </tr>

              {/* 4. Current Assets */}
              <tr className="hover:bg-slate-800/30">
                <td className="py-3.5 px-4 font-sans font-bold text-white sticky left-0 bg-slate-900 z-10 flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-cyan-400"></span>
                  4. Current Assets
                </td>
                {companies.map((c) => {
                  const val = c.latestMetrics.currentAssets;
                  return (
                    <td key={c.id} className="py-3.5 px-4 border-l border-slate-800 font-bold text-cyan-300">
                      {formatCrores(val)}
                    </td>
                  );
                })}
              </tr>

              {/* 5. Current Liabilities */}
              <tr className="hover:bg-slate-800/30">
                <td className="py-3.5 px-4 font-sans font-bold text-white sticky left-0 bg-slate-900 z-10 flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-amber-400"></span>
                  5. Current Liabilities
                </td>
                {companies.map((c) => {
                  const val = c.latestMetrics.currentLiabilities;
                  return (
                    <td key={c.id} className="py-3.5 px-4 border-l border-slate-800 font-bold text-amber-300">
                      {formatCrores(val)}
                    </td>
                  );
                })}
              </tr>

              {/* Working Capital */}
              <tr className="hover:bg-slate-800/30 bg-slate-950/20">
                <td className="py-3 px-4 font-sans font-semibold text-slate-300 sticky left-0 bg-slate-900 z-10">
                  Working Capital (Assets - Liab)
                </td>
                {companies.map((c) => (
                  <td key={c.id} className="py-3 px-4 border-l border-slate-800 font-bold text-white">
                    {formatCrores(c.latestMetrics.workingCapital ?? 0)}
                  </td>
                ))}
              </tr>

              {/* Current Ratio */}
              <tr className="hover:bg-slate-800/30">
                <td className="py-3 px-4 font-sans font-semibold text-slate-300 sticky left-0 bg-slate-900 z-10">
                  Current Ratio (Liquidity)
                </td>
                {companies.map((c) => {
                  const cr = c.latestMetrics.currentRatio ?? 0;
                  const isFinancial = c.sector === 'Banking & Financials';
                  const liq = getLiquidityRating(cr, isFinancial);
                  return (
                    <td key={c.id} className="py-3 px-4 border-l border-slate-800">
                      <span className="font-bold text-white text-sm">{cr}x</span>
                      <span className="block text-[10px] text-slate-400 font-sans">
                        {liq.rating}
                      </span>
                    </td>
                  );
                })}
              </tr>

              {/* 6. Total Debt */}
              <tr className="hover:bg-slate-800/30 bg-slate-950/20">
                <td className="py-3.5 px-4 font-sans font-bold text-white sticky left-0 bg-slate-900 z-10 flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-rose-400"></span>
                  6. Total Debt
                </td>
                {companies.map((c) => {
                  const val = c.latestMetrics.totalDebt;
                  return (
                    <td key={c.id} className="py-3.5 px-4 border-l border-slate-800">
                      <div
                        className={`font-bold ${
                          val === 0 ? 'text-emerald-400' : 'text-rose-300'
                        }`}
                      >
                        {val === 0 ? '₹0 (Debt Free)' : formatCrores(val)}
                      </div>
                    </td>
                  );
                })}
              </tr>

              {/* 7. Total Equity */}
              <tr className="hover:bg-slate-800/30">
                <td className="py-3.5 px-4 font-sans font-bold text-white sticky left-0 bg-slate-900 z-10 flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-teal-400"></span>
                  7. Total Equity / Net Worth
                </td>
                {companies.map((c) => {
                  const val = c.latestMetrics.totalEquity;
                  return (
                    <td key={c.id} className="py-3.5 px-4 border-l border-slate-800 font-bold text-teal-300">
                      {formatCrores(val)}
                    </td>
                  );
                })}
              </tr>

              {/* Debt-to-Equity Ratio */}
              <tr className="hover:bg-slate-800/30 bg-slate-950/40">
                <td className="py-3.5 px-4 font-sans font-bold text-purple-300 sticky left-0 bg-slate-900 z-10">
                  Debt-to-Equity (Solvency)
                </td>
                {companies.map((c) => {
                  const de = c.latestMetrics.debtToEquityRatio ?? 0;
                  const isFinancial = c.sector === 'Banking & Financials';
                  const sol = getSolvencyRating(de, isFinancial);
                  return (
                    <td key={c.id} className="py-3.5 px-4 border-l border-slate-800">
                      <span className={`inline-block px-2.5 py-1 rounded-lg text-xs font-bold border ${sol.badgeColor}`}>
                        {de}x • {sol.rating}
                      </span>
                    </td>
                  );
                })}
              </tr>

              {/* Market Cap */}
              <tr className="hover:bg-slate-800/30">
                <td className="py-3 px-4 font-sans font-semibold text-slate-400 sticky left-0 bg-slate-900 z-10">
                  Market Capitalization
                </td>
                {companies.map((c) => (
                  <td key={c.id} className="py-3 px-4 border-l border-slate-800 font-bold text-slate-300">
                    {formatCrores(c.marketCapCr)}
                  </td>
                ))}
              </tr>

              {/* View Dossier Action */}
              <tr className="hover:bg-slate-800/30">
                <td className="py-3 px-4 font-sans font-semibold text-slate-400 sticky left-0 bg-slate-900 z-10">
                  Action
                </td>
                {companies.map((c) => (
                  <td key={c.id} className="py-3 px-4 border-l border-slate-800">
                    <button
                      onClick={() => onSelectCompany(c)}
                      className="px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs flex items-center gap-1 transition-colors"
                    >
                      <span>View Dossier</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </td>
                ))}
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal to add more companies */}
      {selectorOpen && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 max-w-xl w-full text-left max-h-[85vh] flex flex-col shadow-2xl">
            <div className="flex items-center justify-between pb-4 border-b border-slate-800">
              <h4 className="text-base font-bold text-white">
                Add Company to Comparison
              </h4>
              <button
                onClick={() => setSelectorOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="py-3">
              <input
                type="text"
                value={filterText}
                onChange={(e) => setFilterText(e.target.value)}
                placeholder="Search company name or ticker..."
                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-2 text-xs text-white placeholder-slate-400 focus:outline-none focus:border-blue-500"
              />
            </div>

            <div className="overflow-y-auto divide-y divide-slate-800 flex-1">
              {filteredAvailable.map((c) => (
                <div
                  key={c.id}
                  onClick={() => {
                    onAddCompany(c);
                    setSelectorOpen(false);
                  }}
                  className="p-3 hover:bg-slate-800/60 cursor-pointer rounded-xl flex items-center justify-between transition-colors"
                >
                  <div>
                    <div className="text-sm font-bold text-white">
                      {c.name} ({c.tickerNSE})
                    </div>
                    <div className="text-xs text-slate-400">{c.sector}</div>
                  </div>
                  <span className="text-xs font-mono text-emerald-400 font-bold">
                    Rev: {formatCrores(c.latestMetrics.revenue)}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
