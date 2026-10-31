export interface FinancialYearData {
  fiscalYear: string; // e.g. "FY 2023-24", "FY 2022-23"
  reportingPeriod: string; // "Annual Audited (Consolidated)"
  revenue: number; // in ₹ Crores (Revenue from Operations / Total Income)
  operatingProfit: number; // in ₹ Crores (EBITDA / Operating Profit before tax & finance cost)
  netProfit: number; // in ₹ Crores (PAT - Profit After Tax)
  currentAssets: number; // in ₹ Crores
  currentLiabilities: number; // in ₹ Crores
  totalDebt: number; // in ₹ Crores (Long-term + Short-term borrowings)
  totalEquity: number; // in ₹ Crores (Total Equity / Net Worth / Shareholders' funds)
  cashAndEquivalents?: number; // in ₹ Crores
  operatingMarginPercent?: number; // %
  netProfitMarginPercent?: number; // %
  debtToEquityRatio?: number;
  currentRatio?: number;
  workingCapital?: number; // in ₹ Crores
}

export interface CompanyData {
  id: string;
  name: string;
  tickerNSE: string;
  tickerBSE: string;
  isin: string;
  sector: SectorCategory;
  industry: string;
  headquarters: string;
  founded: number;
  marketCapCr: number; // Market Capitalization in ₹ Crores
  cin: string;
  summary: string;
  auditor: string;
  sourceFiling: string;
  latestMetrics: FinancialYearData;
  historicalYears: FinancialYearData[]; // typically FY24, FY23, FY22
  isVerifiedRealData: boolean;
}

export type SectorCategory =
  | 'IT & Technology'
  | 'Banking & Financials'
  | 'Energy, Oil & Power'
  | 'Automobile & Mobility'
  | 'FMCG & Consumer Retail'
  | 'Pharmaceuticals & Healthcare'
  | 'Infrastructure, Metals & Materials'
  | 'Telecom & Services';

export interface SolvencyRating {
  rating: 'Virtually Debt-Free' | 'Healthy / Low Leverage' | 'Moderate Leverage' | 'High Leverage' | 'Capital Structure N/A (Bank/NBFC)';
  badgeColor: string;
  description: string;
}

export interface LiquidityRating {
  rating: 'Very Strong' | 'Adequate' | 'Tight' | 'Banking Model (N/A)';
  badgeColor: string;
  description: string;
}
