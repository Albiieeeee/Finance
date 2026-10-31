import { SolvencyRating, LiquidityRating } from '../types/financials';

/**
 * Calculates Debt to Equity Ratio
 * Formula: Total Debt / Total Equity
 */
export function calcDebtToEquity(totalDebt: number, totalEquity: number): number {
  if (totalEquity <= 0) {
    return totalDebt > 0 ? 999.99 : 0;
  }
  return Number((totalDebt / totalEquity).toFixed(2));
}

/**
 * Calculates Current Ratio
 * Formula: Current Assets / Current Liabilities
 */
export function calcCurrentRatio(currentAssets: number, currentLiabilities: number): number {
  if (currentLiabilities <= 0) {
    return currentAssets > 0 ? 999.99 : 0;
  }
  return Number((currentAssets / currentLiabilities).toFixed(2));
}

/**
 * Calculates Working Capital
 * Formula: Current Assets - Current Liabilities
 */
export function calcWorkingCapital(currentAssets: number, currentLiabilities: number): number {
  return Number((currentAssets - currentLiabilities).toFixed(2));
}

/**
 * Calculates Operating Margin (%)
 * Formula: (Operating Profit / Revenue) * 100
 */
export function calcOperatingMargin(operatingProfit: number, revenue: number): number {
  if (revenue <= 0) return 0;
  return Number(((operatingProfit / revenue) * 100).toFixed(2));
}

/**
 * Calculates Net Profit Margin (%)
 * Formula: (Net Profit / Revenue) * 100
 */
export function calcNetProfitMargin(netProfit: number, revenue: number): number {
  if (revenue <= 0) return 0;
  return Number(((netProfit / revenue) * 100).toFixed(2));
}

/**
 * Calculates Return on Equity (ROE %)
 * Formula: (Net Profit / Total Equity) * 100
 */
export function calcROE(netProfit: number, totalEquity: number): number {
  if (totalEquity <= 0) return 0;
  return Number(((netProfit / totalEquity) * 100).toFixed(2));
}

/**
 * Determines Solvency health based on Debt to Equity
 */
export function getSolvencyRating(deRatio: number, isFinancialSector: boolean = false): SolvencyRating {
  if (isFinancialSector) {
    return {
      rating: 'Capital Structure N/A (Bank/NBFC)',
      badgeColor: 'bg-blue-100 text-blue-800 dark:bg-blue-950/60 dark:text-blue-300 border-blue-200 dark:border-blue-800',
      description: 'Banks and NBFCs operate on deposits and debt as primary business inventory. Capital Adequacy Ratio (CAR) is the primary solvency measure rather than standard D/E.',
    };
  }

  if (deRatio <= 0.1) {
    return {
      rating: 'Virtually Debt-Free',
      badgeColor: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800',
      description: 'Exceptional balance sheet strength with negligible or zero reliance on external debt.',
    };
  }
  if (deRatio <= 0.75) {
    return {
      rating: 'Healthy / Low Leverage',
      badgeColor: 'bg-teal-100 text-teal-800 dark:bg-teal-950/60 dark:text-teal-300 border-teal-200 dark:border-teal-800',
      description: 'Prudent debt usage well within safe interest-coverage and repayment capacities.',
    };
  }
  if (deRatio <= 1.5) {
    return {
      rating: 'Moderate Leverage',
      badgeColor: 'bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300 border-amber-200 dark:border-amber-800',
      description: 'Moderate leverage common in capital-intensive sectors (infrastructure, utilities, telecom, manufacturing).',
    };
  }
  return {
    rating: 'High Leverage',
    badgeColor: 'bg-rose-100 text-rose-800 dark:bg-rose-950/60 dark:text-rose-300 border-rose-200 dark:border-rose-800',
    description: 'Elevated debt relative to equity base. Requires monitoring of interest coverage and debt service capability.',
  };
}

/**
 * Determines Liquidity category based on Current Ratio
 */
export function getLiquidityRating(currentRatio: number, isFinancialSector: boolean = false): LiquidityRating {
  if (isFinancialSector) {
    return {
      rating: 'Banking Model (N/A)',
      badgeColor: 'bg-slate-100 text-slate-800 dark:bg-slate-800 dark:text-slate-300 border-slate-300 dark:border-slate-700',
      description: 'Standard current ratio is not applicable for banking institutions due to asset-liability mismatch liquidity frameworks (LCR/NSFR).',
    };
  }

  if (currentRatio >= 1.5) {
    return {
      rating: 'Very Strong',
      badgeColor: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800',
      description: 'Current assets cover short-term obligations by >1.5x with substantial safety cushion.',
    };
  }
  if (currentRatio >= 1.0) {
    return {
      rating: 'Adequate',
      badgeColor: 'bg-teal-100 text-teal-800 dark:bg-teal-950/60 dark:text-teal-300 border-teal-200 dark:border-teal-800',
      description: 'Current assets exceed current liabilities; working capital is positive.',
    };
  }
  return {
    rating: 'Tight',
    badgeColor: 'bg-rose-100 text-rose-800 dark:bg-rose-950/60 dark:text-rose-300 border-rose-200 dark:border-rose-800',
    description: 'Current liabilities exceed current assets (negative working capital). Fast cash-cycle FMCG companies or retailers may sustain this, but industrial firms may face liquidity pressure.',
  };
}

/**
 * Formats amount in Crores to Indian numbering format
 * e.g. 1000000 -> "₹10,00,000 Cr" or "₹10.00 Lakh Cr"
 */
export function formatCrores(amountCr: number, formatFull: boolean = false): string {
  if (isNaN(amountCr)) return '₹0 Cr';
  
  const abs = Math.abs(amountCr);
  const sign = amountCr < 0 ? '-' : '';

  if (!formatFull && abs >= 100000) {
    const lakhCr = abs / 100000;
    return `${sign}₹${lakhCr.toFixed(2)} Lakh Cr`;
  }

  // Format with Indian comma grouping: e.g. 1,23,456.78
  const parts = abs.toFixed(0).split('.');
  let lastThree = parts[0].substring(parts[0].length - 3);
  const otherNumbers = parts[0].substring(0, parts[0].length - 3);
  if (otherNumbers !== '') {
    lastThree = ',' + lastThree;
  }
  const formatted = otherNumbers.replace(/\B(?=(\d{2})+(?!\d))/g, ',') + lastThree;

  return `${sign}₹${formatted} Cr`;
}

/**
 * Standard percentage formatter
 */
export function formatPercent(value: number): string {
  if (isNaN(value)) return '0.00%';
  const sign = value > 0 ? '+' : '';
  return `${sign}${value.toFixed(2)}%`;
}
