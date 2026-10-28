'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import {
  ArrowRight,
  Clock3,
  MapPin,
  Navigation,
  Search,
  Snowflake,
  Warehouse,
} from 'lucide-react';
import Navbar from '@/components/Navbar';

const categories = ['All Mandis', 'Cold Storage', 'Collection Centres'] as const;
type Category = (typeof categories)[number];

const destinations = [
  {
    name: 'Junnar APMC Yard',
    category: 'All Mandis',
    distance: '8 km',
    transit: '~15 mins away',
    detailLabel: 'Modal Rate',
    detail: '₹2,400/Q',
    icon: Warehouse,
  },
  {
    name: 'Narayangaon Tomato Market',
    category: 'All Mandis',
    distance: '16 km',
    transit: '~25 mins away',
    detailLabel: 'Modal Rate',
    detail: '₹2,600/Q',
    icon: Warehouse,
  },
  {
    name: 'Pune Gultekdi APMC',
    category: 'All Mandis',
    distance: '85 km',
    transit: '~2h 10m away',
    detailLabel: 'Modal Rate',
    detail: '₹2,800/Q',
    icon: Warehouse,
  },
  {
    name: 'Sahyadri Agri Cold Storage',
    category: 'Cold Storage',
    distance: '12 km',
    transit: '~20 mins away',
    detailLabel: 'Capacity',
    detail: '450 Crates Available',
    icon: Snowflake,
  },
  {
    name: 'Narayangaon Collection Centre',
    category: 'Collection Centres',
    distance: '14 km',
    transit: '~22 mins away',
    detailLabel: 'Service',
    detail: 'Produce collection point',
    icon: MapPin,
  },
] as const;

export default function MapsPage() {
  const [activeCategory, setActiveCategory] = useState<Category>('All Mandis');
  const [search, setSearch] = useState('');

  const filteredDestinations = useMemo(() => {
    const query = search.trim().toLowerCase();
    return destinations.filter((destination) => {
      const matchesCategory =
        activeCategory === 'All Mandis' ||
        destination.category === activeCategory;
      const matchesSearch =
        !query ||
        destination.name.toLowerCase().includes(query) ||
        destination.detail.toLowerCase().includes(query);
      return matchesCategory && matchesSearch;
    });
  }, [activeCategory, search]);

  return (
    <div className="min-h-screen bg-[#F7F8F2] font-sans text-[#26352B]">
      <Navbar />

      <main className="mx-auto w-full max-w-7xl space-y-8 px-4 py-8 sm:px-6 lg:px-8">
        <header>
          <h1 className="font-serif text-3xl tracking-tight sm:text-4xl">
            Maps &amp; Mandi Navigation
          </h1>
          <p className="mt-2 text-[#26352B]/70">
            Locate nearby APMC yards, collection centres, and verified cold
            storages
          </p>
        </header>

        <div className="grid items-start gap-5 lg:grid-cols-2">
          <section
            aria-label="Nearby destinations"
            className="space-y-4 rounded-2xl border border-[#DFE5DA] bg-white p-5 shadow-sm sm:p-6"
          >
            <div className="flex flex-wrap gap-2">
              {categories.map((category) => {
                const isActive = activeCategory === category;
                return (
                  <button
                    key={category}
                    type="button"
                    aria-pressed={isActive}
                    onClick={() => setActiveCategory(category)}
                    className={`rounded-full border px-3 py-2 text-xs font-semibold transition-colors sm:text-sm ${
                      isActive
                        ? 'border-[#246B45] bg-[#246B45] text-white'
                        : 'border-[#DFE5DA] bg-white text-[#26352B] hover:bg-[#E8EFE4]'
                    }`}
                  >
                    {category}
                  </button>
                );
              })}
            </div>

            <label className="relative block">
              <span className="sr-only">Search destinations</span>
              <Search
                className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#26352B]/50"
                aria-hidden="true"
              />
              <input
                type="search"
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Search market or warehouse by name..."
                className="w-full rounded-xl border border-[#DFE5DA] bg-white py-3 pl-10 pr-3 text-sm outline-none placeholder:text-[#26352B]/50 focus:border-[#246B45]"
              />
            </label>

            <div className="space-y-3">
              {filteredDestinations.map((destination) => {
                const Icon = destination.icon;
                return (
                  <article
                    key={destination.name}
                    className="rounded-xl border border-[#DFE5DA] bg-white p-4"
                  >
                    <div className="flex items-start gap-3">
                      <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#E8EFE4] text-[#246B45]">
                        <Icon className="h-5 w-5" />
                      </span>
                      <div className="min-w-0 flex-1">
                        <h2 className="font-semibold">{destination.name}</h2>
                        <div className="mt-1.5 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-[#26352B]/70">
                          <span className="inline-flex items-center gap-1">
                            <MapPin className="h-3.5 w-3.5 text-[#76A94C]" />
                            {destination.distance}
                          </span>
                          <span className="inline-flex items-center gap-1">
                            <Clock3 className="h-3.5 w-3.5 text-[#76A94C]" />
                            {destination.transit}
                          </span>
                        </div>
                        <p className="mt-2 text-sm">
                          <span className="text-[#26352B]/65">
                            {destination.detailLabel}:{' '}
                          </span>
                          <span className="font-semibold text-[#246B45]">
                            {destination.detail}
                          </span>
                        </p>
                      </div>
                    </div>
                    <Link
                      href="/calculator"
                      className="mt-3 inline-flex items-center gap-1.5 text-sm font-semibold text-[#246B45] hover:underline"
                    >
                      Calculate Route Net Profit
                      <ArrowRight className="h-4 w-4" />
                    </Link>
                  </article>
                );
              })}
              {filteredDestinations.length === 0 && (
                <p className="rounded-xl border border-[#DFE5DA] bg-[#F7F8F2] p-4 text-sm text-[#26352B]/70">
                  No destinations match your search.
                </p>
              )}
            </div>
          </section>

          <section
            aria-label="Route map and travel estimate"
            className="flex flex-col justify-between rounded-2xl border border-[#DFE5DA] bg-white p-5 shadow-sm sm:p-6"
          >
            <div>
              <div className="relative flex h-80 flex-col items-center justify-center overflow-hidden rounded-xl border border-[#DFE5DA] bg-[#E8EFE4] p-4 text-center">
                <svg
                  aria-hidden="true"
                  className="absolute inset-0 h-full w-full text-white/80"
                  viewBox="0 0 640 320"
                  preserveAspectRatio="none"
                >
                  <path
                    d="M-20 72 C130 110 175 10 290 62 S450 140 660 58"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="18"
                  />
                  <path
                    d="M-20 270 C120 220 165 300 290 245 S470 195 660 260"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="12"
                  />
                  <path
                    d="M-15 72 C145 118 188 42 310 94 S440 146 655 92"
                    fill="none"
                    stroke="#76A94C"
                    strokeDasharray="9 8"
                    strokeLinecap="round"
                    strokeWidth="4"
                  />
                  <path
                    d="M80 0 L160 320 M520 0 L440 320"
                    fill="none"
                    stroke="#DFE5DA"
                    strokeWidth="2"
                  />
                </svg>

                <div className="relative z-10 flex w-full max-w-sm items-center justify-between gap-4">
                  <div className="rounded-xl border border-[#DFE5DA] bg-white px-3 py-2 shadow-sm">
                    <MapPin className="mx-auto h-5 w-5 text-[#246B45]" />
                    <p className="mt-1 text-xs font-semibold">Your Farm</p>
                    <p className="text-[11px] text-[#26352B]/65">Junnar</p>
                  </div>
                  <span className="rounded-full bg-[#246B45] px-3 py-1.5 text-xs font-semibold text-white shadow-sm">
                    85 km via NH60
                  </span>
                  <div className="rounded-xl border border-[#DFE5DA] bg-white px-3 py-2 shadow-sm">
                    <Warehouse className="mx-auto h-5 w-5 text-[#246B45]" />
                    <p className="mt-1 text-xs font-semibold">Pune APMC</p>
                    <p className="text-[11px] text-[#26352B]/65">Gultekdi</p>
                  </div>
                </div>
                <div className="relative z-10 mt-8 inline-flex items-center gap-2 rounded-full border border-[#DFE5DA] bg-white px-4 py-2 text-xs font-semibold text-[#246B45] shadow-sm sm:text-sm">
                  <Navigation className="h-4 w-4" />
                  Fastest Route: 2h 10m (Traffic Normal)
                </div>
              </div>
            </div>

            <div className="mt-4 rounded-xl border border-[#DFE5DA] bg-[#F7F8F2] p-4">
              <h2 className="font-serif text-lg font-semibold">
                Route Summary
              </h2>
              <div className="mt-3 space-y-2 text-sm">
                <p className="flex flex-wrap justify-between gap-1">
                  <span className="text-[#26352B]/70">Estimated Freight</span>
                  <span className="font-semibold text-[#26352B]">
                    ₹1,530
                    <span className="ml-1 font-normal text-[#26352B]/65">
                      (₹18/km light commercial vehicle)
                    </span>
                  </span>
                </p>
                <p className="flex flex-wrap justify-between gap-1">
                  <span className="text-[#26352B]/70">
                    Estimated Transit Spoilage
                  </span>
                  <span className="font-semibold text-[#26352B]">5%</span>
                </p>
                <p className="text-xs text-[#26352B]/65">
                  Recommended dispatch before 11:00 AM.
                </p>
              </div>
              <a
                href="https://www.google.com/maps/dir/?api=1&origin=Junnar%2C+Maharashtra&destination=Gultekdi+Market+Yard%2C+Pune%2C+Maharashtra&travelmode=driving"
                target="_blank"
                rel="noopener noreferrer"
                className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl bg-[#246B45] px-4 py-2.5 text-center text-sm font-semibold text-white transition-colors hover:bg-[#1e5838]"
              >
                Open in Google Maps / External GPS
                <ArrowRight className="h-4 w-4" />
              </a>
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}
