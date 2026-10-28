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
    <header className="w-full bg-[#f4f0ea] border-b-[3px] border-b-black sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5 flex flex-wrap items-center justify-between gap-4">
        {/* Brand & Farmer First Tag */}
        <div className="flex items-center gap-3">
          <Link
            href="/dashboard"
            className="flex items-center gap-2 group cursor-pointer focus:outline-none"
          >
            <div className="w-10 h-10 bg-[#bbf7d0] border-[3px] border-black shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] flex items-center justify-center font-black text-xl text-black">
              🌾
            </div>
            <span className="font-black text-2xl tracking-tight text-black group-hover:underline">
              MandiLog
            </span>
          </Link>

          <span className="inline-block bg-black text-[#fef08a] px-2.5 py-0.5 text-xs font-black uppercase tracking-wider border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
            FARMER FIRST
          </span>
        </div>

        {/* Right Section: Greeting, Location, Language */}
        <div className="flex flex-wrap items-center gap-3">
          {/* Greeting */}
          <div className="bg-[#fef08a] border-2 border-black px-3 py-1 shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] text-xs sm:text-sm font-black text-black flex items-center gap-1.5">
            <span>🙏</span>
            <span>Namaste, Ramesh!</span>
          </div>

          {/* Location Badge */}
          <div className="bg-[#bbf7d0] border-2 border-black px-2.5 py-1 shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] text-xs sm:text-sm font-black text-black flex items-center gap-1">
            <svg
              className="w-3.5 h-3.5 fill-current"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" />
            </svg>
            <span>Junnar, MH</span>
          </div>

          {/* Language Selection Buttons */}
          <div className="flex items-center gap-1 bg-white border-2 border-black p-0.5 shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]">
            {languages.map((lang) => {
              const isActive = activeLang === lang.code;
              return (
                <button
                  key={lang.code}
                  type="button"
                  onClick={() => setActiveLang(lang.code)}
                  title={lang.fullName}
                  className={`px-2.5 py-0.5 text-xs font-black transition-all ${
                    isActive
                      ? 'bg-black text-[#fef08a]'
                      : 'bg-[#f4f0ea] text-black hover:bg-[#fef08a]'
                  } border border-black active:translate-x-0.5 active:translate-y-0.5`}
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

