'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { ArrowUpRight, BadgeInfo, BadgeCheck } from 'lucide-react';
import AppShell from '@/components/AppShell';
import {
  getCachedMandiPrices,
  MandiPriceRecord,
  sortMandiPrices,
} from '@/lib/mandiPrices';

const referenceBenchmarks: MandiPriceRecord[] = [
  {
    market: 'Junnar',
    commodity: 'Tomato',
    variety: 'Hybrid',
    modalPricePerQuintal: 2400,
    reportedOn: 'Reference benchmark · not live',
    source: 'demonstration',
    fetchedAt: '',
  },
  {
    market: 'Pune APMC',
    commodity: 'Tomato',
    variety: 'Hybrid',
    modalPricePerQuintal: 2800,
    reportedOn: 'Reference benchmark · not live',
    source: 'demonstration',
    fetchedAt: '',
  },
  {
    market: 'Mumbai (Vashi)',
    commodity: 'Tomato',
    variety: 'Local',
    modalPricePerQuintal: 3200,
    reportedOn: 'Reference benchmark · not live',
    source: 'demonstration',
    fetchedAt: '',
  },
];

export default function PricesPage() {
  const [cachedPrices, setCachedPrices] = useState<MandiPriceRecord[]>([]);
  const [commodity, setCommodity] = useState('Tomato');
  const [reportingDate, setReportingDate] = useState('Any date');

  useEffect(() => {
    setCachedPrices(getCachedMandiPrices());
  }, []);

  const displayedPrices = useMemo(() => {
    const records =
      cachedPrices.length > 0 ? cachedPrices : referenceBenchmarks;
    const sortedRecords = sortMandiPrices(records, commodity);
    if (reportingDate === 'Any date') return sortedRecords;
    const today = new Date();
    return sortedRecords.filter((record) => {
      const reportDate = new Date(record.reportedOn);
      if (Number.isNaN(reportDate.getTime())) return false;
      if (reportingDate === 'Today') {
        return reportDate.toDateString() === today.toDateString();
      }
      const oneWeekAgo = new Date(today);
      oneWeekAgo.setDate(today.getDate() - 7);
      return reportDate >= oneWeekAgo && reportDate <= today;
    });
  }, [cachedPrices, commodity, reportingDate]);
  const showingOfficial = displayedPrices.some(
    (record) => record.source === 'official',
  );

  return (
    <AppShell>
      <main className="mx-auto w-full max-w-7xl space-y-8 px-4 py-10 sm:px-6 lg:px-8">
        <header>
          <h1 className="font-serif text-3xl tracking-tight sm:text-4xl">
            Mandi Prices
          </h1>
          <p className="mt-2 text-[#26352B]/75">
            Compare Maharashtra market rates. Official live data is shown only
            when available.
          </p>
        </header>

        <section
          aria-label="Price filters"
          className="grid gap-4 rounded-2xl border border-[#DFE5DA] bg-white p-4 shadow-sm sm:grid-cols-2 lg:grid-cols-4"
        >
          <label className="space-y-1.5 text-sm font-medium">
            <span>Commodity</span>
            <select
              value={commodity}
              onChange={(event) => setCommodity(event.target.value)}
              className="w-full rounded-xl border border-[#DFE5DA] bg-[#F7F8F2] px-3 py-2.5 font-normal outline-none focus:border-[#246B45]"
            >
              <option>Tomato</option>
              <option>Onion</option>
              <option>Wheat</option>
            </select>
          </label>
          <label className="space-y-1.5 text-sm font-medium">
            <span>State</span>
            <select
              defaultValue="Maharashtra"
              className="w-full rounded-xl border border-[#DFE5DA] bg-[#F7F8F2] px-3 py-2.5 font-normal outline-none focus:border-[#246B45]"
            >
              <option>Maharashtra</option>
            </select>
          </label>
          <label className="space-y-1.5 text-sm font-medium">
            <span>Reporting Date</span>
            <select
              value={reportingDate}
              onChange={(event) => setReportingDate(event.target.value)}
              className="w-full rounded-xl border border-[#DFE5DA] bg-[#F7F8F2] px-3 py-2.5 font-normal outline-none focus:border-[#246B45]"
            >
              <option>Any date</option>
              <option>Today</option>
              <option>Last 7 days</option>
            </select>
          </label>
          <div className="flex items-end text-sm text-[#26352B]/70">
            {showingOfficial
              ? 'Cached official records · sorted by highest modal price.'
              : 'Reference benchmarks · sorted by rate, not current quotes.'}
          </div>
        </section>

        <section
          aria-label="Mandi prices sorted by modal price"
          className="overflow-hidden rounded-2xl border border-[#DFE5DA] bg-white shadow-sm"
        >
          <div className="overflow-x-auto">
            <table className="w-full min-w-[760px] border-collapse text-left text-sm">
              <thead className="bg-[#E8EFE4] text-xs uppercase tracking-wide text-[#26352B]/80">
                <tr>
                  <th scope="col" className="px-5 py-4 font-semibold">
                    Market Name
                  </th>
                  <th scope="col" className="px-5 py-4 font-semibold">
                    Commodity / Variety
                  </th>
                  <th scope="col" className="px-5 py-4 font-semibold">
                    Modal Price (₹/Quintal)
                  </th>
                  <th scope="col" className="px-5 py-4 font-semibold">
                    Reported
                  </th>
                  <th scope="col" className="px-5 py-4 font-semibold">
                    Action
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#DFE5DA]">
                {displayedPrices.map((row, index) => (
                  <tr
                    key={`${row.market}-${row.commodity}`}
                    className={index % 2 === 0 ? 'bg-white' : 'bg-[#F7F8F2]'}
                  >
                    <td className="px-5 py-4 font-semibold">{row.market}</td>
                    <td className="px-5 py-4">
                      {row.commodity} · {row.variety}
                    </td>
                    <td className="px-5 py-4 font-semibold text-[#246B45]">
                      ₹{row.modalPricePerQuintal.toLocaleString('en-IN')}
                    </td>
                    <td className="px-5 py-4">{row.reportedOn}</td>
                    <td className="px-5 py-4">
                      <Link
                        href="/calculator"
                        className="inline-flex items-center gap-1 whitespace-nowrap rounded-xl bg-[#246B45] px-3 py-2 text-xs font-semibold text-white transition-colors hover:bg-[#1d5738]"
                      >
                        Calculate Net Return
                        <ArrowUpRight className="h-3.5 w-3.5" />
                      </Link>
                    </td>
                  </tr>
                ))}
                {displayedPrices.length === 0 && (
                  <tr>
                    <td
                      colSpan={5}
                      className="px-5 py-8 text-center text-[#26352B]/70"
                    >
                      No cached or reference records for {commodity}.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </section>

        <div className="flex items-center justify-center gap-2 text-sm text-[#26352B]/70">
          {showingOfficial ? (
            <BadgeCheck className="h-5 w-5 text-[#76A94C]" />
          ) : (
            <BadgeInfo className="h-5 w-5 text-[#76A94C]" />
          )}
          <span>
            {showingOfficial
              ? 'Cached official market-price records'
              : 'Reference values for planning · not verified live AGMARKNET data'}
          </span>
        </div>
      </main>
    </AppShell>
  );
}
