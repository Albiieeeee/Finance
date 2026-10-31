import test from 'node:test';
import assert from 'node:assert/strict';
import {
  calcDebtToEquity,
  calcCurrentRatio,
  calcWorkingCapital,
  calcOperatingMargin,
  calcNetProfitMargin,
  calcROE,
  getSolvencyRating,
  getLiquidityRating,
  formatCrores,
  formatPercent,
} from './financialCalculations';

test('calcDebtToEquity computes ratio accurately and handles edge cases', () => {
  // Reliance FY24: Debt ~3,24,622 Cr, Equity ~7,93,710 Cr => 0.41
  assert.equal(calcDebtToEquity(324622, 793710), 0.41);
  // Zero debt (TCS)
  assert.equal(calcDebtToEquity(0, 90127), 0);
  // Negative equity edge case
  assert.equal(calcDebtToEquity(100, -50), 999.99);
});

test('calcCurrentRatio computes asset/liability coverage accurately', () => {
  // TCS FY24: Current Assets 103,115 Cr, Current Liabilities 42,427 Cr => 2.43
  assert.equal(calcCurrentRatio(103115, 42427), 2.43);
  // Zero liabilities
  assert.equal(calcCurrentRatio(100, 0), 999.99);
});

test('calcWorkingCapital computes difference correctly', () => {
  assert.equal(calcWorkingCapital(150000, 100000), 50000);
  assert.equal(calcWorkingCapital(50000, 75000), -25000);
});

test('calcOperatingMargin and calcNetProfitMargin calculate correct percentages', () => {
  // Revenue 1000, OpProfit 250 => 25%
  assert.equal(calcOperatingMargin(250, 1000), 25);
  // Revenue 1000, NetProfit 150 => 15%
  assert.equal(calcNetProfitMargin(150, 1000), 15);
  // Zero revenue safety
  assert.equal(calcOperatingMargin(100, 0), 0);
  assert.equal(calcNetProfitMargin(100, 0), 0);
});

test('calcROE calculates return on shareholders equity', () => {
  assert.equal(calcROE(46099, 90127), 51.15);
  assert.equal(calcROE(100, 0), 0);
});

test('getSolvencyRating categorizes D/E thresholds correctly', () => {
  assert.equal(getSolvencyRating(0.02, false).rating, 'Virtually Debt-Free');
  assert.equal(getSolvencyRating(0.41, false).rating, 'Healthy / Low Leverage');
  assert.equal(getSolvencyRating(1.2, false).rating, 'Moderate Leverage');
  assert.equal(getSolvencyRating(2.5, false).rating, 'High Leverage');
  assert.equal(getSolvencyRating(6.5, true).rating, 'Capital Structure N/A (Bank/NBFC)');
});

test('getLiquidityRating categorizes Current Ratio correctly', () => {
  assert.equal(getLiquidityRating(2.4, false).rating, 'Very Strong');
  assert.equal(getLiquidityRating(1.1, false).rating, 'Adequate');
  assert.equal(getLiquidityRating(0.8, false).rating, 'Tight');
  assert.equal(getLiquidityRating(0.5, true).rating, 'Banking Model (N/A)');
});

test('formatCrores formats Indian currency with Cr and Lakh Cr correctly', () => {
  assert.equal(formatCrores(1000000), '₹10.00 Lakh Cr');
  assert.equal(formatCrores(900000), '₹9.00 Lakh Cr');
  assert.equal(formatCrores(45000, true), '₹45,000 Cr');
  assert.equal(formatCrores(123456, true), '₹1,23,456 Cr');
});

test('formatPercent formats values with signs', () => {
  assert.equal(formatPercent(15.4), '+15.40%');
  assert.equal(formatPercent(-3.2), '-3.20%');
});
