import Link from 'next/link';
import {
  ArrowRight,
  CalendarDays,
  MapPin,
  Plus,
  Sprout,
} from 'lucide-react';
import AppShell from '@/components/AppShell';

const farms = [
  {
    name: 'Main Farm — Plot A',
    location: 'Junnar, Maharashtra',
    area: '3.5 Acres',
    soil: 'Loamy Soil',
    crop: 'Hybrid Tomato',
    cropDay: 'Day 65 / 90',
    progress: 72,
    harvest: 'In 25 days',
    estimate: '~500 kg estimated',
  },
  {
    name: 'Riverside Farm — Plot B',
    location: 'Narayangaon, Maharashtra',
    area: '2.0 Acres',
    soil: 'Black Soil',
    crop: 'Red Onion',
    cropDay: 'Day 45 / 120',
    progress: 37,
    harvest: 'In 75 days',
  },
];

export default function FarmsPage() {
  return (
    <AppShell>
      <main className="mx-auto w-full max-w-7xl space-y-8 px-4 py-8 sm:px-6 lg:px-8">
        <header className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h1 className="font-serif text-3xl tracking-tight sm:text-4xl">
              My Farms &amp; Crops
            </h1>
            <p className="mt-2 text-[#26352B]/70">
              Track your land parcels, active crops, and harvest dates
            </p>
          </div>
          <Link
            href="/farms/setup"
            className="inline-flex items-center justify-center gap-2 self-start rounded-xl bg-[#246B45] px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-[#1d5738] sm:self-auto"
          >
            <Plus className="h-4 w-4" />
            Add New Parcel
          </Link>
        </header>

        <section
          aria-label="Farm parcels"
          className="grid gap-5 lg:grid-cols-2"
        >
          {farms.map((farm) => (
            <article
              key={farm.name}
              className="rounded-2xl border border-[#DFE5DA] bg-white p-6 shadow-sm"
            >
              <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#E8EFE4] text-[#246B45]">
                      <Sprout className="h-5 w-5" />
                    </span>
                    <h2 className="font-serif text-2xl font-semibold">
                      {farm.name}
                    </h2>
                  </div>
                  <p className="mt-3 flex items-center gap-1.5 text-sm text-[#26352B]/70">
                    <MapPin className="h-4 w-4 text-[#76A94C]" />
                    {farm.location}
                  </p>
                </div>
                <span className="self-start rounded-full bg-[#E8EFE4] px-3 py-1 text-xs font-semibold text-[#246B45]">
                  Active
                </span>
              </div>

              <div className="mt-5 flex flex-wrap gap-2">
                {[farm.area, farm.soil].map((detail) => (
                  <span
                    key={detail}
                    className="rounded-full border border-[#DFE5DA] bg-[#F7F8F2] px-3 py-1 text-xs font-medium text-[#26352B]/80"
                  >
                    {detail}
                  </span>
                ))}
              </div>

              <div className="mt-6 rounded-xl bg-[#F7F8F2] p-4">
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <p className="text-xs font-medium text-[#26352B]/65">
                      Active Crop
                    </p>
                    <h3 className="mt-1 font-semibold">{farm.crop}</h3>
                  </div>
                  <span className="text-sm font-medium text-[#26352B]/70">
                    {farm.cropDay}
                  </span>
                </div>
                <div
                  className="mt-4 h-2.5 overflow-hidden rounded-full bg-[#DFE5DA]"
                  role="progressbar"
                  aria-label={`${farm.crop} growth progress`}
                  aria-valuemin={0}
                  aria-valuemax={100}
                  aria-valuenow={farm.progress}
                >
                  <div
                    className="h-full rounded-full bg-[#76A94C]"
                    style={{ width: `${farm.progress}%` }}
                  />
                </div>
                <p className="mt-1.5 text-right text-xs font-semibold text-[#246B45]">
                  {farm.progress}%
                </p>
              </div>

              <div className="mt-4 flex items-start gap-3 rounded-xl border border-[#DFE5DA] p-4">
                <CalendarDays className="mt-0.5 h-5 w-5 shrink-0 text-[#76A94C]" />
                <div>
                  <p className="text-xs font-medium text-[#26352B]/65">
                    Expected Harvest
                  </p>
                  <p className="mt-1 font-semibold">{farm.harvest}</p>
                  {farm.estimate && (
                    <p className="mt-0.5 text-sm text-[#26352B]/70">
                      {farm.estimate}
                    </p>
                  )}
                </div>
              </div>
            </article>
          ))}
        </section>

        <div className="rounded-2xl border border-[#DFE5DA] bg-[#E8EFE4] p-5 sm:p-6">
          <Link
            href="/calculator"
            className="group flex flex-wrap items-center justify-between gap-3 font-semibold text-[#246B45]"
          >
            <span>Ready to sell current harvest? Open Profit Calculator</span>
            <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
          </Link>
        </div>
      </main>
    </AppShell>
  );
}
