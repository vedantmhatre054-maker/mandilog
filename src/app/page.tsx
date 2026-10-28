'use client';

import Link from 'next/link';
import {
  ArrowRight,
  Calculator,
  Gavel,
  Landmark,
  Leaf,
} from 'lucide-react';
import { isLanguageCode, languages, useLanguage } from '@/lib/i18n';

const features = [
  {
    title: 'Real Net Profit Calculator',
    translationKey: 'profitCalc',
    description:
      'See how diesel, freight, and spoilage are deducted so you know your true take-home earnings before leaving your farm.',
    href: '/calculator',
    icon: Calculator,
    label: 'Know your real returns',
    tone: 'bg-[#E8EFE4] text-[#246B45]',
  },
  {
    title: 'Live Produce Auctions',
    translationKey: undefined,
    description:
      'Let verified buyers bid on your harvest from anywhere. No need to dump produce at low prices.',
    href: '/marketplace',
    icon: Gavel,
    label: 'Sell to the best bidder',
    tone: 'bg-[#E8CFA3]/50 text-[#26352B]',
  },
  {
    title: 'AI Crop Doctor',
    translationKey: 'cropDoctor',
    description:
      'Get photo-based guidance for leaf blight, curl, and pests with actionable treatment suggestions.',
    href: '/crop-doctor',
    icon: Leaf,
    label: 'Care for every crop',
    tone: 'bg-[#E8EFE4] text-[#246B45]',
  },
  {
    title: 'Government Schemes',
    translationKey: 'govtSchemes',
    description:
      'Find simple access to PM-Kisan, KCC loan subsidies, and MahaDBT farm equipment grants.',
    href: '/schemes',
    icon: Landmark,
    label: 'Find support for your farm',
    tone: 'bg-[#E8CFA3]/50 text-[#26352B]',
  },
] as const;

export default function HomePage() {
  const { language, setLanguage, t } = useLanguage();

  return (
    <main className="min-h-screen bg-[#F7F8F2] font-sans text-[#26352B]">
      <header className="border-b border-[#DFE5DA] bg-white">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-4 px-4 py-4 sm:px-6 lg:px-8">
          <Link href="/" className="group flex items-center gap-3">
            <span className="flex h-11 w-11 items-center justify-center rounded-xl border border-[#DFE5DA] bg-[#E8EFE4] text-2xl text-[#246B45]">
              🌾
            </span>
            <span className="flex flex-col">
              <span className="font-serif text-2xl font-bold leading-tight tracking-tight group-hover:text-[#246B45]">
                MandiLog
              </span>
              <span className="text-xs text-[#26352B]/70">{t('brandTagline')}</span>
            </span>
          </Link>

          <nav
            aria-label="Main navigation"
            className="flex flex-wrap items-center gap-3"
          >
            <label className="sr-only" htmlFor="landing-language">
              Select language
            </label>
            <select
              id="landing-language"
              value={language}
              onChange={(event) => {
                if (isLanguageCode(event.target.value)) {
                  setLanguage(event.target.value);
                }
              }}
              className="max-w-[150px] rounded-xl border border-[#DFE5DA] bg-[#E8EFE4] px-3 py-2 text-sm font-medium outline-none focus:border-[#246B45]"
            >
              {languages.map((item) => (
                <option key={item.code} value={item.code}>
                  {item.nativeName}
                </option>
              ))}
            </select>
            <Link
              href="/login"
              className="inline-flex items-center gap-2 rounded-xl bg-[#246B45] px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-[#1d5738]"
            >
              Login
              <ArrowRight className="h-4 w-4" />
            </Link>
          </nav>
        </div>
      </header>

      <div className="mx-auto max-w-7xl space-y-14 px-4 py-10 sm:px-6 sm:py-14 lg:px-8">
        <section className="grid items-center gap-10 lg:grid-cols-[1.15fr_0.85fr] lg:gap-16">
          <div className="max-w-3xl">
            <span className="inline-flex items-center gap-2 rounded-full border border-[#DFE5DA] bg-[#E8EFE4] px-3 py-1.5 text-xs font-semibold text-[#246B45]">
              <span className="h-2 w-2 rounded-full bg-[#76A94C]" />
              Built for farmers across Maharashtra
            </span>
            <h1 className="mt-5 font-serif text-4xl leading-[1.12] tracking-tight sm:text-5xl lg:text-6xl">
              {t('brandTagline')}
            </h1>
            <p className="mt-5 max-w-2xl text-base leading-7 text-[#26352B]/80 sm:text-lg sm:leading-8">
              AI-powered agricultural platform for Indian farmers with market
              intelligence, real net profit calculations, online auctions, and
              crop health advice.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                href="/login"
                className="inline-flex items-center gap-2 rounded-xl bg-[#246B45] px-6 py-3 font-semibold text-white transition-colors hover:bg-[#1d5738]"
              >
                {t('getStarted')} <span aria-hidden="true">-&gt;</span>
              </Link>
              <Link
                href="/prices"
                className="inline-flex items-center gap-2 rounded-xl border border-[#DFE5DA] bg-[#E8EFE4] px-6 py-3 font-semibold text-[#26352B] transition-colors hover:bg-[#dce8d7]"
              >
                Check Today&apos;s Mandi Prices
              </Link>
            </div>
          </div>

          <aside
            aria-label="MandiLog farmer benefits"
            className="relative overflow-hidden rounded-3xl border border-[#DFE5DA] bg-[#E8EFE4] p-6 sm:p-8"
          >
            <div
              aria-hidden="true"
              className="absolute -right-10 -top-12 h-48 w-48 rounded-full bg-[#76A94C]/15"
            />
            <div
              aria-hidden="true"
              className="absolute -bottom-16 -left-12 h-52 w-52 rounded-full bg-[#E8CFA3]/40"
            />
            <div className="relative">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <p className="text-sm font-medium text-[#26352B]/70">
                    Your harvest, your decisions
                  </p>
                  <p className="mt-1 font-serif text-2xl">
                    More value at every step
                  </p>
                </div>
                <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-white text-2xl">
                  🌱
                </span>
              </div>
              <div className="mt-7 space-y-3">
                {[
                  ['01', 'Compare mandi prices before you sell'],
                  ['02', 'Calculate your real take-home returns'],
                  ['03', 'Connect with buyers and crop guidance'],
                ].map(([number, text]) => (
                  <div
                    key={number}
                    className="flex items-center gap-3 rounded-xl border border-[#DFE5DA] bg-white/80 p-3.5"
                  >
                    <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[#E8EFE4] text-xs font-bold text-[#246B45]">
                      {number}
                    </span>
                    <span className="text-sm font-medium">{text}</span>
                  </div>
                ))}
              </div>
              <div className="mt-5 flex items-center gap-2 text-sm font-semibold text-[#246B45]">
                <Leaf className="h-4 w-4" />
                Farmer first. Every season.
              </div>
            </div>
          </aside>
        </section>

        <section aria-labelledby="features-heading">
          <div className="mb-6 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-sm font-semibold text-[#246B45]">
                One platform, practical tools
              </p>
              <h2
                id="features-heading"
                className="mt-1 font-serif text-3xl tracking-tight sm:text-4xl"
              >
                Tools to help your farm grow
              </h2>
            </div>
            <p className="max-w-lg text-sm leading-6 text-[#26352B]/70">
              Make informed decisions from the field to the mandi with support
              designed around your work.
            </p>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            {features.map((feature) => {
              const Icon = feature.icon;
              return (
                <Link
                  key={feature.title}
                  href={feature.href}
                  className="group rounded-2xl border border-[#DFE5DA] bg-white p-6 shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md"
                >
                  <div className="flex items-start justify-between gap-4">
                    <span
                      className={`flex h-12 w-12 items-center justify-center rounded-xl ${feature.tone}`}
                    >
                      <Icon className="h-6 w-6" />
                    </span>
                    <ArrowRight className="mt-1 h-5 w-5 text-[#246B45] transition-transform group-hover:translate-x-1" />
                  </div>
                  <p className="mt-5 text-xs font-semibold uppercase tracking-wide text-[#246B45]">
                    {feature.label}
                  </p>
                  <h3 className="mt-1 font-serif text-2xl tracking-tight">
                    {feature.translationKey
                      ? t(feature.translationKey)
                      : feature.title}
                  </h3>
                  <p className="mt-2 leading-7 text-[#26352B]/75">
                    {feature.description}
                  </p>
                </Link>
              );
            })}
          </div>
        </section>

        <section className="rounded-2xl bg-[#246B45] px-6 py-10 text-center text-white sm:px-8 sm:py-12">
          <span className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-white/15 text-2xl">
            🌾
          </span>
          <h2 className="mt-4 font-serif text-3xl tracking-tight sm:text-4xl">
            Empowering Farmers Across Maharashtra
          </h2>
          <p className="mx-auto mt-3 max-w-2xl text-sm leading-6 text-white/85 sm:text-base">
            Make your next farming decision with the right information and
            practical tools by your side.
          </p>
          <Link
            href="/login"
            className="mt-6 inline-flex items-center gap-2 rounded-xl bg-white px-6 py-3 font-semibold text-[#246B45] transition-colors hover:bg-[#F7F8F2]"
          >
            Open Farmer Dashboard
            <ArrowRight className="h-4 w-4" />
          </Link>
        </section>
      </div>
    </main>
  );
}
