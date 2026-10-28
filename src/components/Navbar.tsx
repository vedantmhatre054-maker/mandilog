'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Sprout } from 'lucide-react';

export default function Navbar() {
  const [activeLang, setActiveLang] = useState<'mr' | 'hi' | 'en'>('mr');

  const languages = [
    { code: 'mr', label: 'MR', fullName: 'मराठी' },
    { code: 'hi', label: 'HI', fullName: 'हिंदी' },
    { code: 'en', label: 'EN', fullName: 'English' },
  ] as const;

  return (
    <header className="sticky top-0 z-50 w-full border-b border-[#DFE5DA] bg-white py-3.5 shadow-sm">
      <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-4 px-6">
        <Link
          href="/dashboard"
          className="group flex items-center gap-2.5 focus:outline-none"
        >
          <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#E8EFE4] text-[#246B45]">
            <Sprout className="h-6 w-6" aria-hidden="true" />
          </span>
          <span className="flex flex-col">
            <span className="font-serif text-xl font-bold leading-tight text-[#246B45] transition-colors group-hover:text-[#1d5738]">
              MandiLog
            </span>
            <span className="text-xs text-[#76A94C]">
              Sell smarter. Farm better.
            </span>
          </span>
        </Link>

        <div className="flex flex-wrap items-center gap-3 font-sans">
          <div
            aria-label="Language selection"
            className="flex items-center gap-1 rounded-xl bg-[#E8EFE4] p-1"
          >
            {languages.map((lang) => {
              const isActive = activeLang === lang.code;
              return (
                <button
                  key={lang.code}
                  type="button"
                  aria-pressed={isActive}
                  onClick={() => setActiveLang(lang.code)}
                  title={lang.fullName}
                  className={`rounded-lg px-2 py-1 text-xs font-semibold transition-colors ${
                    isActive
                      ? 'bg-white text-[#246B45] shadow-sm'
                      : 'text-[#26352B] hover:bg-white/70'
                  }`}
                >
                  [{lang.label}]
                </button>
              );
            })}
          </div>

          <div className="flex items-center gap-1.5 rounded-xl border border-[#DFE5DA] bg-white px-3 py-2 text-sm font-medium text-[#26352B]">
            <span aria-hidden="true">📍</span>
            <span>Junnar, MH</span>
          </div>
        </div>
      </div>
    </header>
  );
}
