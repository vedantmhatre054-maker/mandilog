'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Navbar from '@/components/Navbar';

interface AuctionItem {
  id: string;
  slug: string;
  title: string;
  category: 'Vegetables' | 'Fruits' | 'Grains';
  grade: string;
  quantity: string;
  location: string;
  currentBid: number;
  floorPrice: number;
  totalBids: number;
  timeLeft: string;
  farmer: string;
  imageEmoji: string;
}

export default function MarketplacePage() {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [showCreateModal, setShowCreateModal] = useState<boolean>(false);

  const auctions: AuctionItem[] = [
    {
      id: 'LOT-TM-894',
      slug: 'lot-1',
      title: 'Fresh Tomatoes',
      category: 'Vegetables',
      grade: 'Grade A',
      quantity: '500 kg (25 Crates)',
      location: 'Junnar, Pune',
      currentBid: 22,
      floorPrice: 18,
      totalBids: 8,
      timeLeft: '2h 30m left',
      farmer: 'Ramesh Patil',
      imageEmoji: '🍅',
    },
    {
      id: 'LOT-ON-442',
      slug: 'lot-2',
      title: 'Red Onions',
      category: 'Vegetables',
      grade: 'Garwa Quality',
      quantity: '300 kg (6 Bags)',
      location: 'Narayangaon, Pune',
      currentBid: 28,
      floorPrice: 22,
      totalBids: 12,
      timeLeft: '5h 15m left',
      farmer: 'Suresh Shinde',
      imageEmoji: '🧅',
    },
    {
      id: 'LOT-WH-109',
      slug: 'lot-3',
      title: 'Sharbati Wheat',
      category: 'Grains',
      grade: 'Cleaned/Sorted',
      quantity: '1,000 kg',
      location: 'Shirur, Pune',
      currentBid: 32,
      floorPrice: 26,
      totalBids: 15,
      timeLeft: '1d 4h left',
      farmer: 'Dattatray Kadam',
      imageEmoji: '🌾',
    },
  ];

  const categories = ['All', 'Vegetables', 'Fruits', 'Grains'];

  const filteredAuctions =
    selectedCategory === 'All'
      ? auctions
      : auctions.filter((item) => item.category === selectedCategory);

  return (
    <div className="min-h-screen bg-[#F7F8F2] text-[#26352B] flex flex-col font-sans">
      <Navbar />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-4 border-b border-[#DFE5DA]">
          <div>
            <div className="inline-block bg-[#E8EFE4] text-[#246B45] text-xs font-semibold px-3 py-1 rounded-full mb-2">
              Screen 10 • APMC Spot Bidding
            </div>
            <h1 className="font-serif text-3xl sm:text-4xl text-[#26352B] tracking-tight">
              Live Produce Auctions
            </h1>
            <p className="text-sm sm:text-base text-[#26352B]/80 mt-1">
              Verified buyers bidding on fresh harvest
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setShowCreateModal(true)}
              className="bg-[#246B45] hover:bg-[#1e5838] text-white rounded-xl px-4 py-2.5 text-sm font-semibold flex items-center gap-1.5 shadow-sm transition-all"
            >
              <span>+</span>
              <span>Create Listing</span>
            </button>
          </div>
        </div>

        {/* Action Bar with Category Filter Pills */}
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            {categories.map((category) => {
              const isActive = selectedCategory === category;
              return (
                <button
                  key={category}
                  type="button"
                  onClick={() => setSelectedCategory(category)}
                  className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all ${
                    isActive
                      ? 'bg-[#246B45] text-white shadow-sm'
                      : 'bg-[#E8EFE4] text-[#26352B] hover:bg-[#DFE5DA]'
                  }`}
                >
                  {category}
                </button>
              );
            })}
          </div>

          <div className="text-xs sm:text-sm font-medium text-[#26352B]/70">
            Showing <strong className="text-[#26352B]">{filteredAuctions.length}</strong> active lots
          </div>
        </div>

        {/* Grid of 3 Auction Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredAuctions.map((card) => (
            <div
              key={card.id}
              className="bg-[#FFFFFF] rounded-2xl p-5 border border-[#DFE5DA] shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between"
            >
              <div>
                {/* Visual Header / Lot Image Placeholder */}
                <div className="relative bg-[#E8EFE4] rounded-xl h-44 flex flex-col items-center justify-center mb-4 border border-[#DFE5DA] overflow-hidden">
                  <span className="text-6xl select-none">{card.imageEmoji}</span>
                  <span className="text-xs font-semibold text-[#246B45] mt-1 bg-white/70 px-2.5 py-0.5 rounded-full">
                    {card.category}
                  </span>

                  {/* Time Badge */}
                  <div className="absolute top-3 right-3 bg-[#E8CFA3] text-[#26352B] font-semibold text-xs px-2.5 py-1 rounded-full shadow-xs flex items-center gap-1">
                    <span>⏱️</span>
                    <span>{card.timeLeft}</span>
                  </div>

                  {/* Lot Code Badge */}
                  <div className="absolute top-3 left-3 bg-[#FFFFFF]/90 text-[#246B45] font-semibold text-[11px] px-2 py-0.5 rounded-md border border-[#DFE5DA]">
                    {card.id}
                  </div>
                </div>

                {/* Card Title & Grade */}
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <h3 className="font-serif text-xl font-bold text-[#26352B]">
                      {card.title}
                    </h3>
                    <p className="text-xs text-[#26352B]/70 mt-0.5">
                      Farmer: <strong className="text-[#26352B]">{card.farmer}</strong>
                    </p>
                  </div>
                  <span className="bg-[#E8EFE4] text-[#246B45] text-xs font-semibold px-2.5 py-1 rounded-full border border-[#DFE5DA]">
                    {card.grade}
                  </span>
                </div>

                {/* Specs List */}
                <div className="mt-4 pt-3 border-t border-[#DFE5DA] space-y-2 text-xs text-[#26352B]/80 font-sans">
                  <div className="flex justify-between items-center">
                    <span className="text-[#26352B]/60">Lot Quantity:</span>
                    <span className="font-semibold text-[#26352B]">
                      {card.quantity}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-[#26352B]/60">Pickup Location:</span>
                    <span className="font-semibold text-[#26352B] flex items-center gap-1">
                      <span>📍</span> {card.location}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-[#26352B]/60">Floor (Reserve):</span>
                    <span className="font-medium text-[#26352B]/80">
                      ₹{card.floorPrice}/kg
                    </span>
                  </div>
                </div>

                {/* Current Bid Display */}
                <div className="mt-4 p-3 bg-[#E8EFE4] rounded-xl border border-[#DFE5DA] flex items-center justify-between">
                  <div>
                    <div className="text-[10px] uppercase font-bold tracking-wider text-[#26352B]/70">
                      Current Bid
                    </div>
                    <div className="text-2xl font-bold text-[#246B45]">
                      ₹{card.currentBid} <span className="text-xs font-normal text-[#26352B]">/ kg</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="inline-block bg-[#76A94C] text-white text-[11px] font-bold px-2 py-0.5 rounded-full">
                      {card.totalBids} bids
                    </span>
                  </div>
                </div>
              </div>

              {/* Action Button */}
              <div className="mt-5 pt-1">
                <Link
                  href={`/marketplace/${card.slug}`}
                  className="bg-[#246B45] hover:bg-[#1e5838] text-white rounded-xl py-2.5 text-center font-medium block transition-colors text-sm"
                >
                  Enter Auction Room
                </Link>
              </div>
            </div>
          ))}
        </div>

        {/* Modal for + Create Listing */}
        {showCreateModal && (
          <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
            <div className="bg-[#FFFFFF] rounded-2xl max-w-md w-full p-6 border border-[#DFE5DA] shadow-xl space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-[#DFE5DA]">
                <h3 className="font-serif text-xl font-bold text-[#26352B]">
                  List Produce for Auction
                </h3>
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="text-gray-400 hover:text-gray-700 text-lg font-bold"
                >
                  ✕
                </button>
              </div>

              <div className="space-y-3 text-sm">
                <div>
                  <label className="block text-xs font-semibold uppercase text-[#26352B] mb-1">
                    Produce & Variety
                  </label>
                  <input
                    type="text"
                    defaultValue="Tomato (Abhinav F1)"
                    className="w-full bg-[#F7F8F2] border border-[#DFE5DA] rounded-xl p-2.5 text-sm"
                  />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold uppercase text-[#26352B] mb-1">
                      Quantity (kg)
                    </label>
                    <input
                      type="number"
                      defaultValue="500"
                      className="w-full bg-[#F7F8F2] border border-[#DFE5DA] rounded-xl p-2.5 text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold uppercase text-[#26352B] mb-1">
                      Floor Price (₹/kg)
                    </label>
                    <input
                      type="number"
                      defaultValue="18"
                      className="w-full bg-[#F7F8F2] border border-[#DFE5DA] rounded-xl p-2.5 text-sm"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-semibold uppercase text-[#26352B] mb-1">
                    Pickup Mandi / Village
                  </label>
                  <input
                    type="text"
                    defaultValue="Junnar, Pune"
                    className="w-full bg-[#F7F8F2] border border-[#DFE5DA] rounded-xl p-2.5 text-sm"
                  />
                </div>
              </div>

              <div className="pt-2 flex gap-3">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="flex-1 bg-[#E8EFE4] text-[#26352B] font-semibold rounded-xl py-2.5 text-sm"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={() => {
                    alert('Produce listing published to APMC verified buyers network!');
                    setShowCreateModal(false);
                  }}
                  className="flex-1 bg-[#246B45] text-white font-semibold rounded-xl py-2.5 text-sm"
                >
                  Publish Listing
                </button>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

