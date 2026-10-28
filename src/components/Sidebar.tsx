'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
  Bot,
  Calculator,
  LayoutDashboard,
  Landmark,
  MapPin,
  Package,
  ShoppingBag,
  Sprout,
  Stethoscope,
  TrendingUp,
  Truck,
} from 'lucide-react';
import { readFarmerProfile } from '@/lib/farmerProfile';

interface SidebarProps {
  onNavigate?: () => void;
}

const mainNavigation = [
  { label: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
  { label: 'My Farms', href: '/farms', icon: Sprout },
  { label: 'Crop Doctor', href: '/crop-doctor', icon: Stethoscope },
  { label: 'Market Prices', href: '/prices', icon: TrendingUp },
  { label: 'Govt. Schemes', href: '/schemes', icon: Landmark },
  { label: 'Profit Calculator', href: '/calculator', icon: Calculator },
];

const operationsNavigation = [
  { label: 'Transport & Freight', href: '/transport', icon: Truck },
  { label: 'Mandi & Godowns', href: '/maps', icon: MapPin },
  { label: 'Marketplace & Bids', href: '/marketplace', icon: ShoppingBag },
  { label: 'Orders & Dispatch', href: '/orders', icon: Package },
];

function initials(name: string): string {
  return name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part.charAt(0).toUpperCase())
    .join('') || 'F';
}

export default function Sidebar({ onNavigate }: SidebarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const [name, setName] = useState('Farmer');
  const [location, setLocation] = useState('Junnar, MH');

  useEffect(() => {
    const refreshProfile = () => {
      try {
        const profile = readFarmerProfile();
        if (profile) {
          setName(profile.name);
          setLocation(profile.village || 'Junnar, MH');
        }
      } catch (error) {
        console.error('Could not read farmer profile for sidebar.', error);
      }
    };
    refreshProfile();
    window.addEventListener('mandilog:profile-updated', refreshProfile);
    return () =>
      window.removeEventListener('mandilog:profile-updated', refreshProfile);
  }, []);

  const isActive = (href: string) =>
    pathname === href || (href !== '/dashboard' && pathname.startsWith(`${href}/`));

  const navLink = (item: (typeof mainNavigation)[number]) => {
    const Icon = item.icon;
    const active = isActive(item.href);
    return (
      <Link
        key={item.href}
        href={item.href}
        onClick={onNavigate}
        aria-current={active ? 'page' : undefined}
        className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors ${
          active
            ? 'bg-[#246B45] text-white dark:bg-[#2E8555]'
            : 'text-[#26352B]/75 hover:bg-[#E8EFE4] dark:text-[#CAD5CE] dark:hover:bg-[#213327]'
        }`}
      >
        <Icon className="h-[18px] w-[18px] shrink-0" />
        <span>{item.label}</span>
      </Link>
    );
  };

  const logout = () => {
    try {
      window.localStorage.removeItem('mandilog-profile');
      window.localStorage.removeItem('mandilog-user');
      window.localStorage.removeItem('mandilog_user_profile');
    } catch (error) {
      console.error('Could not clear the local farmer profile.', error);
    }
    router.replace('/login');
    onNavigate?.();
  };

  return (
    <aside className="sticky top-0 flex h-screen min-h-screen w-64 shrink-0 flex-col justify-between overflow-y-auto border-r border-[#DFE5DA] bg-white p-4 transition-all duration-300 dark:border-[#2A3F32] dark:bg-[#17231B]">
      <div>
        <Link
          href="/dashboard"
          onClick={onNavigate}
          className="mb-7 flex items-center gap-3 rounded-xl px-2 py-2"
        >
          <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#E8EFE4] text-[#246B45] dark:bg-[#213327] dark:text-[#76A94C]">
            <Sprout className="h-6 w-6" />
          </span>
          <span>
            <span className="block font-serif text-lg font-bold leading-tight text-[#246B45] dark:text-[#76A94C]">
              MandiLog
            </span>
            <span className="mt-0.5 block text-[10px] leading-4 text-[#26352B]/60 dark:text-[#CAD5CE]/70">
              Smart Farming &amp; APMC Intelligence
            </span>
          </span>
        </Link>

        <nav className="space-y-6 font-sans" aria-label="Sidebar navigation">
          <section>
            <h2 className="mb-2 px-3 text-[10px] font-bold uppercase tracking-[0.14em] text-[#26352B]/45 dark:text-[#CAD5CE]/55">
              Main Menu
            </h2>
            <div className="space-y-1">
              {mainNavigation.map(navLink)}
            </div>
          </section>

          <section>
            <h2 className="mb-2 px-3 text-[10px] font-bold uppercase tracking-[0.14em] text-[#26352B]/45 dark:text-[#CAD5CE]/55">
              Farm Operations
            </h2>
            <div className="space-y-1">
              {operationsNavigation.map(navLink)}
            </div>
          </section>

          <section>
            <h2 className="mb-2 px-3 text-[10px] font-bold uppercase tracking-[0.14em] text-[#26352B]/45 dark:text-[#CAD5CE]/55">
              AI Assistant
            </h2>
            <button
              type="button"
              onClick={() => {
                window.dispatchEvent(
                  new CustomEvent('mandilog:open-assistant', {
                    detail: { startVoice: true },
                  }),
                );
                onNavigate?.();
              }}
              className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left text-sm font-medium text-[#26352B]/75 transition-colors hover:bg-[#E8EFE4] dark:text-[#CAD5CE] dark:hover:bg-[#213327]"
            >
              <Bot className="h-[18px] w-[18px] shrink-0" />
              <span className="flex-1">Sahayak AI</span>
              <span className="rounded-full bg-[#76A94C] px-2 py-0.5 text-[10px] font-bold text-white">
                AI
              </span>
            </button>
          </section>
        </nav>
      </div>

      <section className="mt-6 rounded-2xl border border-[#DFE5DA] bg-[#F2F5ED] p-3 dark:border-[#2A3F32] dark:bg-[#213327]">
        <div className="flex items-center gap-3">
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#246B45] text-sm font-bold text-white dark:bg-[#2E8555]">
            {initials(name)}
          </span>
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-semibold text-[#26352B] dark:text-[#e6ece8]">
              {name}
            </p>
            <p className="text-xs text-[#26352B]/60 dark:text-[#CAD5CE]/70">
              Farmer • {location}
            </p>
          </div>
        </div>
        <div className="mt-3 flex items-center justify-between border-t border-[#DFE5DA] pt-2.5 text-xs dark:border-[#2A3F32]">
          <Link
            href="/login"
            onClick={onNavigate}
            className="font-medium text-[#246B45] hover:underline dark:text-[#76A94C]"
          >
            Edit profile
          </Link>
          <button
            type="button"
            onClick={logout}
            className="font-medium text-[#26352B]/60 hover:text-[#246B45] dark:text-[#CAD5CE]/70 dark:hover:text-[#76A94C]"
          >
            Log out
          </button>
        </div>
      </section>
    </aside>
  );
}
