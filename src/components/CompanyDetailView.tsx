import React from 'react';
import {
  Building2,
  Calendar,
  CheckCircle2,
  FileText,
  Share2,
  GitCompare,
  ArrowLeft,
  Download,
  AlertCircle,
  ShieldCheck,
  TrendingUp,
  Scale,
  Briefcase,
  Layers,
  Percent,
  Check,
} from 'lucide-react';
import { CompanyData } from '../types/financials';
import { MetricCard } from './MetricCard';
import {
  formatCrores,
  formatPercent,
  getSolvencyRating,
  getLiquidityRating,
} from '../utils/financialCalculations';

interface CompanyDetailViewProps {
  company: CompanyData;
  onBack: () => void;
  onCompareToggle: (company: CompanyData) => void;
  isCompared: boolean;
}

export const CompanyDetailView: React.FC<CompanyDetailViewProps> = ({
  company,
  onBack,
  onCompareToggle,
  isCompared,
}) => {
  const [copied, setCopied] = React.useState(false);
  const m = company.latestMetrics;
  const isFinancial = company.sector === 'Banking & Financials';
  const solvency = getSolvencyRating(m.debtToEquityRatio ?? 0, isFinancial);
  const liquidity = getLiquidityRating(m.currentRatio ?? 0, isFinancial);

  // Calculate YoY growth if historical data is available
  const prevYear = company.historicalYears[0];
  const revGrowth = prevYear
    ? ((m.revenue - prevYear.revenue) / prevYear.revenue) * 100
    : undefined;
  const opGrowth = prevYear
    ? ((m.operatingProfit - prevYear.operatingProfit) / Math.abs(prevYear.operatingProfit || 1)) * 100
    : undefined;
  const patGrowth = prevYear
    ? ((m.netProfit - prevYear.netProfit) / Math.abs(prevYear.netProfit || 1)) * 100
    : undefined;

  const copySummary = () => {
    const text = `${company.name} (${company.tickerNSE}) Audited Financials [${m.fiscalYear}]
• Revenue: ${formatCrores(m.revenue)}
• Operating Profit (EBITDA): ${formatCrores(m.operatingProfit)} (Margin: ${m.operatingMarginPercent}%)
• Net Profit (PAT): ${formatCrores(m.netProfit)} (Margin: ${m.netProfitMarginPercent}%)
• Current Assets: ${formatCrores(m.currentAssets)}
• Current Liabilities: ${formatCrores(m.currentLiabilities)}
• Total Debt: ${formatCrores(m.totalDebt)}
• Total Equity: ${formatCrores(m.totalEquity)}
• Debt-to-Equity Ratio: ${m.debtToEquityRatio} (${solvency.rating})
• Current Ratio: ${m.currentRatio}
• Source: ${company.sourceFiling} (${company.auditor})`;

    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const exportCSV = () => {
    const rows = [
      ['Metric', m.fiscalYear, ...(company.historicalYears.map((h) => h.fiscalYear))],
      ['Revenue from Operations (₹ Cr)', m.revenue, ...company.historicalYears.map((h) => h.revenue)],
      ['Operating Profit / EBITDA (₹ Cr)', m.operatingProfit, ...company.historicalYears.map((h) => h.operatingProfit)],
      ['Net Profit / PAT (₹ Cr)', m.netProfit, ...company.historicalYears.map((h) => h.netProfit)],
      ['Current Assets (₹ Cr)', m.currentAssets, ...company.historicalYears.map((h) => h.currentAssets)],
      ['Current Liabilities (₹ Cr)', m.currentLiabilities, ...company.historicalYears.map((h) => h.currentLiabilities)],
      ['Total Debt (₹ Cr)', m.totalDebt, ...company.historicalYears.map((h) => h.totalDebt)],
      ['Total Equity / Net Worth (₹ Cr)', m.totalEquity, ...company.historicalYears.map((h) => h.totalEquity)],
      ['Debt-to-Equity Ratio', m.debtToEquityRatio, ...company.historicalYears.map((h) => h.debtToEquityRatio)],
      ['Current Ratio', m.currentRatio, ...company.historicalYears.map((h) => h.currentRatio)],
    ];

    const csvContent =
      'data:text/csv;charset=utf-8,' + rows.map((e) => e.join(',')).join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `${company.tickerNSE}_Audited_Financials.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6">
      {/* Top Navigation & Action Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4 bg-slate-900 border border-slate-800 rounded-2xl p-4 shadow-sm">
        <button
          onClick={onBack}
          className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white text-xs font-semibold transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Directory</span>
        </button>

        <div className="flex items-center gap-2">
          <button
            onClick={() => onCompareToggle(company)}
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-colors ${
              isCompared
                ? 'bg-amber-500 text-slate-950 hover:bg-amber-400'
                : 'bg-slate-800 hover:bg-slate-700 text-slate-200'
            }`}
          >
            <GitCompare className="w-3.5 h-3.5" />
            <span>{isCompared ? 'Remove from Compare' : '+ Compare Peer'}</span>
          </button>

          <button
            onClick={copySummary}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold transition-colors"
          >
            {copied ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-400" />
                <span className="text-emerald-400">Copied!</span>
              </>
            ) : (
              <>
                <Share2 className="w-3.5 h-3.5" />
                <span>Share Summary</span>
              </>
            )}
          </button>

          <button
            onClick={exportCSV}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold transition-colors shadow-sm"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export CSV</span>
          </button>
        </div>
      </div>

      {/* Company Master Header */}
      <div className="bg-gradient-to-br from-slate-900 via-slate-900 to-slate-950 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl pointer-events-none"></div>

        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 relative z-10">
          <div>
            <div className="flex flex-wrap items-center gap-2 mb-3">
              <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-blue-500/20 text-blue-400 border border-blue-500/30">
                {company.sector}
              </span>
              <span className="text-xs text-slate-400 font-mono">
                NSE: <strong className="text-white">{company.tickerNSE}</strong>
              </span>
              <span className="text-slate-600">•</span>
              <span className="text-xs text-slate-400 font-mono">
                BSE: <strong className="text-white">{company.tickerBSE}</strong>
              </span>
              <span className="text-slate-600">•</span>
              <span className="text-xs text-slate-400 font-mono">
                ISIN: {company.isin}
              </span>
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[11px] font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                <CheckCircle2 className="w-3 h-3" />
                Verified Audited Data
              </span>
            </div>

            <h1 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight">
              {company.name}
            </h1>

            <p className="mt-3 text-sm text-slate-300 max-w-3xl leading-relaxed">
              {company.summary}
            </p>

            <div className="mt-4 flex flex-wrap items-center gap-y-2 gap-x-6 text-xs text-slate-400">
              <div>
                Headquarters: <span className="text-slate-200 font-medium">{company.headquarters}</span>
              </div>
              <div>
                Founded: <span className="text-slate-200 font-medium">{company.founded}</span>
              </div>
              <div>
                Statutory Auditor: <span className="text-slate-200 font-medium">{company.auditor}</span>
              </div>
              <div>
                CIN: <span className="text-slate-200 font-mono">{company.cin}</span>
              </div>
            </div>
          </div>

          <div className="lg:text-right border-t lg:border-t-0 lg:border-l border-slate-800 pt-4 lg:pt-0 lg:pl-8 flex flex-row lg:flex-col justify-between items-start lg:items-end gap-3 min-w-[220px]">
            <div>
              <span className="text-xs text-slate-400 font-medium uppercase tracking-wider block font-mono">
                Market Capitalization
              </span>
              <span className="text-2xl sm:text-3xl font-extrabold font-mono text-emerald-400 tracking-tight">
                {formatCrores(company.marketCapCr)}
              </span>
            </div>

            <div className="bg-slate-800/80 border border-slate-700/60 rounded-xl p-3 text-left">
              <span className="text-[10px] text-slate-400 block font-mono uppercase">
                Filing Standard
              </span>
              <span className="text-xs text-slate-200 font-semibold block">
                {m.reportingPeriod}
              </span>
              <span className="text-[11px] text-slate-400 block font-mono mt-0.5">
                {m.fiscalYear}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* The 7 Core Requested Financial Metrics Grid */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <div className="w-2.5 h-2.5 rounded-full bg-blue-500"></div>
            <h2 className="text-lg font-bold text-white tracking-tight">
              Primary Financial Statements (Original Audited Numbers)
            </h2>
          </div>
          <span className="text-xs text-slate-400 font-mono">
            All amounts in Indian ₹ Crores
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {/* 1. Revenue */}
          <MetricCard
            label="1. Revenue from Operations"
            value={m.revenue}
            subValue="Total Top-line Income"
            changePercent={revGrowth}
            description="Total gross revenue generated from core business operations, sales of goods and rendered services as per audited P&L statement."
            iconType="revenue"
          />

          {/* 2. Operating Profit */}
          <MetricCard
            label="2. Operating Profit (EBITDA)"
            value={m.operatingProfit}
            subValue={`Operating Margin: ${m.operatingMarginPercent}%`}
            changePercent={opGrowth}
            description="Earnings before interest, taxes, depreciation, and amortization. Reflects fundamental operational profitability before financing structure."
            iconType="operating"
            badge={{
              text: `${m.operatingMarginPercent}% Margin`,
              color: 'bg-indigo-500/20 text-indigo-300 border-indigo-500/30',
            }}
          />

          {/* 3. Net Profit */}
          <MetricCard
            label="3. Net Profit (PAT)"
            value={m.netProfit}
            subValue={`Net Margin: ${m.netProfitMarginPercent}%`}
            changePercent={patGrowth}
            description="Profit After Tax (PAT) attributable to shareholders, after deduction of all operational costs, interest charges, depreciation, and corporate taxes."
            iconType="profit"
            badge={{
              text: `${m.netProfitMarginPercent}% PAT Margin`,
              color: m.netProfit >= 0
                ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30'
                : 'bg-rose-500/20 text-rose-300 border-rose-500/30',
            }}
          />

          {/* 4. Current Assets */}
          <MetricCard
            label="4. Current Assets"
            value={m.currentAssets}
            subValue="Short-Term Resources"
            description="Total assets reasonably expected to be converted to cash, sold, or consumed within one operating cycle or 12 months (cash, receivables, inventories)."
            iconType="assets"
          />

          {/* 5. Current Liabilities */}
          <MetricCard
            label="5. Current Liabilities"
            value={m.currentLiabilities}
            subValue="Short-Term Obligations"
            description="Total short-term obligations and payables due within 12 months (trade payables, short-term debt installments, operational provisions)."
            iconType="liabilities"
          />

          {/* 6. Total Debt */}
          <MetricCard
            label="6. Total Debt"
            value={m.totalDebt}
            subValue={m.totalDebt === 0 ? 'Zero Debt' : 'Borrowings & Obligations'}
            description="Total interest-bearing borrowings including long-term borrowings, short-term debt, working capital credit lines, and financial obligations."
            iconType="debt"
            badge={{
              text: m.totalDebt === 0 ? 'Zero Debt' : solvency.rating,
              color: solvency.badgeColor,
            }}
          />

          {/* 7. Total Equity */}
          <MetricCard
            label="7. Total Equity / Net Worth"
            value={m.totalEquity}
            subValue="Shareholders' Funds"
            description="Share capital plus retained reserves and surplus belonging to equity shareholders (Net Worth). Represents the ultimate book value cushion."
            iconType="equity"
          />

          {/* 8. Key Solvency Metric: Debt-to-Equity */}
          <MetricCard
            label="Debt-to-Equity Ratio"
            value={m.debtToEquityRatio ?? 0}
            isRatio={true}
            subValue={`Solvency: ${solvency.rating}`}
            description={solvency.description}
            iconType="ratio"
            badge={{
              text: solvency.rating,
              color: solvency.badgeColor,
            }}
          />
        </div>
      </div>

      {/* Derived Health Ratios & Balance Sheet Health Analysis */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Working Capital & Liquidity Breakdown */}
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-md">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Briefcase className="w-5 h-5 text-cyan-400" />
              <h3 className="text-base font-bold text-white">
                Working Capital &amp; Liquidity Profile
              </h3>
            </div>
            <span className={`text-xs px-2.5 py-1 rounded-full font-semibold border ${liquidity.badgeColor}`}>
              {liquidity.rating}
            </span>
          </div>

          <div className="space-y-4">
            <div className="p-4 rounded-2xl bg-slate-800/60 border border-slate-700/60 grid grid-cols-1 sm:grid-cols-2 gap-3 items-center">
              <div>
                <span className="text-[11px] text-slate-400 block font-mono">
                  Net Working Capital (Assets - Liab)
                </span>
                <span className="text-xl font-bold font-mono text-white">
                  {formatCrores(m.workingCapital ?? 0)}
                </span>
              </div>
              <div className="sm:text-right">
                <span className="text-[11px] text-slate-400 block font-mono">Current Ratio</span>
                <span className="text-xl font-bold font-mono text-cyan-400">
                  {m.currentRatio?.toFixed(2)}x
                </span>
              </div>
            </div>

            <div className="text-xs text-slate-300 leading-relaxed bg-slate-950/60 p-4 rounded-xl border border-slate-800/80">
              <strong className="text-white block mb-1">Financial Analysis:</strong>
              {liquidity.description} With Current Assets of{' '}
              <span className="text-cyan-400 font-mono">{formatCrores(m.currentAssets)}</span> versus Current Liabilities of{' '}
              <span className="text-amber-400 font-mono">{formatCrores(m.currentLiabilities)}</span>, the company maintains{' '}
              <span className="font-semibold">{m.currentRatio}x</span> current asset coverage.
            </div>

            {/* Visual ratio bar */}
            <div>
              <div className="flex justify-between text-xs font-mono text-slate-400 mb-1.5">
                <span>Current Assets: {formatCrores(m.currentAssets)}</span>
                <span>Current Liabilities: {formatCrores(m.currentLiabilities)}</span>
              </div>
              <div className="w-full bg-slate-800 h-3 rounded-full overflow-hidden flex">
                <div
                  className="bg-cyan-500 h-full"
                  style={{
                    width: `${Math.min(100, ((m.currentAssets) / (m.currentAssets + m.currentLiabilities || 1)) * 100)}%`,
                  }}
                  title="Current Assets"
                ></div>
                <div
                  className="bg-amber-500 h-full"
                  style={{
                    width: `${Math.min(100, ((m.currentLiabilities) / (m.currentAssets + m.currentLiabilities || 1)) * 100)}%`,
                  }}
                  title="Current Liabilities"
                ></div>
              </div>
            </div>
          </div>
        </div>

        {/* Debt vs Equity Capital Structure */}
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-md">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Scale className="w-5 h-5 text-teal-400" />
              <h3 className="text-base font-bold text-white">
                Capital Structure &amp; Solvency (Debt vs Equity)
              </h3>
            </div>
            <span className={`text-xs px-2.5 py-1 rounded-full font-semibold border ${solvency.badgeColor}`}>
              D/E: {m.debtToEquityRatio}x
            </span>
          </div>

          <div className="space-y-4">
            <div className="p-4 rounded-2xl bg-slate-800/60 border border-slate-700/60 flex items-center justify-between">
              <div>
                <span className="text-xs text-slate-400 block font-mono">
                  Shareholders' Equity (Net Worth)
                </span>
                <span className="text-xl font-bold font-mono text-teal-400">
                  {formatCrores(m.totalEquity)}
                </span>
              </div>
              <div className="text-right">
                <span className="text-xs text-slate-400 block font-mono">Total Borrowings</span>
                <span className="text-xl font-bold font-mono text-rose-400">
                  {formatCrores(m.totalDebt)}
                </span>
              </div>
            </div>

            <div className="text-xs text-slate-300 leading-relaxed bg-slate-950/60 p-4 rounded-xl border border-slate-800/80">
              <strong className="text-white block mb-1">Capital Structure Assessment:</strong>
              {solvency.description} Total debt of{' '}
              <span className="text-rose-400 font-mono">{formatCrores(m.totalDebt)}</span> against net worth of{' '}
              <span className="text-teal-400 font-mono">{formatCrores(m.totalEquity)}</span> results in a Debt/Equity ratio of{' '}
              <span className="font-semibold text-white">{m.debtToEquityRatio}</span>.
            </div>

            {/* Visual ratio bar */}
            <div>
              <div className="flex justify-between text-xs font-mono text-slate-400 mb-1.5">
                <span>Equity ({((m.totalEquity / (m.totalEquity + m.totalDebt || 1)) * 100).toFixed(0)}%)</span>
                <span>Debt ({((m.totalDebt / (m.totalEquity + m.totalDebt || 1)) * 100).toFixed(0)}%)</span>
              </div>
              <div className="w-full bg-slate-800 h-3 rounded-full overflow-hidden flex">
                <div
                  className="bg-teal-500 h-full"
                  style={{
                    width: `${Math.min(100, ((m.totalEquity) / (m.totalEquity + m.totalDebt || 1)) * 100)}%`,
                  }}
                  title="Shareholders' Equity"
                ></div>
                <div
                  className="bg-rose-500 h-full"
                  style={{
                    width: `${Math.min(100, ((m.totalDebt) / (m.totalEquity + m.totalDebt || 1)) * 100)}%`,
                  }}
                  title="Total Debt"
                ></div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Multi-Year Audited Financial History Table */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-md overflow-hidden">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-6">
          <div>
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Calendar className="w-5 h-5 text-indigo-400" />
              <span>Multi-Year Audited Financial Statements History</span>
            </h3>
            <p className="text-xs text-slate-400">
              Comparing latest year against previous audited statutory filings (All in ₹ Crores)
            </p>
          </div>
          <span className="text-xs font-mono px-3 py-1 bg-slate-800 text-slate-300 rounded-lg border border-slate-700/80">
            Source: {company.sourceFiling}
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-mono border-collapse">
            <thead>
              <tr className="border-b border-slate-800 bg-slate-950/60 text-slate-400 uppercase tracking-wider">
                <th className="py-3 px-4 font-semibold text-slate-300">Financial Metric</th>
                <th className="py-3 px-4 font-bold text-white bg-blue-950/20 border-l border-r border-blue-900/30">
                  {m.fiscalYear} (Latest Audited)
                </th>
                {company.historicalYears.map((h, idx) => (
                  <th key={idx} className="py-3 px-4 font-semibold text-slate-400">
                    {h.fiscalYear}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              <tr className="hover:bg-slate-800/40">
                <td className="py-3 px-4 text-slate-200 font-sans font-medium flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-blue-400"></span>
                  Revenue from Operations (₹ Cr)
                </td>
                <td className="py-3 px-4 font-bold text-white bg-blue-950/10 border-l border-r border-blue-900/30">
                  {formatCrores(m.revenue, true)}
                </td>
                {company.historicalYears.map((h, idx) => (
                  <td key={idx} className="py-3 px-4 text-slate-300">
                    {formatCrores(h.revenue, true)}
                  </td>
                ))}
              </tr>

              <tr className="hover:bg-slate-800/40">
                <td className="py-3 px-4 text-slate-200 font-sans font-medium flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-indigo-400"></span>
                  Operating Profit / EBITDA (₹ Cr)
                </td>
                <td className="py-3 px-4 font-bold text-indigo-300 bg-blue-950/10 border-l border-r border-blue-900/30">
                  {formatCrores(m.operatingProfit, true)} ({m.operatingMarginPercent}%)
                </td>
                {company.historicalYears.map((h, idx) => (
                  <td key={idx} className="py-3 px-4 text-slate-300">
                    {formatCrores(h.operatingProfit, true)} ({h.operatingMarginPercent}%)
                  </td>
                ))}
              </tr>

              <tr className="hover:bg-slate-800/40">
                <td className="py-3 px-4 text-slate-200 font-sans font-medium flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
                  Net Profit / PAT (₹ Cr)
                </td>
                <td className="py-3 px-4 font-bold text-emerald-400 bg-blue-950/10 border-l border-r border-blue-900/30">
                  {formatCrores(m.netProfit, true)} ({m.netProfitMarginPercent}%)
                </td>
                {company.historicalYears.map((h, idx) => (
                  <td key={idx} className="py-3 px-4 text-slate-300">
                    {formatCrores(h.netProfit, true)} ({h.netProfitMarginPercent}%)
                  </td>
                ))}
              </tr>

              <tr className="hover:bg-slate-800/40">
                <td className="py-3 px-4 text-slate-200 font-sans font-medium flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-cyan-400"></span>
                  Current Assets (₹ Cr)
                </td>
                <td className="py-3 px-4 font-bold text-cyan-300 bg-blue-950/10 border-l border-r border-blue-900/30">
                  {formatCrores(m.currentAssets, true)}
                </td>
                {company.historicalYears.map((h, idx) => (
                  <td key={idx} className="py-3 px-4 text-slate-300">
                    {formatCrores(h.currentAssets, true)}
                  </td>
                ))}
              </tr>

              <tr className="hover:bg-slate-800/40">
                <td className="py-3 px-4 text-slate-200 font-sans font-medium flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-amber-400"></span>
                  Current Liabilities (₹ Cr)
                </td>
                <td className="py-3 px-4 font-bold text-amber-300 bg-blue-950/10 border-l border-r border-blue-900/30">
                  {formatCrores(m.currentLiabilities, true)}
                </td>
                {company.historicalYears.map((h, idx) => (
                  <td key={idx} className="py-3 px-4 text-slate-300">
                    {formatCrores(h.currentLiabilities, true)}
                  </td>
                ))}
              </tr>

              <tr className="hover:bg-slate-800/40">
                <td className="py-3 px-4 text-slate-200 font-sans font-medium flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-rose-400"></span>
                  Total Debt (₹ Cr)
                </td>
                <td className="py-3 px-4 font-bold text-rose-300 bg-blue-950/10 border-l border-r border-blue-900/30">
                  {formatCrores(m.totalDebt, true)}
                </td>
                {company.historicalYears.map((h, idx) => (
                  <td key={idx} className="py-3 px-4 text-slate-300">
                    {formatCrores(h.totalDebt, true)}
                  </td>
                ))}
              </tr>

              <tr className="hover:bg-slate-800/40">
                <td className="py-3 px-4 text-slate-200 font-sans font-medium flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-teal-400"></span>
                  Total Equity / Net Worth (₹ Cr)
                </td>
                <td className="py-3 px-4 font-bold text-teal-300 bg-blue-950/10 border-l border-r border-blue-900/30">
                  {formatCrores(m.totalEquity, true)}
                </td>
                {company.historicalYears.map((h, idx) => (
                  <td key={idx} className="py-3 px-4 text-slate-300">
                    {formatCrores(h.totalEquity, true)}
                  </td>
                ))}
              </tr>

              <tr className="hover:bg-slate-800/40">
                <td className="py-3 px-4 text-slate-200 font-sans font-medium flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-purple-400"></span>
                  Debt-to-Equity Ratio
                </td>
                <td className="py-3 px-4 font-bold text-purple-300 bg-blue-950/10 border-l border-r border-blue-900/30">
                  {m.debtToEquityRatio}x
                </td>
                {company.historicalYears.map((h, idx) => (
                  <td key={idx} className="py-3 px-4 text-slate-300">
                    {h.debtToEquityRatio}x
                  </td>
                ))}
              </tr>

              <tr className="hover:bg-slate-800/40">
                <td className="py-3 px-4 text-slate-200 font-sans font-medium flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-sky-400"></span>
                  Current Ratio (Liquidity)
                </td>
                <td className="py-3 px-4 font-bold text-sky-300 bg-blue-950/10 border-l border-r border-blue-900/30">
                  {m.currentRatio}x
                </td>
                {company.historicalYears.map((h, idx) => (
                  <td key={idx} className="py-3 px-4 text-slate-300">
                    {h.currentRatio}x
                  </td>
                ))}
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Regulatory & Audit Verification Footer */}
      <div className="bg-slate-900/70 border border-slate-800 rounded-2xl p-4 text-xs text-slate-400 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-emerald-400" />
          <span>
            Data Authenticity Note: All figures correspond strictly to audited regulatory filings submitted to BSE Ltd and the National Stock Exchange of India (NSE).
          </span>
        </div>
        <div className="font-mono text-slate-400">
          Statutory Auditor: <strong className="text-slate-200">{company.auditor}</strong>
        </div>
      </div>
    </div>
  );
};
