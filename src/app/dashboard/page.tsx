import React from 'react';
import Link from 'next/link';
import Navbar from '@/components/Navbar';

export default function DashboardPage() {
  const statCards = [
    {
      label: 'Active Farms',
      value: '3',
      subtext: '14.5 Acres Total',
      bg: 'bg-[#fef08a]', // Retro Yellow
      icon: '🚜',
      tag: 'OWNED',
    },
    {
      label: 'Growing Crops',
      value: '5',
      subtext: 'Tomato, Onion, Soy & more',
      bg: 'bg-[#bbf7d0]', // Retro Green
      icon: '🌱',
      tag: 'IN SEASON',
    },
    {
      label: 'Saved Schemes',
      value: '12',
      subtext: 'Eligible for ₹1.2L benefits',
      bg: 'bg-[#bae6fd]', // Retro Blue
      icon: '📜',
      tag: 'GOVT AID',
    },
    {
      label: 'Active Auctions',
      value: '4',
      subtext: '31 bids received today',
      bg: 'bg-[#fed7aa]', // Retro Orange
      icon: '⚡',
      tag: 'HOT BIDS',
    },
  ];

  const toolCards = [
    {
      title: 'Mandi Marketplace',
      href: '/marketplace',
      category: 'COMMERCE',
      description:
        'Live crop trading, transparent farmer-to-buyer spot auctions, and instant bids from verified APMC traders.',
      bg: 'bg-[#fef08a]',
      icon: '🛒',
      badge: 'LIVE AUCTIONS',
      badgeBg: 'bg-black text-[#fef08a]',
    },
    {
      title: 'Profit Calculator',
      href: '/calculator',
      category: 'ANALYTICS',
      description:
        'Compare net returns across APMC mandis after factoring real-time transport costs, distance, and transit spoilage.',
      bg: 'bg-[#bbf7d0]',
      icon: '🧮',
      badge: 'RECOMMENDED',
      badgeBg: 'bg-black text-[#bbf7d0]',
    },
    {
      title: 'Live Market Rates',
      href: '/prices',
      category: 'INTELLIGENCE',
      description:
        'Daily modal, min & max prices across Junnar, Pune, Nashik, and Vashi mandis with 7-day price trend graphs.',
      bg: 'bg-[#fed7aa]',
      icon: '📈',
      badge: 'DAILY UPDATES',
      badgeBg: 'bg-black text-[#fed7aa]',
    },
    {
      title: 'AI Crop Doctor',
      href: '/crop-doctor',
      category: 'AI ADVISORY',
      description:
        'Scan leaf photos to detect pest attacks, fungal blight, nutrient deficiencies, and receive dosage advice.',
      bg: 'bg-[#e9d5ff]',
      icon: '🩺',
      badge: 'AI POWERED',
      badgeBg: 'bg-black text-[#e9d5ff]',
    },
    {
      title: 'Govt Schemes & Subsidies',
      href: '/schemes',
      category: 'SUBSIDIES',
      description:
        'Direct links and eligibility checker for PM-Kisan, drip irrigation 80% subsidy, crop insurance, and solar pumps.',
      bg: 'bg-[#bae6fd]',
      icon: '🏛️',
      badge: '12 ELIGIBLE',
      badgeBg: 'bg-black text-[#bae6fd]',
    },
    {
      title: 'Farms & Crop Lifecycle',
      href: '/farms',
      category: 'MANAGEMENT',
      description:
        'Track sowing dates, stage days, soil conditions, and harvest countdowns for all your farm plots.',
      bg: 'bg-[#fca5a5]',
      icon: '🌾',
      badge: '3 PARCELS',
      badgeBg: 'bg-black text-[#fca5a5]',
    },
    {
      title: 'Orders & Dispatches',
      href: '/orders',
      category: 'LOGISTICS',
      description:
        'Manage accepted bids, generate delivery gate passes, assign transporters, and verify payment settlements.',
      bg: 'bg-[#fef08a]',
      icon: '📦',
      badge: '2 PENDING',
      badgeBg: 'bg-black text-[#fef08a]',
    },
    {
      title: 'Mandi Route & Logistics',
      href: '/maps',
      category: 'NAVIGATION',
      description:
        'Find nearest APMC yards, rural collection centres, verified cold storage facilities, and transport hubs.',
      bg: 'bg-[#bbf7d0]',
      icon: '🗺️',
      badge: 'GPS MAPPED',
      badgeBg: 'bg-black text-[#bbf7d0]',
    },
  ];

  return (
    <div className="min-h-screen bg-[#f4f0ea] flex flex-col font-sans">
      {/* Top Navbar */}
      <Navbar />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* Welcome Section */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b-2 border-black/10">
          <div>
            <div className="inline-block bg-[#fef08a] border-2 border-black px-2 py-0.5 text-xs font-black uppercase tracking-wider mb-2 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
              Kisan Command Center
            </div>
            <h1 className="text-3xl sm:text-4xl font-black text-black tracking-tight">
              Farmer Dashboard
            </h1>
            <p className="text-sm sm:text-base font-bold text-gray-800 mt-1">
              Real-time Mandi price intelligence, farm management & auction coordination.
            </p>
          </div>

          <div className="flex items-center gap-2 self-start sm:self-auto">
            <span className="inline-flex items-center gap-1.5 bg-white border-2 border-black px-3 py-1.5 text-xs font-black shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]">
              <span className="w-2.5 h-2.5 bg-emerald-500 rounded-full border border-black animate-pulse"></span>
              APMC Junnar: OPEN
            </span>
          </div>
        </div>

        {/* 4 Top Stat Cards */}
        <section aria-label="Quick Stats">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            {statCards.map((stat) => (
              <div
                key={stat.label}
                className={`${stat.bg} border-3 border-[3px] border-black p-5 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:-translate-x-0.5 hover:-translate-y-0.5 transition-all flex flex-col justify-between`}
              >
                <div className="flex items-start justify-between">
                  <span className="text-3xl">{stat.icon}</span>
                  <span className="bg-black text-white text-[10px] font-black uppercase px-2 py-0.5 tracking-wider">
                    {stat.tag}
                  </span>
                </div>
                <div className="mt-4">
                  <div className="text-4xl sm:text-5xl font-black text-black tracking-tight">
                    {stat.value}
                  </div>
                  <div className="text-base font-black text-black mt-1">
                    {stat.label}
                  </div>
                  <div className="text-xs font-bold text-gray-800 mt-0.5">
                    {stat.subtext}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Big Green Banner */}
        <section aria-label="Mandi Calculator Promo">
          <div className="bg-[#bbf7d0] border-3 border-[3px] border-black p-6 sm:p-8 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] flex flex-col lg:flex-row lg:items-center justify-between gap-6">
            <div className="space-y-3 max-w-2xl">
              <div className="inline-flex items-center gap-2 bg-black text-[#bbf7d0] px-3 py-1 text-xs font-black uppercase tracking-wider">
                <span>⚡</span>
                <span>Max Profit Decision Engine</span>
              </div>
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-black tracking-tight leading-tight">
                Stop Guessing Mandi Rates. Calculate Net Return Before Selling!
              </h2>
              <p className="text-sm sm:text-base font-bold text-black/90">
                Factor in transport freight, diesel rates, distance in km, and perishable crop spoilage percentage. Find out if Junnar, Pune, Nashik, or Mumbai gives you the highest cash in hand.
              </p>
            </div>

            <div className="shrink-0">
              <Link
                href="/calculator"
                className="inline-flex items-center justify-center gap-3 bg-[#fef08a] text-black border-3 border-[3px] border-black px-6 py-4 font-black text-base sm:text-lg uppercase tracking-wide shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-none hover:translate-x-1 hover:translate-y-1 active:translate-x-1.5 active:translate-y-1.5 transition-all text-center w-full sm:w-auto"
              >
                <span>Launch Profit Calculator</span>
                <span className="text-xl">➔</span>
              </Link>
            </div>
          </div>
        </section>

        {/* 8 Tool Cards Section */}
        <section aria-label="MandiLog Core Tools">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl sm:text-2xl font-black text-black flex items-center gap-2">
              <span className="bg-black text-white px-2 py-0.5 text-xs font-black uppercase">
                TOOLS
              </span>
              <span>Agricultural Suite</span>
            </h2>
            <span className="text-xs sm:text-sm font-black text-gray-700">
              8 Core Modules
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {toolCards.map((tool) => (
              <Link
                key={tool.href}
                href={tool.href}
                className={`group flex flex-col justify-between ${tool.bg} border-3 border-[3px] border-black p-5 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:-translate-x-1 hover:-translate-y-1 transition-all focus:outline-none`}
              >
                <div>
                  <div className="flex items-start justify-between gap-2 mb-3">
                    <span className="text-3xl p-2 bg-white border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
                      {tool.icon}
                    </span>
                    <span
                      className={`text-[10px] font-black uppercase px-2 py-0.5 border border-black shadow-[1px_1px_0px_0px_rgba(0,0,0,1)] ${tool.badgeBg}`}
                    >
                      {tool.badge}
                    </span>
                  </div>

                  <div className="text-[11px] font-black tracking-wider text-black/70 uppercase">
                    {tool.category}
                  </div>
                  <h3 className="text-lg font-black text-black group-hover:underline mt-0.5 leading-snug">
                    {tool.title}
                  </h3>
                  <p className="text-xs font-bold text-gray-800 mt-2 line-clamp-3 leading-relaxed">
                    {tool.description}
                  </p>
                </div>

                <div className="mt-5 pt-3 border-t-2 border-black/20 flex items-center justify-between font-black text-xs text-black">
                  <span className="group-hover:translate-x-1 transition-transform">
                    Access Tool
                  </span>
                  <span className="w-6 h-6 rounded-none bg-black text-white flex items-center justify-center font-black group-hover:bg-[#fef08a] group-hover:text-black border border-black transition-colors">
                    →
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </section>

        {/* Footer info note */}
        <footer className="pt-6 pb-4 border-t-2 border-black/20 text-center">
          <div className="inline-block bg-white border-2 border-black px-4 py-2 shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] text-xs font-black text-black">
            MandiLog v1.0 • Designed for Maharashtra Farmers & APMC Mandis • Junnar / Narayangaon Base
          </div>
        </footer>
      </main>
    </div>
  );
}

