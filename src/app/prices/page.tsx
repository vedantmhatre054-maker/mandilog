'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { ArrowUpRight, BadgeInfo, BadgeCheck } from 'lucide-react';
import Navbar from '@/components/Navbar';
import {
  getCachedMandiPrices,
  MandiPriceRecord,
  sortMandiPrices,
} from '@/lib/mandiPrices';

const demonstrationPrices: MandiPriceRecord[] = [
  {
    market: 'Pune (APMC)',
    commodity: 'Tomato',
    variety: 'Hybrid',
    modalPricePerQuintal: 2800,
    reportedOn: 'Demonstration only',
    source: 'demonstration',
    fetchedAt: '',
  },
  {
    market: 'Narayangaon',
    commodity: 'Tomato',
    variety: 'Hybrid',
    modalPricePerQuintal: 2600,
    reportedOn: 'Demonstration only',
    source: 'demonstration',
    fetchedAt: '',
  },
  {
    market: 'Junnar (Local)',
    commodity: 'Tomato',
    variety: 'Local',
    modalPricePerQuintal: 2400,
    reportedOn: 'Demonstration only',
    source: 'demonstration',
    fetchedAt: '',
  },
  {
    market: 'Ahilyanagar',
    commodity: 'Tomato',
    variety: 'Hybrid',
    modalPricePerQuintal: 2750,
    reportedOn: 'Demonstration only',
    source: 'demonstration',
    fetchedAt: '',
  },
  {
    market: 'Mumbai (Vashi)',
    commodity: 'Tomato',
    variety: 'Hybrid',
    modalPricePerQuintal: 3200,
    reportedOn: 'Demonstration only',
    source: 'demonstration',
    fetchedAt: '',
  },
];

export default function PricesPage() {
  const [officialPrices, setOfficialPrices] = useState<MandiPriceRecord[]>([]);
  const [commodity, setCommodity] = useState('Tomato');
  const [reportingDate, setReportingDate] = useState('Any date');

  useEffect(() => {
    setOfficialPrices(getCachedMandiPrices());
  }, []);

  const displayedPrices = useMemo(() => {
    const records =
      officialPrices.length > 0 ? officialPrices : demonstrationPrices;
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
  }, [commodity, officialPrices, reportingDate]);
  const showingOfficial = displayedPrices.some(
    (record) => record.source === 'official',
  );

  return (
    <div className="min-h-screen bg-[#F7F8F2] text-[#26352B] font-sans">
      <Navbar />
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
              ? 'Showing cached official records, sorted by highest modal price.'
              : 'Sorted by highest modal rate. Example data only; not a current quote.'}
          </div>
        </section>

        {!showingOfficial && (
          <div
            role="status"
            className="flex items-start gap-3 rounded-xl border border-[#DFE5DA] bg-[#E8CFA3]/30 p-4 text-sm leading-6"
          >
            <BadgeInfo className="mt-0.5 h-5 w-5 shrink-0 text-[#246B45]" />
            <p>
              No official price feed is configured or cached on this device.
              AGMARKNET&apos;s public API denied unauthenticated access during
              verification. The rows below are illustrative examples, not live
              prices or verified AGMARKNET data.
            </p>
          </div>
        )}

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
                {displayedPrices.map((row) => (
                  <tr key={`${row.market}-${row.commodity}`}>
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
                      No cached records for {commodity}. The illustrative
                      examples currently cover tomatoes only.
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
              : 'Demonstration records · not verified by AGMARKNET'}
          </span>
        </div>
      </main>
    </div>
  );
}
