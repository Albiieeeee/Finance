/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { ALL_COMPANIES } from './data/indianCompaniesData';
import { CompanyData } from './types/financials';
import { Header } from './components/Header';
import { CompanyDirectory } from './components/CompanyDirectory';
import { FinancialScreener } from './components/FinancialScreener';
import { CompanyComparisonView } from './components/CompanyComparisonView';
import { CompanyDetailView } from './components/CompanyDetailView';
import { MetricGuideView } from './components/MetricGuideView';
import { LiveCompanySearchModal } from './components/LiveCompanySearchModal';
import {
  GitCompare,
  ArrowRight,
  ShieldCheck,
  Building2,
  Sparkles,
  ExternalLink,
} from 'lucide-react';

export default function App() {
  const [companies, setCompanies] = useState<CompanyData[]>(ALL_COMPANIES);
  const [activeTab, setActiveTab] = useState<'directory' | 'screener' | 'compare' | 'live-search' | 'guide'>('directory');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCompany, setSelectedCompany] = useState<CompanyData | null>(null);
  const [comparedCompanies, setComparedCompanies] = useState<CompanyData[]>([]);
  const [isLiveSearchOpen, setIsLiveSearchOpen] = useState(false);

  // Toggle company in comparison matrix
  const handleCompareToggle = (company: CompanyData) => {
    setComparedCompanies((prev) => {
      const exists = prev.some((c) => c.id === company.id);
      if (exists) {
        return prev.filter((c) => c.id !== company.id);
      } else {
        if (prev.length >= 4) {
          alert('You can compare up to 4 companies simultaneously.');
          return prev;
        }
        return [...prev, company];
      }
    });
  };

  const handleSelectCompany = (company: CompanyData) => {
    setSelectedCompany(company);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleAddAndOpenCompany = (company: CompanyData) => {
    // Add to companies list if not already present
    setCompanies((prev) => {
      if (!prev.some((c) => c.id === company.id)) {
        return [company, ...prev];
      }
      return prev;
    });
    setSelectedCompany(company);
    setActiveTab('directory');
  };

  const comparedIds = comparedCompanies.map((c) => c.id);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-blue-500 selection:text-white">
      {/* Main Navigation Header */}
      <Header
        activeTab={activeTab}
        setActiveTab={(tab) => {
          setSelectedCompany(null);
          setActiveTab(tab);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        searchQuery={searchQuery}
        setSearchQuery={(q) => {
          setSearchQuery(q);
          if (selectedCompany) setSelectedCompany(null);
          if (activeTab !== 'directory' && activeTab !== 'screener') {
            setActiveTab('directory');
          }
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        selectedCount={comparedCompanies.length}
        openCompare={() => {
          setSelectedCompany(null);
          setActiveTab('compare');
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        openLiveSearch={() => setIsLiveSearchOpen(true)}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* If a company is selected for deep dossier view */}
        {selectedCompany ? (
          <CompanyDetailView
            company={selectedCompany}
            onBack={() => setSelectedCompany(null)}
            onCompareToggle={handleCompareToggle}
            isCompared={comparedIds.includes(selectedCompany.id)}
          />
        ) : (
          <>
            {activeTab === 'directory' && (
              <CompanyDirectory
                companies={companies}
                onSelectCompany={handleSelectCompany}
                onCompareToggle={handleCompareToggle}
                comparedIds={comparedIds}
                searchQuery={searchQuery}
                openLiveSearch={() => setIsLiveSearchOpen(true)}
                onOpenScreener={() => setActiveTab('screener')}
              />
            )}

            {activeTab === 'screener' && (
              <FinancialScreener
                companies={companies}
                onSelectCompany={handleSelectCompany}
                onCompareToggle={handleCompareToggle}
                comparedIds={comparedIds}
                openLiveSearch={() => setIsLiveSearchOpen(true)}
              />
            )}

            {activeTab === 'compare' && (
              <CompanyComparisonView
                companies={comparedCompanies}
                onRemove={(id) =>
                  setComparedCompanies((prev) => prev.filter((c) => c.id !== id))
                }
                onClear={() => setComparedCompanies([])}
                onSelectCompany={handleSelectCompany}
                allCompanies={companies}
                onAddCompany={(c) => {
                  if (comparedCompanies.length < 4) {
                    setComparedCompanies((prev) => [...prev, c]);
                  } else {
                    alert('You can compare up to 4 companies at once.');
                  }
                }}
              />
            )}

            {activeTab === 'guide' && (
              <MetricGuideView
                onExploreScreener={() => setActiveTab('screener')}
              />
            )}
          </>
        )}
      </main>

      {/* Floating Compare Action Bar if items selected & not currently in compare tab */}
      {comparedCompanies.length > 0 && activeTab !== 'compare' && !selectedCompany && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-40 bg-slate-900/95 backdrop-blur-md border border-slate-700/80 px-5 py-3 rounded-2xl shadow-2xl flex items-center gap-4 text-xs">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse"></span>
            <span className="font-semibold text-white">
              {comparedCompanies.length} {comparedCompanies.length === 1 ? 'Company' : 'Companies'} in Comparison
            </span>
          </div>

          <div className="flex items-center gap-1.5 max-w-xs overflow-hidden">
            {comparedCompanies.map((c) => (
              <span
                key={c.id}
                className="px-2 py-0.5 rounded bg-slate-800 text-slate-300 font-mono text-[11px] border border-slate-700"
              >
                {c.tickerNSE}
              </span>
            ))}
          </div>

          <button
            onClick={() => setActiveTab('compare')}
            className="px-3.5 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold flex items-center gap-1.5 transition-colors shadow-md"
          >
            <span>Compare Now</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* Live AI Search Modal */}
      <LiveCompanySearchModal
        isOpen={isLiveSearchOpen}
        onClose={() => setIsLiveSearchOpen(false)}
        onAddAndOpenCompany={handleAddAndOpenCompany}
      />

      {/* Comprehensive Financial Disclosure Footer */}
      <footer className="bg-slate-900 border-t border-slate-800 py-8 text-xs text-slate-400 mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-4">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-lg bg-blue-600 flex items-center justify-center text-white">
                <Building2 className="w-3.5 h-3.5" />
              </div>
              <span className="font-bold text-white tracking-tight">
                IndiaCorp Financials
              </span>
              <span className="text-slate-600">•</span>
              <span>Authentic Corporate Balance Sheet &amp; P&amp;L Intelligence</span>
            </div>

            <div className="flex items-center gap-4 text-xs font-mono">
              <span className="text-emerald-400 flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5" />
                Audited Ind AS Regulatory Filings
              </span>
              <span className="text-slate-600">•</span>
              <span>BSE / NSE Statutory Disclosures</span>
            </div>
          </div>

          <div className="pt-4 border-t border-slate-800/80 text-[11px] text-slate-400 leading-relaxed flex flex-col md:flex-row justify-between gap-3">
            <p className="max-w-3xl">
              Disclaimer: All financial statement figures presented (Revenue from Operations, Operating Profit/EBITDA, Net Profit/PAT, Current Assets, Current Liabilities, Total Debt, and Shareholders' Equity) are extracted from official audited consolidated annual reports and regulatory filings submitted by companies to BSE Ltd and the National Stock Exchange of India (NSE). Intended strictly for educational, analytical, and corporate research purposes.
            </p>
            <p className="shrink-0 font-mono text-slate-400">
              Amounts in ₹ Crores (INR)
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
