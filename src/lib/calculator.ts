import type { MarketOption, CalculationResult } from '@/types/mandilog';

/**
 * Calculates net return comparison across various mandi / market options.
 *
 * Formula:
 * - grossRevenue = quantity * pricePerUnit
 * - transportCost = distanceKm * transportRatePerKm
 * - spoilageCost = grossRevenue * (spoilageRatePercent / 100)
 * - netProceeds = grossRevenue - transportCost - spoilageCost
 * - isRecommended is set to true for the market with the highest netProceeds.
 */
export function calculateNetReturns(
  quantity: number,
  markets: MarketOption[]
): CalculationResult[] {
  if (!markets || markets.length === 0) {
    return [];
  }

  const results: CalculationResult[] = markets.map((market) => {
    const grossRevenue = quantity * market.pricePerUnit;
    const transportCost = market.distanceKm * market.transportRatePerKm;
    const spoilageCost = grossRevenue * (market.spoilageRatePercent / 100);
    const netProceeds = grossRevenue - transportCost - spoilageCost;

    return {
      marketName: market.marketName,
      grossRevenue: Number(grossRevenue.toFixed(2)),
      transportCost: Number(transportCost.toFixed(2)),
      spoilageCost: Number(spoilageCost.toFixed(2)),
      netProceeds: Number(netProceeds.toFixed(2)),
      isRecommended: false,
    };
  });

  let maxNetProceeds = -Infinity;
  for (const item of results) {
    if (item.netProceeds > maxNetProceeds) {
      maxNetProceeds = item.netProceeds;
    }
  }

  // Set isRecommended to true for the market with the highest netProceeds
  return results.map((item) => ({
    ...item,
    isRecommended: item.netProceeds === maxNetProceeds,
  }));
}
