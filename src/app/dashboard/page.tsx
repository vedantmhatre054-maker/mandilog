'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import {
  ArrowRight,
  Landmark,
  Map,
  PackageCheck,
  ShoppingBag,
  Sprout,
  Stethoscope,
  TrendingUp,
} from 'lucide-react';
import Navbar from '@/components/Navbar';
import { languages, useLanguage } from '@/lib/i18n';

const primaryFeatures = [
  {
    titleKey: 'sellCrop',
    subtitle: 'Find buyers and bids',
    href: '/marketplace',
    icon: ShoppingBag,
    style: 'bg-[#246B45] text-white',
  },
  {
    titleKey: 'marketPrices',
    subtitle: 'Compare nearby markets',
    href: '/prices',
    icon: TrendingUp,
    style: 'bg-[#E8EFE4] text-[#26352B]',
  },
  {
    titleKey: 'cropDoctor',
    subtitle: 'Check crop problems',
    href: '/crop-doctor',
    icon: Stethoscope,
    style: 'bg-[#E8EFE4] text-[#26352B]',
  },
  {
    titleKey: 'govtSchemes',
    subtitle: 'Explore farmer benefits',
    href: '/schemes',
    icon: Landmark,
    style: 'bg-[#E8CFA3] text-[#26352B]',
  },
] as const;

const quickLinks = [
  { title: 'My Farms', href: '/farms', icon: Sprout },
  { title: 'Orders & Delivery', href: '/orders', icon: PackageCheck },
  { title: 'Maps & Navigation', href: '/maps', icon: Map },
];

export default function DashboardPage() {
  const { language, t } = useLanguage();
  const [profileName, setProfileName] = useState('Farmer');
  const activeLanguage = languages.find((item) => item.code === language);

  useEffect(() => {
    const storedProfile = window.localStorage.getItem('mandilog-profile');
    if (storedProfile) {
      try {
        const profile: unknown = JSON.parse(storedProfile);
        if (
          typeof profile === 'object' &&
          profile !== null &&
          'name' in profile &&
          typeof profile.name === 'string' &&
          profile.name.trim()
        ) {
          setProfileName(profile.name.trim());
          return;
        }
      } catch (error) {
        console.error('Could not read the saved MandiLog profile.', error);
      }
    }

    const legacyName = window.localStorage.getItem('mandilog-user');
    if (legacyName?.trim()) setProfileName(legacyName.trim());
  }, []);

  const greetingText = t('greeting');
  const greetingPrefix = greetingText
    .replace(/[,،，][^,،，]+[!؟.!?۔]*$/u, '')
    .trim();
  const greeting =
    profileName === 'Farmer'
      ? greetingText
      : `${greetingPrefix}, ${profileName}!`;

  return (
    <div className="min-h-screen bg-[#F7F8F2] font-sans text-[#26352B]">
      <Navbar />

      <main className="mx-auto w-full max-w-7xl space-y-8 px-4 py-8 sm:px-6 lg:px-8">
        <header>
          <h1 className="font-serif text-2xl font-bold tracking-tight">
            {greeting}
          </h1>
          <p className="mt-1 text-sm text-[#26352B]/70">
            What would you like to do today?
            {activeLanguage && (
              <span className="ml-2 inline-flex rounded-full bg-[#E8EFE4] px-2.5 py-0.5 text-xs font-semibold text-[#246B45]">
                {activeLanguage.nativeName}
              </span>
            )}
          </p>
        </header>

        <section
          aria-label="Primary farmer tools"
          className="grid gap-4 sm:grid-cols-2"
        >
          {primaryFeatures.map((feature) => {
            const Icon = feature.icon;
            return (
              <Link
                key={feature.titleKey}
                href={feature.href}
                className={`group flex min-h-40 items-center justify-between rounded-2xl p-6 shadow-sm transition-all hover:shadow-md ${feature.style}`}
              >
                <div>
                  <h2 className="font-serif text-2xl font-semibold">
                    {t(feature.titleKey)}
                  </h2>
                  <p className="mt-1 text-sm opacity-80">{feature.subtitle}</p>
                </div>
                <div className="flex items-center gap-3">
                  <Icon className="h-8 w-8 opacity-90" strokeWidth={1.8} />
                  <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
                </div>
              </Link>
            );
          })}
        </section>

        <section aria-labelledby="selling-opportunity-heading">
          <div className="rounded-2xl border border-[#DFE5DA] bg-white p-6 shadow-sm">
            <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h2
                  id="selling-opportunity-heading"
                  className="font-serif text-lg font-semibold"
                >
                  Your selling opportunity
                </h2>
                <div className="mt-4 flex items-start gap-3">
                  <TrendingUp
                    className="mt-0.5 h-5 w-5 text-[#76A94C]"
                    aria-hidden="true"
                  />
                  <div>
                    <p className="text-sm text-[#26352B]/70">
                      Estimated net proceeds
                    </p>
                    <p className="mt-1 font-serif text-3xl font-semibold text-[#246B45]">
                      ₹4,500 - ₹5,600
                    </p>
                  </div>
                  <span className="ml-1 rounded-full bg-[#E8EFE4] px-2.5 py-1 text-xs font-semibold text-[#246B45]">
                    Example
                  </span>
                </div>
              </div>
              <Link
                href="/calculator"
                className="inline-flex items-center justify-center gap-2 self-start rounded-xl bg-[#246B45] px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-[#1d5738] sm:self-center"
              >
                {t('profitCalc')} <span aria-hidden="true">-&gt;</span>
              </Link>
            </div>
          </div>
        </section>

        <section aria-labelledby="additional-tools-heading">
          <div className="mb-4">
            <h2
              id="additional-tools-heading"
              className="font-serif text-xl font-semibold"
            >
              Additional Tools
            </h2>
          </div>
          <div className="grid gap-3 sm:grid-cols-3">
            {quickLinks.map((quickLink) => {
              const Icon = quickLink.icon;
              return (
                <Link
                  key={quickLink.title}
                  href={quickLink.href}
                  className="group flex items-center justify-between rounded-xl border border-[#DFE5DA] bg-white p-4 shadow-sm transition-all hover:shadow-md"
                >
                  <span className="flex items-center gap-3 font-medium">
                    <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#E8EFE4] text-[#246B45]">
                      <Icon className="h-5 w-5" />
                    </span>
                    {quickLink.title}
                  </span>
                  <ArrowRight className="h-4 w-4 text-[#246B45] transition-transform group-hover:translate-x-1" />
                </Link>
              );
            })}
          </div>
        </section>
      </main>
    </div>
  );
}
