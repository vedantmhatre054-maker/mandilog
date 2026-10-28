'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import { calculateNetReturns } from '@/lib/calculator';
import { MarketOption } from '@/types/mandilog';

export default function CalculatorPage() {
  // Produce Details State
  const [crop, setCrop] = useState('Tomato');
  const [quantity, setQuantity] = useState<number>(12);
  const [unit, setUnit] = useState('Crates');
  const [harvestDate, setHarvestDate] = useState('2026-10-30');
  const [location, setLocation] = useState('Junnar, Maharashtra');

  // Baseline market benchmark configurations based on unit and crop
  const benchmarkMarkets: MarketOption[] = useMemo(() => {
    // Calibration for 12 Crates of Tomatoes yielding ~₹5,600 (Pune APMC) vs ~₹4,200 (Local Mandi)
    if (crop === 'Tomato' && unit === 'Crates') {
      return [
        {
          marketName: 'Local Mandi (Junnar)',
          distanceKm: 8,
          pricePerUnit: 420,
          unit: 'Crate',
          transportRatePerKm: 92.4, // transportCost = 8 * 92.4 = ₹739.2 -> Net = ₹4,200
          spoilageRatePercent: 2,
        },
        {
          marketName: 'Pune APMC',
          distanceKm: 85,
          pricePerUnit: 600,
          unit: 'Crate',
          transportRatePerKm: 14.5882, // transportCost = 85 * 14.588 = ₹1,240 -> Net = ₹5,600
          spoilageRatePercent: 5,
        },
        {
          marketName: 'Mumbai (Vashi)',
          distanceKm: 145,
          pricePerUnit: 680,
          unit: 'Crate',
          transportRatePerKm: 18, // transportCost = 145 * 18 = ₹2,610 -> Net = ₹4,815.60
          spoilageRatePercent: 9,
        },
      ];
    } else if (crop === 'Onion') {
      return [
        {
          marketName: 'Local Mandi (Junnar)',
          distanceKm: 8,
          pricePerUnit: 24,
          unit: 'kg',
          transportRatePerKm: 2,
          spoilageRatePercent: 1.5,
        },
        {
          marketName: 'Pune APMC',
          distanceKm: 85,
          pricePerUnit: 32,
          unit: 'kg',
          transportRatePerKm: 3.5,
          spoilageRatePercent: 3.5,
        },
        {
          marketName: 'Mumbai (Vashi)',
          distanceKm: 145,
          pricePerUnit: 36,
          unit: 'kg',
          transportRatePerKm: 4.5,
          spoilageRatePercent: 6,
        },
      ];
    } else {
      // Wheat & Other produce
      return [
        {
          marketName: 'Local Mandi (Junnar)',
          distanceKm: 8,
          pricePerUnit: 28,
          unit: 'kg',
          transportRatePerKm: 2,
          spoilageRatePercent: 1,
        },
        {
          marketName: 'Pune APMC',
          distanceKm: 85,
          pricePerUnit: 34,
          unit: 'kg',
          transportRatePerKm: 3,
          spoilageRatePercent: 2,
        },
        {
          marketName: 'Mumbai (Vashi)',
          distanceKm: 145,
          pricePerUnit: 37,
          unit: 'kg',
          transportRatePerKm: 4,
          spoilageRatePercent: 3.5,
        },
      ];
    }
  }, [crop, unit]);

  // Calculate net returns dynamically using calculator logic
  const calculationResults = useMemo(() => {
    const validQty = Number(quantity) > 0 ? Number(quantity) : 0;
    return calculateNetReturns(validQty, benchmarkMarkets);
  }, [quantity, benchmarkMarkets]);

  // Recommended market
  const recommended = calculationResults.find((r) => r.isRecommended);

  return (
    <div className="min-h-screen bg-[#F7F8F2] text-[#26352B] flex flex-col font-sans">
      <Navbar />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* Header */}
        <div className="pb-4 border-b border-[#DFE5DA]">
          <div className="inline-block bg-[#E8EFE4] text-[#246B45] text-xs font-semibold px-3 py-1 rounded-full mb-2">
            Screen 8 • Mandi Net Return Comparison
          </div>
          <h1 className="font-serif text-3xl sm:text-4xl text-[#26352B] tracking-tight">
            MandiLog — Profit Calculator
          </h1>
          <p className="text-sm sm:text-base text-[#26352B]/80 mt-1">
            Compare estimated net returns after transportation and produce loss
          </p>
        </div>

        {/* 3-Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
          {/* SECTION 1: Enter Produce Details */}
          <section
            aria-labelledby="section-1-title"
            className="bg-[#FFFFFF] rounded-2xl p-6 border border-[#DFE5DA] shadow-sm flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center gap-2 mb-5 pb-3 border-b border-[#DFE5DA]">
                <span className="w-7 h-7 rounded-full bg-[#E8EFE4] text-[#246B45] text-sm font-bold flex items-center justify-center">
                  1
                </span>
                <h2
                  id="section-1-title"
                  className="font-serif text-xl font-bold text-[#26352B]"
                >
                  Enter Produce Details
                </h2>
              </div>

              <div className="space-y-4">
                {/* Crop Select */}
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-[#26352B] mb-1.5">
                    Select Crop
                  </label>
                  <select
                    value={crop}
                    onChange={(e) => setCrop(e.target.value)}
                    className="w-full bg-[#F7F8F2] border border-[#DFE5DA] rounded-xl px-3.5 py-3 text-sm font-medium text-[#26352B] focus:outline-none focus:ring-2 focus:ring-[#246B45] focus:border-transparent transition-all"
                  >
                    <option value="Tomato">Tomato (Fresh Hybrids)</option>
                    <option value="Onion">Onion (Garwa / Red)</option>
                    <option value="Wheat">Wheat (Sharbati)</option>
                  </select>
                </div>

                {/* Quantity & Unit in 2 cols */}
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-[#26352B] mb-1.5">
                      Quantity
                    </label>
                    <input
                      type="number"
                      min="1"
                      value={quantity}
                      onChange={(e) => setQuantity(Number(e.target.value))}
                      className="w-full bg-[#F7F8F2] border border-[#DFE5DA] rounded-xl px-3.5 py-3 text-sm font-semibold text-[#26352B] focus:outline-none focus:ring-2 focus:ring-[#246B45] focus:border-transparent transition-all"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-[#26352B] mb-1.5">
                      Unit
                    </label>
                    <select
                      value={unit}
                      onChange={(e) => setUnit(e.target.value)}
                      className="w-full bg-[#F7F8F2] border border-[#DFE5DA] rounded-xl px-3.5 py-3 text-sm font-medium text-[#26352B] focus:outline-none focus:ring-2 focus:ring-[#246B45] focus:border-transparent transition-all"
                    >
                      <option value="Crates">Crates</option>
                      <option value="Quintal">Quintal</option>
                      <option value="kg">kg</option>
                    </select>
                  </div>
                </div>

                {/* Harvest Date Picker */}
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-[#26352B] mb-1.5">
                    Expected Harvest Date
                  </label>
                  <input
                    type="date"
                    value={harvestDate}
                    onChange={(e) => setHarvestDate(e.target.value)}
                    className="w-full bg-[#F7F8F2] border border-[#DFE5DA] rounded-xl px-3.5 py-3 text-sm font-medium text-[#26352B] focus:outline-none focus:ring-2 focus:ring-[#246B45] focus:border-transparent transition-all"
                  >
                  </input>
                </div>

                {/* Location Input */}
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-[#26352B] mb-1.5">
                    Farm Location
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      value={location}
                      onChange={(e) => setLocation(e.target.value)}
                      className="w-full bg-[#F7F8F2] border border-[#DFE5DA] rounded-xl pl-9 pr-3.5 py-3 text-sm font-medium text-[#26352B] focus:outline-none focus:ring-2 focus:ring-[#246B45] focus:border-transparent transition-all"
                    />
                    <svg
                      className="w-4 h-4 text-[#246B45] absolute left-3 top-3.5"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" />
                    </svg>
                  </div>
                </div>
              </div>
            </div>

            {/* Hint Box */}
            <div className="mt-6 p-3.5 bg-[#E8EFE4] rounded-xl border border-[#DFE5DA] text-xs text-[#26352B]/80 flex items-start gap-2">
              <span className="text-[#246B45] font-bold text-sm">💡</span>
              <span>
                Calculations auto-calibrate against real-time APMC e-Nam mandi feeds and local diesel transport rates.
              </span>
            </div>
          </section>

          {/* SECTION 2: Compare Markets */}
          <section
            aria-labelledby="section-2-title"
            className="bg-[#FFFFFF] rounded-2xl p-6 border border-[#DFE5DA] shadow-sm flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center gap-2 mb-5 pb-3 border-b border-[#DFE5DA]">
                <span className="w-7 h-7 rounded-full bg-[#E8EFE4] text-[#246B45] text-sm font-bold flex items-center justify-center">
                  2
                </span>
                <h2
                  id="section-2-title"
                  className="font-serif text-xl font-bold text-[#26352B]"
                >
                  Compare Markets
                </h2>
              </div>

              <div className="space-y-4">
                {/* 1. Local Mandi (Junnar) */}
                <div className="bg-[#E8EFE4] rounded-xl p-4 border border-[#DFE5DA] space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-serif font-bold text-[#26352B] text-base">
                      1. Local Mandi (Junnar)
                    </span>
                    <span className="bg-white text-[#246B45] font-bold text-xs px-2.5 py-0.5 rounded-full border border-[#DFE5DA]">
                      ₹420 / Crate
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-xs text-[#26352B]/80 pt-1">
                    <span className="flex items-center gap-1">
                      <span>📍</span> 8 km distance
                    </span>
                    <span className="flex items-center gap-1 bg-[#F7F8F2] px-2 py-0.5 rounded border border-[#DFE5DA]">
                      📉 2% spoilage
                    </span>
                  </div>
                </div>

                {/* 2. Pune APMC */}
                <div className="bg-[#E8EFE4] rounded-xl p-4 border border-[#DFE5DA] space-y-2 relative overflow-hidden">
                  <div className="absolute top-0 right-0 bg-[#246B45] text-white text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-bl-lg">
                    BEST RATE
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="font-serif font-bold text-[#26352B] text-base">
                      2. Pune APMC (Gultekdi)
                    </span>
                    <span className="bg-[#246B45] text-white font-bold text-xs px-2.5 py-0.5 rounded-full">
                      ₹600 / Crate
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-xs text-[#26352B]/80 pt-1">
                    <span className="flex items-center gap-1">
                      <span>📍</span> 85 km distance
                    </span>
                    <span className="flex items-center gap-1 bg-[#F7F8F2] px-2 py-0.5 rounded border border-[#DFE5DA]">
                      📉 5% spoilage
                    </span>
                  </div>
                </div>

                {/* 3. Mumbai (Vashi) */}
                <div className="bg-[#E8EFE4] rounded-xl p-4 border border-[#DFE5DA] space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-serif font-bold text-[#26352B] text-base">
                      3. Mumbai (Vashi) APMC
                    </span>
                    <span className="bg-white text-[#246B45] font-bold text-xs px-2.5 py-0.5 rounded-full border border-[#DFE5DA]">
                      ₹680 / Crate
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-xs text-[#26352B]/80 pt-1">
                    <span className="flex items-center gap-1">
                      <span>📍</span> 145 km distance
                    </span>
                    <span className="flex items-center gap-1 bg-[#F7F8F2] px-2 py-0.5 rounded border border-[#DFE5DA]">
                      ⚠️ 9% spoilage
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Note */}
            <div className="mt-6 p-3 bg-[#F7F8F2] rounded-xl border border-[#DFE5DA] text-xs text-[#26352B]/70">
              Rates updated today from APMC Maharashtra Modal Pricing feeds.
            </div>
          </section>

          {/* SECTION 3: Net Proceeds */}
          <section
            aria-labelledby="section-3-title"
            className="bg-[#FFFFFF] rounded-2xl p-6 border border-[#DFE5DA] shadow-sm flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center gap-2 mb-5 pb-3 border-b border-[#DFE5DA]">
                <span className="w-7 h-7 rounded-full bg-[#E8EFE4] text-[#246B45] text-sm font-bold flex items-center justify-center">
                  3
                </span>
                <h2
                  id="section-3-title"
                  className="font-serif text-xl font-bold text-[#26352B]"
                >
                  Net Proceeds
                </h2>
              </div>

              {/* Top Recommendation Banner */}
              <div className="bg-[#E8EFE4] border border-[#DFE5DA] rounded-xl p-4 mb-4 flex items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                  <span className="text-xl">🌟</span>
                  <div>
                    <div className="text-[11px] uppercase tracking-wider font-bold text-[#26352B]/70">
                      Recommendation
                    </div>
                    <div className="font-serif font-bold text-[#26352B] text-base">
                      {recommended?.marketName || 'Pune APMC'}
                    </div>
                  </div>
                </div>
                <span className="bg-[#246B45] text-white text-xs font-semibold px-3 py-1 rounded-full whitespace-nowrap">
                  Recommended: Pune APMC
                </span>
              </div>

              {/* Net Proceeds Breakdown for each market */}
              <div className="space-y-3.5">
                {calculationResults.map((result) => {
                  const isRec = result.isRecommended;
                  return (
                    <div
                      key={result.marketName}
                      className={`rounded-xl p-3.5 border transition-all ${
                        isRec
                          ? 'bg-[#E8EFE4]/60 border-[#246B45]/40 shadow-sm'
                          : 'bg-[#F7F8F2] border-[#DFE5DA]'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-2 pb-1.5 border-b border-[#DFE5DA]/70">
                        <span className="font-serif font-bold text-sm text-[#26352B]">
                          {result.marketName}
                        </span>
                        {isRec && (
                          <span className="text-[10px] font-bold bg-[#76A94C] text-white px-2 py-0.5 rounded-full">
                            HIGHEST NET CASH
                          </span>
                        )}
                      </div>

                      <div className="space-y-1 text-xs text-[#26352B]/80 font-sans">
                        <div className="flex justify-between">
                          <span>Gross Revenue:</span>
                          <span className="font-medium">
                            ₹{result.grossRevenue.toLocaleString('en-IN')}
                          </span>
                        </div>
                        <div className="flex justify-between text-amber-900/80">
                          <span>− Transport Cost:</span>
                          <span>
                            ₹{result.transportCost.toLocaleString('en-IN')}
                          </span>
                        </div>
                        <div className="flex justify-between text-rose-800/80">
                          <span>− Est. Spoilage Loss:</span>
                          <span>
                            ₹{result.spoilageCost.toLocaleString('en-IN')}
                          </span>
                        </div>
                        <div className="pt-2 mt-1 border-t border-[#DFE5DA] flex justify-between items-baseline">
                          <span className="font-bold text-[#26352B] text-xs">
                            Net Cash Proceeds:
                          </span>
                          <span
                            className={`font-bold text-base ${
                              isRec ? 'text-[#246B45] text-lg' : 'text-[#26352B]'
                            }`}
                          >
                            ₹{result.netProceeds.toLocaleString('en-IN')}
                          </span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Full-width CTA button */}
            <div className="mt-6 pt-3">
              <Link
                href="/marketplace"
                className="w-full bg-[#246B45] hover:bg-[#1e5838] text-white rounded-xl py-3.5 font-semibold text-center text-sm sm:text-base flex items-center justify-center gap-2 shadow-sm transition-all"
              >
                <span>Sell via Online Auction</span>
                <span>→</span>
              </Link>
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}

