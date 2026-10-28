'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import {
  ArrowRight,
  Landmark,
  MapPin,
  Mic,
  Package,
  ShoppingBag,
  Sprout,
  Stethoscope,
  TrendingUp,
  Truck,
} from 'lucide-react';
import AppShell from '@/components/AppShell';
import { languages, useLanguage } from '@/lib/i18n';
import WeatherCard from '@/components/WeatherCard';
import { readFarmerProfile } from '@/lib/farmerProfile';

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

const additionalFeatures = [
  {
    title: 'My Farms & Soil',
    subtitle: 'Parcels & soil rotation',
    href: '/farms',
    icon: Sprout,
  },
  {
    title: 'Orders & Dispatch',
    subtitle: 'Track gate passes & buyers',
    href: '/orders',
    icon: Package,
  },
  {
    title: 'Maps & Godowns',
    subtitle: 'APMC yards & cold storage',
    href: '/maps',
    icon: MapPin,
  },
  {
    title: 'Transport & Freight',
    subtitle: 'Book Bolero & Tata Ace trucks',
    href: '/transport',
    icon: Truck,
  },
];

interface FarmProfile {
  landAcres: number;
  soilType: string;
  crop: string;
  sowingDate: string;
}

const cropCycleDays: Record<string, number> = {
  Tomato: 90,
  Onion: 120,
  Wheat: 120,
  Soyabean: 100,
};

export default function DashboardPage() {
  const { language, t } = useLanguage();
  const [profileName, setProfileName] = useState('Farmer');
  const [profileLocation, setProfileLocation] = useState('Junnar, Pune');
  const [farmProfile, setFarmProfile] = useState<FarmProfile | null>(null);
  const activeLanguage = languages.find((item) => item.code === language);

  useEffect(() => {
    const refreshProfile = () => {
    try {
      const profile = readFarmerProfile();
      if (profile) {
        setProfileName(profile.name);
        setProfileLocation(profile.village);
        setFarmProfile({
          landAcres: profile.landAcres,
          soilType: profile.soilType,
          crop: profile.crop,
          sowingDate: '',
        });
      }

      if (!profile) {
        const legacyName = window.localStorage.getItem('mandilog-user');
        if (legacyName?.trim()) setProfileName(legacyName.trim());
      }

      const rawFarmProfile = window.localStorage.getItem(
        'mandilog-farm-profile',
      );
      if (rawFarmProfile) {
        const savedFarm: unknown = JSON.parse(rawFarmProfile);
        if (
          typeof savedFarm === 'object' &&
          savedFarm !== null &&
          'landAcres' in savedFarm &&
          typeof savedFarm.landAcres === 'number' &&
          'soilType' in savedFarm &&
          typeof savedFarm.soilType === 'string' &&
          'crop' in savedFarm &&
          typeof savedFarm.crop === 'string' &&
          'sowingDate' in savedFarm &&
          typeof savedFarm.sowingDate === 'string'
        ) {
          setFarmProfile({
            landAcres: savedFarm.landAcres,
            soilType: savedFarm.soilType,
            crop: savedFarm.crop,
            sowingDate: savedFarm.sowingDate,
          });
        }
      }
    } catch (error) {
      console.error('Could not read saved MandiLog profile data.', error);
    }
    };
    refreshProfile();
    window.addEventListener('mandilog:profile-updated', refreshProfile);
    return () =>
      window.removeEventListener('mandilog:profile-updated', refreshProfile);
  }, []);

  const farmCycleDays = farmProfile
    ? (cropCycleDays[farmProfile.crop] ?? 100)
    : 100;
  const farmDay = farmProfile?.sowingDate
    ? Math.max(
        0,
        Math.min(
          farmCycleDays,
          Math.floor(
            (Date.now() -
              new Date(`${farmProfile.sowingDate}T00:00:00`).getTime()) /
              (1000 * 60 * 60 * 24),
          ),
        ),
      )
    : 0;
  const farmProgress = Math.round((farmDay / farmCycleDays) * 100);

  const greetingText = t('greeting');
  const greetingPrefix = greetingText
    .replace(/[,،，][^,،，]+[!؟.!?۔]*$/u, '')
    .trim();
  const greeting =
    profileName === 'Farmer'
      ? greetingText
      : `${greetingPrefix}, ${profileName}!`;

  return (
    <AppShell>
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

        <WeatherCard location={profileLocation} />

        {farmProfile && (
          <section
            aria-label="Farm at a glance"
            className="rounded-2xl border border-[#DFE5DA] bg-white p-5 shadow-sm sm:p-6"
          >
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-sm font-semibold text-[#246B45]">
                  Farm at a glance
                </p>
                <h2 className="mt-1 font-serif text-xl font-semibold">
                  {farmProfile.landAcres} Acres • {farmProfile.soilType} •{' '}
                  {farmProfile.crop} (Day {farmDay})
                </h2>
              </div>
              <Link
                href="/farms/setup"
                className="inline-flex items-center gap-2 self-start rounded-xl bg-[#E8EFE4] px-4 py-2.5 text-sm font-semibold text-[#246B45]"
              >
                Edit farm profile <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
            <div
              className="mt-4 h-2.5 overflow-hidden rounded-full bg-[#DFE5DA]"
              role="progressbar"
              aria-label={`${farmProfile.crop} crop cycle progress`}
              aria-valuemin={0}
              aria-valuemax={100}
              aria-valuenow={farmProgress}
            >
              <div
                className="h-full rounded-full bg-[#76A94C]"
                style={{ width: `${farmProgress}%` }}
              />
            </div>
            <p className="mt-1 text-right text-xs text-[#26352B]/65">
              Indicative cycle: {farmDay} / {farmCycleDays} days
            </p>
          </section>
        )}

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

        <section aria-label="All farmer tools" className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {primaryFeatures.map((feature) => {
            const Icon = feature.icon;
            return (
              <Link
                key={feature.titleKey}
                href={feature.href}
                className={`group flex min-h-36 items-center justify-between rounded-2xl p-6 shadow-sm transition-all hover:shadow-md ${feature.style}`}
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
          {additionalFeatures.map((feature) => {
            const Icon = feature.icon;
            return (
              <Link
                key={feature.title}
                href={feature.href}
                className="group flex min-h-36 items-center justify-between rounded-2xl border border-[#DFE5DA] bg-white p-6 shadow-sm transition-all hover:shadow-md"
              >
                <div>
                  <h2 className="font-serif text-2xl font-semibold">
                    {feature.title}
                  </h2>
                  <p className="mt-1 text-sm text-[#26352B]/70">
                    {feature.subtitle}
                  </p>
                </div>
                <div className="flex items-center gap-3 text-[#246B45]">
                  <Icon className="h-8 w-8" strokeWidth={1.8} />
                  <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
                </div>
              </Link>
            );
          })}
          <button
            type="button"
            onClick={() =>
              window.dispatchEvent(
                new CustomEvent('mandilog:open-assistant', {
                  detail: { startVoice: true },
                }),
              )
            }
            className="group flex min-h-36 items-center justify-between rounded-2xl bg-[#246B45] p-6 text-left text-white shadow-sm transition-all hover:bg-[#1e5838] hover:shadow-md"
          >
            <div>
              <h2 className="font-serif text-2xl font-semibold">
                Sahayak AI Voice
              </h2>
              <p className="mt-1 text-sm text-white/80">
                Speak in your native language
              </p>
            </div>
            <div className="flex items-center gap-3">
              <Mic className="h-8 w-8 animate-pulse" strokeWidth={1.8} />
              <ArrowRight className="h-5 w-5" />
            </div>
          </button>
        </section>
      </main>
    </AppShell>
  );
}
