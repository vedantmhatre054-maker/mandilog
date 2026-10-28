import Link from 'next/link';
import { BadgeCheck, ArrowUpRight } from 'lucide-react';
import Navbar from '@/components/Navbar';

const marketPrices = [
  { market: 'Pune (APMC)', variety: 'Hybrid', price: '₹2,800' },
  { market: 'Narayangaon', variety: 'Hybrid', price: '₹2,600' },
  { market: 'Junnar (Local)', variety: 'Local', price: '₹2,400' },
  { market: 'Ahilyanagar', variety: 'Hybrid', price: '₹2,750' },
  { market: 'Mumbai (Vashi)', variety: 'Hybrid', price: '₹3,200' },
];

export default function PricesPage() {
  return (
    <div className="min-h-screen bg-[#F7F8F2] text-[#26352B] font-sans">
      <Navbar />
      <main className="mx-auto w-full max-w-7xl space-y-8 px-4 py-10 sm:px-6 lg:px-8">
        <header>
          <h1 className="font-serif text-3xl tracking-tight sm:text-4xl">
            Live Mandi Prices
          </h1>
          <p className="mt-2 text-[#26352B]/75">
            Benchmark prices across Maharashtra APMCs
          </p>
        </header>

        <section
          aria-label="Price filters"
          className="grid gap-4 rounded-2xl border border-[#DFE5DA] bg-white p-4 sm:grid-cols-3"
        >
          <label className="space-y-1.5 text-sm font-medium">
            <span>Crop</span>
            <select
              defaultValue="Tomato"
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
            <span>Date</span>
            <select
              defaultValue="Today"
              className="w-full rounded-xl border border-[#DFE5DA] bg-[#F7F8F2] px-3 py-2.5 font-normal outline-none focus:border-[#246B45]"
            >
              <option>Today</option>
            </select>
          </label>
        </section>

        <section
          aria-label="Mandi prices"
          className="overflow-hidden rounded-2xl border border-[#DFE5DA] bg-white"
        >
          <div className="overflow-x-auto">
            <table className="w-full min-w-[760px] border-collapse text-left text-sm">
              <thead className="bg-[#E8EFE4] text-xs uppercase tracking-wide text-[#26352B]/80">
                <tr>
                  <th scope="col" className="px-5 py-4 font-semibold">
                    Market Name
                  </th>
                  <th scope="col" className="px-5 py-4 font-semibold">
                    Variety
                  </th>
                  <th scope="col" className="px-5 py-4 font-semibold">
                    Price (₹/Quintal)
                  </th>
                  <th scope="col" className="px-5 py-4 font-semibold">
                    Reporting Date
                  </th>
                  <th scope="col" className="px-5 py-4 font-semibold">
                    Action
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#DFE5DA]">
                {marketPrices.map((row) => (
                  <tr key={row.market} className="hover:bg-[#F7F8F2]/70">
                    <td className="px-5 py-4 font-semibold">{row.market}</td>
                    <td className="px-5 py-4">{row.variety}</td>
                    <td className="px-5 py-4 font-semibold text-[#246B45]">
                      {row.price}
                    </td>
                    <td className="px-5 py-4">Today</td>
                    <td className="px-5 py-4">
                      <Link
                        href="/calculator"
                        className="inline-flex items-center gap-1 whitespace-nowrap rounded-lg bg-[#246B45] px-3 py-2 text-xs font-semibold text-white transition-colors hover:bg-[#1d5738]"
                      >
                        Calculate Net Return
                        <ArrowUpRight className="h-3.5 w-3.5" />
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <div className="flex items-center justify-center gap-2 text-sm text-[#26352B]/70">
          <BadgeCheck className="h-5 w-5 text-[#76A94C]" />
          <span>
            Prices verified with <strong className="text-[#26352B]">AGMARKNET</strong>
          </span>
        </div>
      </main>
    </div>
  );
}
