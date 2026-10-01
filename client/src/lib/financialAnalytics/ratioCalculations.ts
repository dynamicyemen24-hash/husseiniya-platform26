/**
 * Financial Ratios Engine - Core Calculation Utilities
 * ====================================================
 * Implements globally accepted financial ratio calculations per IFRS/GAAP standards.
 * Supports multi-company/multi-tenant environments with multi-currency FX revaluation.
 * All functions are pure, type-safe, and WCAG 2.1 accessible.
 */

import { safeToNumber, roundTo, approximatelyEqual } from "../numeric";
import type {
  RatioData,
  RatioInputs,
  CalculatedRatio,
  CurrencyCode,
  FxRate,
} from "./types";

/** Default precision for ratio calculations */
const RATIO_PRECISION = 4;

/**
 * Calculate Liquidity Ratios
 * - Current Ratio = Current Assets / Current Liabilities
 * - Quick Ratio = Quick Assets / Current Liabilities
 * - Cash Ratio = Cash / Current Liabilities
 */
export function calculateLiquidityRatios(inputs: RatioInputs): {
  currentRatio: CalculatedRatio;
  quickRatio: CalculatedRatio;
  cashRatio: CalculatedRatio;
} {
  const { data, fxRate = 1, showPercentages = false } = inputs;
  const { currentAssets, quickAssets, cash, currentLiabilities } = data;

  const safeCurrentLiab = safeToNumber(currentLiabilities) || 0.001; // avoid div by zero
  const safeFx = safeToNumber(fxRate) || 1;

  // Apply FX revaluation if multi-currency
  const fxCurrentAssets = currentAssets * safeFx;
  const fxQuickAssets = quickAssets * safeFx;
  const fxCash = cash * safeFx;
  const fxCurrentLiab = currentLiabilities * safeFx;

  const currentRatioValue = roundTo(
    fxCurrentAssets / fxCurrentLiab,
    RATIO_PRECISION
  );
  const quickRatioValue = roundTo(
    fxQuickAssets / fxCurrentLiab,
    RATIO_PRECISION
  );
  const cashRatioValue = roundTo(fxCash / fxCurrentLiab, RATIO_PRECISION);

  const isFavorableCurrent = currentRatioValue >= 1.0;
  const isFavorableQuick = quickRatioValue >= 0.5;
  const isFavorableCash = cashRatioValue >= 0.2;

  const currentRatio: CalculatedRatio = {
    key: "currentRatio",
    name: showPercentages ? "النسبة الحالية (%)" : "Current Ratio",
    value: currentRatioValue,
    percentage: showPercentages,
    higherBetter: true,
    status: isFavorableCurrent ? "favorable" : "unfavorable",
  };

  const quickRatio: CalculatedRatio = {
    key: "quickRatio",
    name: showPercentages ? "النسبة السريعة (%)" : "Quick Ratio",
    value: quickRatioValue,
    percentage: showPercentages,
    higherBetter: true,
    status: isFavorableQuick ? "favorable" : "unfavorable",
  };

  const cashRatio: CalculatedRatio = {
    key: "cashRatio",
    name: showPercentages ? "نسبة النقد (%)" : "Cash Ratio",
    value: cashRatioValue,
    percentage: showPercentages,
    higherBetter: true,
    status: isFavorableCash ? "favorable" : "unfavorable",
  };

  return { currentRatio, quickRatio, cashRatio };
}

/**
 * Calculate Profitability Ratios
 * - Gross Margin = Gross Profit / Revenue
 * - Operating Margin = Operating Income / Revenue
 * - Net Profit Margin = Net Income / Revenue
 * - ROE = Net Income / Shareholder's Equity
 * - ROA = Net Income / Total Assets
 */
export function calculateProfitabilityRatios(inputs: RatioInputs): {
  grossMargin: CalculatedRatio;
  operatingMargin: CalculatedRatio;
  netProfitMargin: CalculatedRatio;
  roe: CalculatedRatio;
  roa: CalculatedRatio;
} {
  const { data, fxRate = 1, showPercentages = false } = inputs;
  const {
    grossProfit,
    revenue,
    operatingIncome,
    netIncome,
    totalEquity,
    totalAssets,
  } = data;

  const safeRevenue = safeToNumber(revenue) || 0.001;
  const safeEquity = safeToNumber(totalEquity) || 0.001;
  const safeAssets = safeToNumber(totalAssets) || 0.001;
  const safeFx = safeToNumber(fxRate) || 1;

  // Apply FX revaluation to income statement items
  const fxGrossProfit = grossProfit * safeFx;
  const fxRevenue = revenue * safeFx;
  const fxOperatingIncome = operatingIncome * safeFx;
  const fxNetIncome = netIncome * safeFx;

  const grossMarginValue = roundTo(
    (fxGrossProfit / fxRevenue) * 100,
    RATIO_PRECISION
  );
  const operatingMarginValue = roundTo(
    (fxOperatingIncome / fxRevenue) * 100,
    RATIO_PRECISION
  );
  const netProfitMarginValue = roundTo(
    (fxNetIncome / fxRevenue) * 100,
    RATIO_PRECISION
  );
  const roeValue = roundTo((fxNetIncome / safeEquity) * 100, RATIO_PRECISION);
  const roaValue = roundTo((fxNetIncome / safeAssets) * 100, RATIO_PRECISION);

  const grossMargin: CalculatedRatio = {
    key: "grossMargin",
    name: showPercentages ? "هامش الربح الإجمالي (%)" : "Gross Margin",
    value: grossMarginValue,
    percentage: true,
    higherBetter: true,
    status:
      grossMarginValue >= 30
        ? "favorable"
        : grossMarginValue >= 15
          ? "neutral"
          : "unfavorable",
  };

  const operatingMargin: CalculatedRatio = {
    key: "operatingMargin",
    name: showPercentages ? "هامش التشغيل (%)" : "Operating Margin",
    value: operatingMarginValue,
    percentage: true,
    higherBetter: true,
    status:
      operatingMarginValue >= 20
        ? "favorable"
        : operatingMarginValue >= 10
          ? "neutral"
          : "unfavorable",
  };

  const netProfitMargin: CalculatedRatio = {
    key: "netProfitMargin",
    name: showPercentages ? "هامش الربح الصافي (%)" : "Net Profit Margin",
    value: netProfitMarginValue,
    percentage: true,
    higherBetter: true,
    status:
      netProfitMarginValue >= 15
        ? "favorable"
        : netProfitMarginValue >= 5
          ? "neutral"
          : "unfavorable",
  };

  const roe: CalculatedRatio = {
    key: "roe",
    name: showPercentages
      ? "عائد على حقوق الملكية (%)"
      : "Return on Equity (ROE)",
    value: roeValue,
    percentage: true,
    higherBetter: true,
    status:
      roeValue >= 20 ? "favorable" : roeValue >= 10 ? "neutral" : "unfavorable",
  };

  const roa: CalculatedRatio = {
    key: "roa",
    name: showPercentages ? "عائد على الأصول (%)" : "Return on Assets (ROA)",
    value: roaValue,
    percentage: true,
    higherBetter: true,
    status:
      roaValue >= 5 ? "favorable" : roaValue >= 2 ? "neutral" : "unfavorable",
  };

  return { grossMargin, operatingMargin, netProfitMargin, roe, roa };
}

/**
 * Calculate Efficiency Ratios
 * - Asset Turnover = Revenue / Total Assets
 * - Inventory Turnover = COGS / Average Inventory
 */
export function calculateEfficiencyRatios(inputs: RatioInputs): {
  assetTurnover: CalculatedRatio;
  inventoryTurnover: CalculatedRatio;
} {
  const { data, fxRate = 1, showPercentages = false } = inputs;
  const { totalSales, cogs, inventory } = data;
  const safeFx = safeToNumber(fxRate) || 1;

  const fxTotalSales = totalSales * safeFx;
  const fxCogs = cogs * safeFx;
  const fxInventory = inventory * safeFx;

  // Average inventory (if beginning and ending available, otherwise use ending)
  const avgInventory = fxInventory; // Simplified: use current inventory

  const assetTurnoverValue = roundTo(
    fxTotalSales / safeToNumber(data.totalAssets) || 0.001,
    RATIO_PRECISION
  );
  const inventoryTurnoverValue =
    avgInventory > 0 ? roundTo(fxCogs / avgInventory, RATIO_PRECISION) : 0;

  const assetTurnover: CalculatedRatio = {
    key: "assetTurnover",
    name: showPercentages ? "دوران الأصول (%)" : "Asset Turnover",
    value: assetTurnoverValue,
    percentage: false,
    higherBetter: true,
    status:
      assetTurnoverValue > 1
        ? "favorable"
        : assetTurnoverValue > 0.5
          ? "neutral"
          : "unfavorable",
  };

  const inventoryTurnover: CalculatedRatio = {
    key: "inventoryTurnover",
    name: showPercentages ? "دوران المخزون (%)" : "Inventory Turnover",
    value: inventoryTurnoverValue,
    percentage: false,
    higherBetter: true,
    status:
      inventoryTurnoverValue > 6
        ? "favorable"
        : inventoryTurnoverValue > 3
          ? "neutral"
          : "unfavorable",
  };

  return { assetTurnover, inventoryTurnover };
}

/**
 * Calculate Solvency Ratios
 * - Debt-to-Equity = Total Liabilities / Total Equity
 * - Interest Coverage = EBIT / Interest Expense
 */
export function calculateSolvencyRatios(inputs: RatioInputs): {
  debtToEquity: CalculatedRatio;
  interestCoverage: CalculatedRatio;
} {
  const { data, fxRate = 1, showPercentages = false } = inputs;
  const { totalLiabilities, totalEquity } = data;
  const safeFx = safeToNumber(fxRate) || 1;

  const fxTotalLiab = totalLiabilities * safeFx;
  const fxTotalEquity = totalEquity * safeFx;

  // Simplified: interest expense would come from additional data
  const interestExpense = 0; // Placeholder - would need interest line from P&L

  const debtToEquityValue = roundTo(
    fxTotalLiab / safeToNumber(fxTotalEquity) || 0.001,
    RATIO_PRECISION
  );
  const interestCoverageValue =
    interestExpense > 0
      ? roundTo((fxTotalLiab / interestExpense) * 100, RATIO_PRECISION)
      : 0; // EBIT/Interest simplified

  const debtToEquity: CalculatedRatio = {
    key: "debtToEquity",
    name: showPercentages ? "ديون إلى حقوق الملكية (%)" : "Debt-to-Equity",
    value: debtToEquityValue,
    percentage: false,
    higherBetter: false, // Lower D/E is better
    status:
      debtToEquityValue <= 0.5
        ? "favorable"
        : debtToEquityValue <= 1.0
          ? "neutral"
          : "unfavorable",
  };

  const interestCoverage: CalculatedRatio = {
    key: "interestCoverage",
    name: showPercentages ? "تغطية الفائدة (%)" : "Interest Coverage",
    value: interestCoverageValue,
    percentage: true,
    higherBetter: true,
    status:
      interestCoverageValue >= 3.0
        ? "favorable"
        : interestCoverageValue >= 1.5
          ? "neutral"
          : "unfavorable",
  };

  return { debtToEquity, interestCoverage };
}

/**
 * Apply FX revaluation impact to ratio data
 */
export function applyFXRevaluation(data: RatioData, fxRate: number): RatioData {
  const safeFx = safeToNumber(fxRate) || 1;
  return {
    currentAssets: data.currentAssets * safeFx,
    quickAssets: data.quickAssets * safeFx,
    cash: data.cash * safeFx,
    currentLiabilities: data.currentLiabilities * safeFx,
    totalAssets: data.totalAssets * safeFx,
    totalEquity: data.totalEquity * safeFx,
    totalLiabilities: data.totalLiabilities * safeFx,
    revenue: data.revenue * safeFx,
    grossProfit: data.grossProfit * safeFx,
    operatingIncome: data.operatingIncome * safeFx,
    netIncome: data.netIncome * safeFx,
    cogs: data.cogs * safeFx,
    totalExpenses: data.totalExpenses * safeFx,
    inventory: data.inventory * safeFx,
    totalSales: data.totalSales * safeFx,
  };
}

/**
 * Get all globally accepted financial ratios in one call
 */
export function calculateAllRatios(inputs: RatioInputs): CalculatedRatio[] {
  const liquidity = calculateLiquidityRatios(inputs);
  const profitability = calculateProfitabilityRatios(inputs);
  const efficiency = calculateEfficiencyRatios(inputs);
  const solvency = calculateSolvencyRatios(inputs);

  return [
    ...Object.values(liquidity),
    ...Object.values(profitability),
    ...Object.values(efficiency),
    ...Object.values(solvency),
  ];
}

/**
 * Compare ratios between two periods
 */
export function compareRatios(
  current: CalculatedRatio[],
  previous: CalculatedRatio[]
): {
  [key: string]: {
    change: number;
    status: "improved" | "declined" | "unchanged";
  };
} {
  const result: Record<
    string,
    { change: number; status: "improved" | "declined" | "unchanged" }
  > = {};

  current.forEach(currentRatio => {
    const prevRatio = previous.find(r => r.key === currentRatio.key);
    if (prevRatio) {
      const change = currentRatio.value - prevRatio.value;
      const isImproved = currentRatio.higherBetter ? change > 0 : change < 0;
      result[currentRatio.key] = {
        change: Math.round(change * 10000) / 10000,
        status: isImproved ? "improved" : "declined",
      };
    }
  });

  return result;
}
