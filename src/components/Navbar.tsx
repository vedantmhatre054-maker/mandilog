'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { Moon, Sprout, Sun } from 'lucide-react';
import { isLanguageCode, languages, useLanguage } from '@/lib/i18n';

export default function Navbar() {
  const { language, setLanguage, t } = useLanguage();
  const [theme, setTheme] = useState<'light' | 'dark'>('light');

  useEffect(() => {
    const applyTheme = (nextTheme: 'light' | 'dark') => {
      document.documentElement.classList.toggle('dark', nextTheme === 'dark');
      setTheme(nextTheme);
    };
    const restoreTheme = () => {
      const savedTheme =
        window.localStorage.getItem('theme') ??
        window.localStorage.getItem('mandilog-theme');
      applyTheme(savedTheme === 'dark' ? 'dark' : 'light');
    };

    try {
      restoreTheme();
    } catch (error) {
      console.error('Could not load the saved theme preference.', error);
      document.documentElement.classList.remove('dark');
      setTheme('light');
    }

    const syncTheme = (event: Event) => {
      const nextTheme = (event as CustomEvent<'light' | 'dark'>).detail;
      if (nextTheme === 'light' || nextTheme === 'dark') {
        applyTheme(nextTheme);
      }
    };
    window.addEventListener('mandilog:theme-changed', syncTheme);
    window.addEventListener('storage', restoreTheme);
    return () => {
      window.removeEventListener('mandilog:theme-changed', syncTheme);
      window.removeEventListener('storage', restoreTheme);
    };
  }, []);

  const toggleTheme = () => {
    const nextTheme = theme === 'dark' ? 'light' : 'dark';
    setTheme(nextTheme);
    document.documentElement.classList.toggle('dark', nextTheme === 'dark');
    try {
      window.localStorage.setItem('theme', nextTheme);
      window.localStorage.setItem('mandilog-theme', nextTheme);
    } catch (error) {
      console.error('Could not save the theme preference.', error);
    }
    window.dispatchEvent(
      new CustomEvent('mandilog:theme-changed', { detail: nextTheme }),
    );
  };

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
            <span className="text-xs text-[#76A94C]">{t('brandTagline')}</span>
          </span>
        </Link>

        <div className="flex flex-wrap items-center gap-3 font-sans">
          <label className="sr-only" htmlFor="navbar-language">
            Select language
          </label>
          <select
            id="navbar-language"
            aria-label="Select language"
            value={language}
            onChange={(event) => {
              if (isLanguageCode(event.target.value)) {
                setLanguage(event.target.value);
              }
            }}
            className="max-w-[160px] rounded-xl border border-[#DFE5DA] bg-[#E8EFE4] px-3 py-2 text-sm font-medium text-[#26352B] outline-none focus:border-[#246B45]"
          >
            {languages.map((item) => (
              <option key={item.code} value={item.code}>
                {item.nativeName}
              </option>
            ))}
          </select>

          <button
            type="button"
            onClick={toggleTheme}
            aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} theme`}
            title={`Switch to ${theme === 'dark' ? 'light' : 'dark'} theme`}
            className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-[#DFE5DA] bg-white text-[#246B45] transition-colors hover:bg-[#E8EFE4]"
          >
            {theme === 'dark' ? (
              <Sun className="h-5 w-5" />
            ) : (
              <Moon className="h-5 w-5" />
            )}
          </button>

          <div className="flex items-center gap-1.5 rounded-xl border border-[#DFE5DA] bg-white px-3 py-2 text-sm font-medium text-[#26352B]">
            <span aria-hidden="true">📍</span>
            <span>Junnar, MH</span>
          </div>
        </div>
      </div>
    </header>
  );
}
