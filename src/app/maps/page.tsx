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
  Truck,
  Warehouse,
} from 'lucide-react';
import AppShell from '@/components/AppShell';

const categories = ['All Mandis', 'Cold Storage', 'Collection Centres'] as const;
type Category = (typeof categories)[number];
type MapTab = 'finder' | 'tracker';

const destinations = [
  {
    name: 'Junnar APMC Yard',
    category: 'All Mandis',
    distance: '8 km',
    transit: '~15 mins',
    detailLabel: 'Modal Rate',
    detail: '₹2,400/Q',
    icon: Warehouse,
    pin: 'left-[18%] top-[61%]',
    maps: 'Junnar APMC Yard, Maharashtra',
  },
  {
    name: 'Narayangaon Tomato Market',
    category: 'All Mandis',
    distance: '16 km',
    transit: '~25 mins',
    detailLabel: 'Modal Rate',
    detail: '₹2,600/Q',
    icon: Warehouse,
    pin: 'left-[43%] top-[39%]',
    maps: 'Narayangaon Market, Maharashtra',
  },
  {
    name: 'Pune Gultekdi APMC',
    category: 'All Mandis',
    distance: '85 km',
    transit: '~2h 10m',
    detailLabel: 'Modal Rate',
    detail: '₹2,800/Q',
    icon: Warehouse,
    pin: 'left-[77%] top-[24%]',
    maps: 'Gultekdi Market Yard, Pune, Maharashtra',
  },
  {
    name: 'Sahyadri Agri Cold Storage',
    category: 'Cold Storage',
    distance: '12 km',
    transit: '~20 mins',
    detailLabel: 'Indicative Capacity',
    detail: '450 Crates (sample listing)',
    icon: Snowflake,
    pin: 'left-[29%] top-[28%]',
    maps: 'Junnar, Maharashtra',
  },
  {
    name: 'Narayangaon Collection Centre',
    category: 'Collection Centres',
    distance: '14 km',
    transit: '~22 mins',
    detailLabel: 'Listing',
    detail: 'Example collection point',
    icon: MapPin,
    pin: 'left-[57%] top-[70%]',
    maps: 'Narayangaon, Maharashtra',
  },
] as const;

export default function MapsPage() {
  const [tab, setTab] = useState<MapTab>('finder');
  const [activeCategory, setActiveCategory] = useState<Category>('All Mandis');
  const [search, setSearch] = useState('');
  const [selectedDestination, setSelectedDestination] =
    useState<(typeof destinations)[number]>(destinations[2]);
  const [trackingStep, setTrackingStep] = useState(1);

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

  const routeSteps = ['Farm (Junnar)', 'En Route NH60', 'Pune APMC'];

  return (
    <AppShell>
      <main className="mx-auto w-full max-w-7xl space-y-8 px-4 py-8 sm:px-6 lg:px-8">
        <header>
          <h1 className="font-serif text-3xl tracking-tight sm:text-4xl">
            Maps &amp; Mandi Navigation
          </h1>
          <p className="mt-2 text-[#26352B]/70">
            Find market and storage listings or view a sample dispatch route.
          </p>
        </header>

        <div
          role="tablist"
          aria-label="Map tools"
          className="flex flex-wrap gap-2"
        >
          <button
            type="button"
            role="tab"
            aria-selected={tab === 'finder'}
            onClick={() => setTab('finder')}
            className={`rounded-xl px-4 py-2.5 text-sm font-semibold ${
              tab === 'finder'
                ? 'bg-[#246B45] text-white'
                : 'border border-[#DFE5DA] bg-white hover:bg-[#E8EFE4]'
            }`}
          >
            Mandi &amp; Godown Finder
          </button>
          <button
            type="button"
            role="tab"
            aria-selected={tab === 'tracker'}
            onClick={() => setTab('tracker')}
            className={`rounded-xl px-4 py-2.5 text-sm font-semibold ${
              tab === 'tracker'
                ? 'bg-[#246B45] text-white'
                : 'border border-[#DFE5DA] bg-white hover:bg-[#E8EFE4]'
            }`}
          >
            Live Order Route Tracker
          </button>
        </div>
        {tab === 'finder' ? (
          <div className="grid items-start gap-5 lg:grid-cols-2">
            <section
              aria-label="Nearby market and facility listings"
              className="space-y-4 rounded-2xl border border-[#DFE5DA] bg-white p-5 shadow-sm sm:p-6"
            >
              <div className="flex flex-wrap gap-2">
                {categories.map((category) => (
                  <button
                    key={category}
                    type="button"
                    aria-pressed={activeCategory === category}
                    onClick={() => setActiveCategory(category)}
                    className={`rounded-full border px-3 py-2 text-xs font-semibold sm:text-sm ${
                      activeCategory === category
                        ? 'border-[#246B45] bg-[#246B45] text-white'
                        : 'border-[#DFE5DA] bg-white hover:bg-[#E8EFE4]'
                    }`}
                  >
                    {category}
                  </button>
                ))}
              </div>
              <label className="relative block">
                <span className="sr-only">Search places</span>
                <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#26352B]/50" />
                <input
                  type="search"
                  value={search}
                  onChange={(event) => setSearch(event.target.value)}
                  placeholder="Search market or godown..."
                  className="w-full rounded-xl border border-[#DFE5DA] py-3 pl-10 pr-3 text-sm outline-none focus:border-[#246B45]"
                />
              </label>

              <p className="rounded-xl bg-[#E8CFA3]/30 p-3 text-xs leading-5 text-[#26352B]/75">
                Locations and capacities shown here are sample listings, not
                independently verified. Confirm details before travelling.
              </p>

              <div className="space-y-3">
                {filteredDestinations.map((destination) => {
                  const Icon = destination.icon;
                  const selected = selectedDestination.name === destination.name;
                  return (
                    <article
                      key={destination.name}
                      className={`rounded-xl border p-4 ${
                        selected
                          ? 'border-[#246B45] bg-[#E8EFE4]/50'
                          : 'border-[#DFE5DA] bg-white'
                      }`}
                    >
                      <button
                        type="button"
                        onClick={() => setSelectedDestination(destination)}
                        className="flex w-full items-start gap-3 text-left"
                        aria-pressed={selected}
                      >
                        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#E8EFE4] text-[#246B45]">
                          <Icon className="h-5 w-5" />
                        </span>
                        <span className="min-w-0 flex-1">
                          <span className="block font-semibold">
                            {destination.name}
                          </span>
                          <span className="mt-1.5 flex flex-wrap gap-x-3 text-xs text-[#26352B]/70">
                            <span>{destination.distance}</span>
                            <span className="inline-flex items-center gap-1">
                              <Clock3 className="h-3.5 w-3.5" />
                              {destination.transit}
                            </span>
                          </span>
                          <span className="mt-2 block text-sm">
                            {destination.detailLabel}:{' '}
                            <span className="font-semibold text-[#246B45]">
                              {destination.detail}
                            </span>
                          </span>
                        </span>
                      </button>
                      <Link
                        href="/calculator"
                        className="mt-3 inline-flex items-center gap-1.5 text-sm font-semibold text-[#246B45]"
                      >
                        Calculate Route Net Profit
                        <ArrowRight className="h-4 w-4" />
                      </Link>
                    </article>
                  );
                })}
                {filteredDestinations.length === 0 && (
                  <p className="rounded-xl bg-[#F7F8F2] p-4 text-sm">
                    No matching places found.
                  </p>
                )}
              </div>
            </section>

            <section
              aria-label="Interactive sample map"
              className="rounded-2xl border border-[#DFE5DA] bg-white p-5 shadow-sm sm:p-6"
            >
              <div className="relative h-80 overflow-hidden rounded-xl border border-[#DFE5DA] bg-[#E8EFE4]">
                <div className="absolute inset-0 opacity-80">
                  <svg
                    aria-hidden="true"
                    viewBox="0 0 640 320"
                    preserveAspectRatio="none"
                    className="h-full w-full"
                  >
                    <path
                      d="M-20 240 C130 270 180 100 300 160 S480 40 660 90 M20 20 L250 320 M430 0 L350 320 M0 110 L640 250"
                      fill="none"
                      stroke="white"
                      strokeWidth="13"
                    />
                    <path
                      d="M80 270 C180 220 190 135 330 155 S475 70 570 74"
                      fill="none"
                      stroke="#76A94C"
                      strokeDasharray="8 7"
                      strokeLinecap="round"
                      strokeWidth="4"
                    />
                  </svg>
                </div>
                {destinations.map((destination, index) => (
                  <button
                    key={destination.name}
                    type="button"
                    title={destination.name}
                    aria-label={`Select ${destination.name} map pin`}
                    onClick={() => setSelectedDestination(destination)}
                    className={`absolute ${destination.pin} z-10 flex h-9 w-9 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border-2 border-white shadow-md ${
                      selectedDestination.name === destination.name
                        ? 'bg-[#246B45] text-white ring-4 ring-[#246B45]/25'
                        : index === 3
                          ? 'bg-[#E8CFA3] text-[#26352B]'
                          : 'bg-[#76A94C] text-white'
                    }`}
                  >
                    {index === 3 ? (
                      <Snowflake className="h-4 w-4" />
                    ) : (
                      <MapPin className="h-4 w-4" />
                    )}
                  </button>
                ))}
                <div className="absolute bottom-3 left-3 right-3 rounded-xl border border-[#DFE5DA] bg-white/95 p-3 shadow-sm">
                  <p className="text-xs text-[#26352B]/60">
                    Selected sample listing
                  </p>
                  <p className="font-semibold">{selectedDestination.name}</p>
                  <p className="text-xs text-[#26352B]/65">
                    Not a surveyed map or live route.
                  </p>
                </div>
              </div>
              <a
                href={`https://www.google.com/maps/dir/?api=1&origin=Junnar%2C+Maharashtra&destination=${encodeURIComponent(selectedDestination.maps)}&travelmode=driving`}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl bg-[#246B45] px-4 py-2.5 text-sm font-semibold text-white hover:bg-[#1e5838]"
              >
                <Navigation className="h-4 w-4" />
                Navigate with Google Maps
              </a>
            </section>
          </div>
        ) : (
          <section className="rounded-2xl border border-[#DFE5DA] bg-white p-6 shadow-sm">
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div>
                <span className="rounded-full bg-[#E8CFA3]/50 px-3 py-1 text-xs font-semibold">
                  DEMONSTRATION · NOT LIVE GPS
                </span>
                <h2 className="mt-3 font-serif text-2xl font-semibold">
                  Order Route: Farm to Pune APMC
                </h2>
                <p className="mt-1 text-sm text-[#26352B]/70">
                  Sample progress display; no vehicle tracking service is connected.
                </p>
              </div>
              <Truck className="h-8 w-8 text-[#246B45]" />
            </div>

            <div className="mt-8">
              <div
                role="progressbar"
                aria-label="Demonstration dispatch progress"
                aria-valuemin={0}
                aria-valuemax={100}
                aria-valuenow={trackingStep * 50}
                className="h-3 overflow-hidden rounded-full bg-[#DFE5DA]"
              >
                <div
                  className="h-full rounded-full bg-[#76A94C] transition-all"
                  style={{ width: `${trackingStep * 50}%` }}
                />
              </div>
              <div className="mt-4 grid grid-cols-3 gap-3 text-center text-xs font-medium sm:text-sm">
                {routeSteps.map((step, index) => (
                  <div
                    key={step}
                    className={
                      index <= trackingStep
                        ? 'text-[#246B45]'
                        : 'text-[#26352B]/50'
                    }
                  >
                    <span
                      className={`mx-auto mb-2 flex h-8 w-8 items-center justify-center rounded-full ${
                        index <= trackingStep
                          ? 'bg-[#246B45] text-white'
                          : 'bg-[#E8EFE4] text-[#26352B]/60'
                      }`}
                    >
                      {index + 1}
                    </span>
                    {step}
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-6 grid gap-3 sm:grid-cols-3">
              <div className="rounded-xl bg-[#F7F8F2] p-4">
                <p className="text-xs text-[#26352B]/60">Sample ETA</p>
                <p className="mt-1 font-semibold">45 mins</p>
              </div>
              <div className="rounded-xl bg-[#F7F8F2] p-4">
                <p className="text-xs text-[#26352B]/60">Driver contact</p>
                <p className="mt-1 font-semibold">Not connected</p>
              </div>
              <div className="rounded-xl bg-[#F7F8F2] p-4">
                <p className="text-xs text-[#26352B]/60">Vehicle number</p>
                <p className="mt-1 font-semibold">Demo vehicle</p>
              </div>
            </div>
            <button
              type="button"
              onClick={() =>
                setTrackingStep((step) => (step + 1) % routeSteps.length)
              }
              className="mt-5 rounded-xl border border-[#DFE5DA] bg-[#E8EFE4] px-4 py-2.5 text-sm font-semibold text-[#246B45]"
            >
              Advance demo route
            </button>
          </section>
        )}
      </main>
    </AppShell>
  );
}
