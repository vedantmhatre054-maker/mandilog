'use client';

import { useState } from 'react';
import { Bookmark, Check, ChevronDown, Landmark, Wallet } from 'lucide-react';
import Navbar from '@/components/Navbar';

const categories = [
  'All',
  'Central Govt',
  'State Govt',
  'Loan / Credit',
  'Equipment Subsidy',
];

const schemes = [
  {
    name: 'PM Kisan Samman Nidhi',
    category: 'Central Govt',
    icon: Landmark,
    amount: '₹6,000 / year',
    summary: 'Direct benefit transfer to eligible farmer families.',
    details:
      'Eligible landholding farmer families receive ₹6,000 annually in three equal installments, transferred directly to their bank account.',
  },
  {
    name: 'Kisan Credit Card (KCC)',
    category: 'Loan / Credit',
    icon: Wallet,
    amount: 'Subsidized interest',
    summary: 'Flexible credit to meet agricultural and allied activity needs.',
    details:
      'KCC provides eligible farmers with access to short-term credit for crop cultivation, post-harvest expenses, and other approved farming needs. Interest benefits depend on eligibility and timely repayment.',
  },
  {
    name: 'Subsidy on Agricultural Equipment',
    category: 'Equipment Subsidy',
    icon: Landmark,
    amount: 'Up to 50% subsidy',
    summary: 'Financial support for eligible farm machinery via MahaDBT.',
    details:
      'Eligible farmers in Maharashtra can apply through MahaDBT for assistance on approved agricultural equipment. Subsidy rates and equipment availability vary by scheme and applicant category.',
  },
];

export default function SchemesPage() {
  const [activeCategory, setActiveCategory] = useState('All');
  const [savedSchemes, setSavedSchemes] = useState<string[]>([]);
  const [expandedSchemes, setExpandedSchemes] = useState<string[]>([]);

  const visibleSchemes =
    activeCategory === 'All'
      ? schemes
      : schemes.filter((scheme) => scheme.category === activeCategory);

  const toggleSaved = (name: string) => {
    setSavedSchemes((current) =>
      current.includes(name)
        ? current.filter((savedName) => savedName !== name)
        : [...current, name],
    );
  };

  const toggleDetails = (name: string) => {
    setExpandedSchemes((current) =>
      current.includes(name)
        ? current.filter((expandedName) => expandedName !== name)
        : [...current, name],
    );
  };

  return (
    <div className="min-h-screen bg-[#F7F8F2] text-[#26352B] font-sans">
      <Navbar />
      <main className="mx-auto w-full max-w-7xl space-y-8 px-4 py-10 sm:px-6 lg:px-8">
        <header>
          <h1 className="font-serif text-3xl tracking-tight sm:text-4xl">
            Government Schemes &amp; Subsidies
          </h1>
          <p className="mt-2 text-[#26352B]/75">
            Find and apply for agricultural benefits
          </p>
        </header>

        <nav aria-label="Filter schemes" className="flex flex-wrap gap-2">
          {categories.map((category) => {
            const isActive = activeCategory === category;
            return (
              <button
                key={category}
                type="button"
                aria-pressed={isActive}
                onClick={() => setActiveCategory(category)}
                className={`rounded-full border px-4 py-2 text-sm font-semibold transition-colors ${
                  isActive
                    ? 'border-[#246B45] bg-[#246B45] text-white'
                    : 'border-[#DFE5DA] bg-white text-[#26352B] hover:bg-[#E8EFE4]'
                }`}
              >
                {category}
              </button>
            );
          })}
        </nav>

        <section aria-label="Available government schemes" className="grid gap-5">
          {visibleSchemes.map((scheme) => {
            const Icon = scheme.icon;
            const isSaved = savedSchemes.includes(scheme.name);
            const isExpanded = expandedSchemes.includes(scheme.name);
            return (
              <article
                key={scheme.name}
                className="rounded-2xl border border-[#DFE5DA] bg-white p-6 shadow-sm"
              >
                <div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
                  <div className="flex items-start gap-4">
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-[#E8EFE4] text-[#246B45]">
                      <Icon className="h-6 w-6" />
                    </div>
                    <div>
                      <span className="inline-flex rounded-full bg-[#E8EFE4] px-2.5 py-1 text-xs font-semibold text-[#246B45]">
                        {scheme.category}
                      </span>
                      <h2 className="mt-2 font-serif text-2xl">
                        {scheme.name}
                      </h2>
                      <p className="mt-1 text-sm text-[#26352B]/75">
                        {scheme.summary}
                      </p>
                    </div>
                  </div>
                  <div className="shrink-0 rounded-xl bg-[#E8CFA3]/40 px-4 py-3 sm:text-right">
                    <p className="text-xs font-medium text-[#26352B]/70">
                      Benefit
                    </p>
                    <p className="mt-0.5 font-semibold">{scheme.amount}</p>
                  </div>
                </div>

                {isExpanded && (
                  <p className="mt-5 rounded-xl bg-[#F7F8F2] p-4 text-sm leading-6 text-[#26352B]/85">
                    {scheme.details}
                  </p>
                )}

                <div className="mt-5 flex flex-wrap gap-3 border-t border-[#DFE5DA] pt-5">
                  <button
                    type="button"
                    aria-expanded={isExpanded}
                    onClick={() => toggleDetails(scheme.name)}
                    className="inline-flex items-center gap-1.5 rounded-xl bg-[#246B45] px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-[#1d5738]"
                  >
                    {isExpanded ? 'Hide Details' : 'View Details'}
                    <ChevronDown
                      className={`h-4 w-4 transition-transform ${
                        isExpanded ? 'rotate-180' : ''
                      }`}
                    />
                  </button>
                  <button
                    type="button"
                    aria-pressed={isSaved}
                    onClick={() => toggleSaved(scheme.name)}
                    className="inline-flex items-center gap-1.5 rounded-xl border border-[#DFE5DA] bg-white px-4 py-2.5 text-sm font-semibold transition-colors hover:bg-[#E8EFE4]"
                  >
                    {isSaved ? (
                      <Check className="h-4 w-4 text-[#246B45]" />
                    ) : (
                      <Bookmark className="h-4 w-4 text-[#246B45]" />
                    )}
                    {isSaved ? 'Saved' : 'Save Scheme'}
                  </button>
                </div>
              </article>
            );
          })}
        </section>
      </main>
    </div>
  );
}
