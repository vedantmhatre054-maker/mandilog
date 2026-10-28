'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import Navbar from '@/components/Navbar';

interface BidEntry {
  id: string;
  buyer: string;
  amount: number;
  time: string;
  isYou?: boolean;
}

export default function LiveAuctionRoomPage() {
  const params = useParams();
  const lotSlug = (params?.id as string) || 'lot-1';

  // Lot Details (customized per lot or defaulted to Tomatoes)
  const lotData = {
    'lot-1': {
      lotCode: 'LOT #TM-894',
      title: 'Fresh Tomatoes (Grade A)',
      farmer: 'Ramesh Patil',
      location: 'Junnar, Maharashtra',
      quantity: '500 kg (25 Crates)',
      floorRate: 18,
      initialBid: 22,
      timeLeft: '2h 20m left',
      emoji: '🍅',
      specs: 'Abhinav F1 • Firm Red • Moisture < 8% • APMC Sorted',
    },
    'lot-2': {
      lotCode: 'LOT #ON-442',
      title: 'Red Onions (Garwa Quality)',
      farmer: 'Suresh Shinde',
      location: 'Narayangaon, Maharashtra',
      quantity: '300 kg (6 Bags)',
      floorRate: 22,
      initialBid: 28,
      timeLeft: '5h 15m left',
      emoji: '🧅',
      specs: 'Medium-Large • Dry Skin • Storage Cured • Graded',
    },
    'lot-3': {
      lotCode: 'LOT #WH-109',
      title: 'Sharbati Wheat (Cleaned/Sorted)',
      farmer: 'Dattatray Kadam',
      location: 'Shirur, Maharashtra',
      quantity: '1,000 kg',
      floorRate: 26,
      initialBid: 32,
      timeLeft: '1d 4h left',
      emoji: '🌾',
      specs: 'Golden Grain • Machine Cleaned • Protein 13.5%',
    },
  }[lotSlug] || {
    lotCode: 'LOT #TM-894',
    title: 'Fresh Tomatoes (Grade A)',
    farmer: 'Ramesh Patil',
    location: 'Junnar, Maharashtra',
    quantity: '500 kg (25 Crates)',
    floorRate: 18,
    initialBid: 22,
    timeLeft: '2h 20m left',
    emoji: '🍅',
    specs: 'Abhinav F1 • Firm Red • Moisture < 8% • APMC Sorted',
  };

  // Live bidding state
  const [highestOffer, setHighestOffer] = useState<number>(lotData.initialBid);
  const [bidInput, setBidInput] = useState<number>(lotData.initialBid + 1);
  const [bidsLedger, setBidsLedger] = useState<BidEntry[]>([
    {
      id: 'bid-1',
      buyer: 'APMC Trader #104',
      amount: lotData.initialBid,
      time: '4 mins ago',
    },
    {
      id: 'bid-2',
      buyer: 'Pune Hotel Mart',
      amount: lotData.initialBid - 1,
      time: '12 mins ago',
    },
    {
      id: 'bid-3',
      buyer: 'Vashi Wholesaler #8',
      amount: lotData.initialBid - 2,
      time: '25 mins ago',
    },
  ]);

  // Order confirmation state
  const [isOrderConfirmed, setIsOrderConfirmed] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string>('');

  // Handle Placing Counter-Bid
  const handlePlaceBid = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    if (bidInput <= highestOffer) {
      setErrorMessage(
        `Bid must be higher than the current offer of ₹${highestOffer}/kg.`
      );
      return;
    }

    const newOffer = Number(bidInput);
    setHighestOffer(newOffer);

    const newEntry: BidEntry = {
      id: Date.now().toString(),
      buyer: 'You (Authorized Buyer)',
      amount: newOffer,
      time: 'Just now',
      isYou: true,
    };

    setBidsLedger([newEntry, ...bidsLedger]);
    setBidInput(newOffer + 1);
  };

  // Handle Farmer Acceptance
  const handleAcceptOffer = () => {
    setIsOrderConfirmed(true);
  };

  return (
    <div className="min-h-screen bg-[#F7F8F2] text-[#26352B] flex flex-col font-sans">
      <Navbar />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        {/* Navigation & Screen Breadcrumb */}
        <div className="flex flex-wrap items-center justify-between gap-3">
          <Link
            href="/marketplace"
            className="bg-[#E8EFE4] hover:bg-[#dfe6db] text-[#26352B] px-4 py-2 rounded-xl text-sm font-semibold inline-flex items-center gap-2 border border-[#DFE5DA] transition-colors"
          >
            <span>←</span>
            <span>Back to Listings</span>
          </Link>

          <div className="text-xs text-[#26352B]/70 font-medium">
            Screen 10a • Live Auction Room
          </div>
        </div>

        {/* Confirmed Order Success State Banner */}
        {isOrderConfirmed && (
          <div className="bg-[#E8EFE4] border-2 border-[#76A94C] rounded-2xl p-6 shadow-sm space-y-4 animate-in fade-in duration-300">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-full bg-[#76A94C] text-white flex items-center justify-center text-2xl shrink-0">
                ✓
              </div>
              <div className="flex-1">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <h2 className="font-serif text-2xl font-bold text-[#26352B]">
                    Deal Confirmed! Mandi Gate Pass Generated
                  </h2>
                  <span className="bg-[#246B45] text-white text-xs font-semibold px-3 py-1 rounded-full">
                    ORDER #ML-ORD-9281
                  </span>
                </div>
                <p className="text-sm text-[#26352B]/90 mt-1">
                  Offer accepted at <strong>₹{highestOffer}/kg</strong>. Ramesh Patil will prepare {lotData.quantity} for dispatch. Payment is securely held in APMC escrow settlement.
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-4 pt-3 border-t border-[#DFE5DA] text-xs">
                  <div className="p-2.5 bg-white rounded-xl border border-[#DFE5DA]">
                    <span className="text-[#26352B]/60 block">Accepted Rate:</span>
                    <strong className="text-[#246B45] text-sm">
                      ₹{highestOffer} / kg
                    </strong>
                  </div>
                  <div className="p-2.5 bg-white rounded-xl border border-[#DFE5DA]">
                    <span className="text-[#26352B]/60 block">Est. Settlement Total:</span>
                    <strong className="text-[#26352B] text-sm">
                      ₹{(highestOffer * 500).toLocaleString('en-IN')}
                    </strong>
                  </div>
                  <div className="p-2.5 bg-white rounded-xl border border-[#DFE5DA]">
                    <span className="text-[#26352B]/60 block">Pickup Mandi:</span>
                    <strong className="text-[#26352B] text-sm">
                      Junnar Yard, Gate #2
                    </strong>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* 2-Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
          {/* LEFT COLUMN: Produce Details */}
          <div className="bg-[#FFFFFF] rounded-2xl p-6 border border-[#DFE5DA] shadow-sm space-y-6">
            {/* Badges */}
            <div className="flex items-center gap-2">
              <span className="bg-[#E8EFE4] text-[#246B45] font-semibold px-3 py-1 rounded-full text-xs border border-[#DFE5DA]">
                {lotData.lotCode}
              </span>
              <span className="bg-[#E8CFA3] text-[#26352B] font-semibold px-3 py-1 rounded-full text-xs">
                {lotData.timeLeft}
              </span>
            </div>

            {/* Produce Photograph Placeholder Area */}
            <div className="bg-[#E8EFE4] rounded-xl h-48 flex flex-col items-center justify-center text-sm font-medium text-[#26352B] border border-[#DFE5DA] relative overflow-hidden">
              <span className="text-7xl select-none mb-1">{lotData.emoji}</span>
              <span className="bg-white/80 px-3 py-1 rounded-full text-xs font-semibold text-[#246B45] border border-[#DFE5DA]">
                Verified APMC Physical Inspection Passed
              </span>
            </div>

            {/* Title & Farmer Details */}
            <div>
              <h1 className="font-serif text-2xl sm:text-3xl font-bold text-[#26352B]">
                {lotData.title}
              </h1>
              <p className="text-sm font-medium text-[#26352B]/80 mt-1 flex items-center gap-1.5">
                <span>👨‍🌾</span>
                <span>{lotData.farmer} • {lotData.location}</span>
              </p>
            </div>

            {/* Lot Specs */}
            <div className="bg-[#F7F8F2] rounded-xl p-4 border border-[#DFE5DA] space-y-2.5 text-xs sm:text-sm font-sans">
              <div className="flex justify-between items-center">
                <span className="text-[#26352B]/70">Total Lot:</span>
                <span className="font-semibold text-[#26352B]">
                  {lotData.quantity}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-[#26352B]/70">Floor Rate (Reserve):</span>
                <span className="font-semibold text-[#26352B]">
                  ₹{lotData.floorRate} / kg
                </span>
              </div>
              <div className="flex justify-between items-center pt-2 border-t border-[#DFE5DA]">
                <span className="text-[#26352B]/70">Quality Specifications:</span>
                <span className="font-medium text-[#246B45] text-right">
                  {lotData.specs}
                </span>
              </div>
            </div>

            {/* Farmer Trust Notes */}
            <div className="p-3 bg-[#E8EFE4]/60 rounded-xl border border-[#DFE5DA] text-xs text-[#26352B]/80 flex items-center gap-2">
              <span className="text-lg">🛡️</span>
              <span>
                100% Guaranteed delivery. Farmer Ramesh Patil has completed 24 successful MandiLog auctions with 4.9★ rating.
              </span>
            </div>
          </div>

          {/* RIGHT COLUMN: Live Bidding & Offer Acceptance */}
          <div className="bg-[#FFFFFF] rounded-2xl p-6 border border-[#DFE5DA] shadow-sm space-y-6">
            {/* Top Banner: Current Highest Offer */}
            <div className="bg-[#E8EFE4] rounded-xl p-5 text-center border border-[#DFE5DA]">
              <div className="text-xs font-semibold text-[#26352B] uppercase tracking-wider">
                CURRENT HIGHEST OFFER
              </div>
              <div className="font-bold text-3xl sm:text-4xl text-[#246B45] mt-1">
                ₹{highestOffer} <span className="text-base font-normal text-[#26352B]">/ kg</span>
              </div>
              <div className="text-xs text-[#26352B]/70 mt-1">
                Active Bidders: 4 Verified APMC Traders
              </div>
            </div>

            {/* Interactive Counter-bid Form */}
            <form onSubmit={handlePlaceBid} className="space-y-3">
              <label className="block text-xs font-semibold uppercase tracking-wider text-[#26352B]">
                Your Counter-Bid (₹ / kg)
              </label>

              <div className="flex flex-col sm:flex-row gap-3">
                <div className="relative flex-1">
                  <span className="absolute left-3.5 top-3.5 font-bold text-[#26352B]/70">
                    ₹
                  </span>
                  <input
                    type="number"
                    min={highestOffer + 1}
                    value={bidInput}
                    onChange={(e) => setBidInput(Number(e.target.value))}
                    className="w-full bg-[#F7F8F2] border border-[#DFE5DA] rounded-xl pl-8 pr-3.5 py-3 font-semibold text-[#26352B] text-base focus:outline-none focus:ring-2 focus:ring-[#246B45] focus:border-transparent transition-all"
                  />
                </div>
                <button
                  type="submit"
                  className="bg-[#246B45] hover:bg-[#1e5838] text-white font-semibold rounded-xl px-6 py-3 transition-colors text-sm sm:text-base whitespace-nowrap shadow-sm"
                >
                  PLACE BID
                </button>
              </div>

              {errorMessage && (
                <p className="text-xs font-semibold text-rose-600 mt-1">
                  {errorMessage}
                </p>
              )}
            </form>

            {/* Live Bid Ledger */}
            <div className="space-y-3">
              <div className="flex items-center justify-between pb-2 border-b border-[#DFE5DA]">
                <h3 className="font-serif text-lg font-bold text-[#26352B] flex items-center gap-2">
                  <span>Live Bid Ledger</span>
                  <span className="w-2 h-2 rounded-full bg-[#76A94C] animate-pulse"></span>
                </h3>
                <span className="text-xs text-[#26352B]/70 font-medium">
                  {bidsLedger.length} bids placed
                </span>
              </div>

              <div className="space-y-2 max-h-56 overflow-y-auto pr-1">
                {bidsLedger.map((bid, index) => (
                  <div
                    key={bid.id}
                    className={`flex items-center justify-between p-3 rounded-xl border text-xs sm:text-sm transition-all ${
                      index === 0
                        ? 'bg-[#E8EFE4] border-[#246B45]/40 font-semibold text-[#246B45]'
                        : 'bg-[#F7F8F2] border-[#DFE5DA] text-[#26352B]'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <span className="w-6 h-6 rounded-full bg-white border border-[#DFE5DA] text-[10px] font-bold flex items-center justify-center text-[#26352B]">
                        #{index + 1}
                      </span>
                      <div>
                        <div className="font-medium text-[#26352B]">
                          {bid.buyer}
                        </div>
                        <div className="text-[10px] text-[#26352B]/60 font-sans">
                          {bid.time}
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <span className="text-base font-bold text-[#246B45]">
                        ₹{bid.amount}
                      </span>
                      <span className="text-[11px] text-[#26352B]/70"> / kg</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Farmer Offer Acceptance Action */}
            <div className="pt-2 border-t border-[#DFE5DA]">
              <div className="text-xs text-[#26352B]/70 mb-2 font-medium">
                Farmer Ramesh Patil Action:
              </div>
              <button
                type="button"
                onClick={handleAcceptOffer}
                disabled={isOrderConfirmed}
                className={`w-full font-semibold rounded-xl py-3.5 transition-all text-sm sm:text-base flex items-center justify-center gap-2 shadow-sm ${
                  isOrderConfirmed
                    ? 'bg-gray-300 text-gray-600 cursor-not-allowed'
                    : 'bg-[#76A94C] hover:bg-[#628f3d] text-white'
                }`}
              >
                <span>🤝</span>
                <span>
                  {isOrderConfirmed
                    ? 'Offer Accepted & Order Confirmed'
                    : `Accept Highest Offer (₹${highestOffer}/kg)`}
                </span>
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

