'use client';

import React, { useState } from 'react';
import Link from 'next/link';

export default function Navbar() {
  const [activeLang, setActiveLang] = useState<'mr' | 'hi' | 'en'>('mr');

  const languages = [
    { code: 'mr', label: 'MR', fullName: 'मराठी' },
    { code: 'hi', label: 'HI', fullName: 'हिंदी' },
    { code: 'en', label: 'EN', fullName: 'English' },
  ] as const;

  return (
    <header className="w-full bg-[#FFFFFF] border-b border-[#DFE5DA] sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5 flex flex-wrap items-center justify-between gap-4">
        {/* Brand & Farmer First Tag */}
        <div className="flex items-center gap-3">
          <Link
            href="/dashboard"
            className="flex items-center gap-2.5 group cursor-pointer focus:outline-none"
          >
            <div className="w-10 h-10 bg-[#E8EFE4] rounded-xl border border-[#DFE5DA] flex items-center justify-center text-xl text-[#246B45]">
              🌾
            </div>
            <span className="font-serif font-bold text-2xl tracking-tight text-[#26352B] group-hover:text-[#246B45] transition-colors">
              MandiLog
            </span>
          </Link>

          <span className="inline-block bg-[#246B45] text-white px-2.5 py-0.5 text-xs font-semibold uppercase tracking-wider rounded-full">
            FARMER FIRST
          </span>
        </div>

        {/* Navigation Links */}
        <nav className="hidden md:flex items-center gap-1 font-sans text-sm font-medium text-[#26352B]">
          <Link
            href="/dashboard"
            className="px-3 py-1.5 rounded-lg hover:bg-[#E8EFE4] transition-colors"
          >
            Dashboard
          </Link>
          <Link
            href="/calculator"
            className="px-3 py-1.5 rounded-lg hover:bg-[#E8EFE4] transition-colors"
          >
            Profit Calculator
          </Link>
          <Link
            href="/marketplace"
            className="px-3 py-1.5 rounded-lg hover:bg-[#E8EFE4] transition-colors"
          >
            Marketplace
          </Link>
        </nav>

        {/* Right Section: Greeting, Location, Language */}
        <div className="flex flex-wrap items-center gap-2.5 font-sans">
          {/* Greeting */}
          <div className="bg-[#E8EFE4] border border-[#DFE5DA] rounded-xl px-3 py-1.5 text-xs sm:text-sm font-medium text-[#26352B] flex items-center gap-1.5">
            <span>🙏</span>
            <span>Namaste, Ramesh!</span>
          </div>

          {/* Location Badge */}
          <div className="bg-[#E8CFA3]/50 border border-[#DFE5DA] rounded-xl px-3 py-1.5 text-xs sm:text-sm font-medium text-[#26352B] flex items-center gap-1.5">
            <svg
              className="w-3.5 h-3.5 fill-[#246B45]"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" />
            </svg>
            <span>Junnar, MH</span>
          </div>

          {/* Language Selection Buttons */}
          <div className="flex items-center gap-1 bg-[#F7F8F2] border border-[#DFE5DA] p-1 rounded-xl">
            {languages.map((lang) => {
              const isActive = activeLang === lang.code;
              return (
                <button
                  key={lang.code}
                  type="button"
                  onClick={() => setActiveLang(lang.code)}
                  title={lang.fullName}
                  className={`px-2 py-0.5 text-xs font-semibold rounded-lg transition-all ${
                    isActive
                      ? 'bg-[#246B45] text-white shadow-sm'
                      : 'text-[#26352B] hover:bg-[#E8EFE4]'
                  }`}
                >
                  [{lang.label}]
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </header>
  );
}
