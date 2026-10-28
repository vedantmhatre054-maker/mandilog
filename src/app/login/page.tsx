'use client';

import { FormEvent, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowRight, Sprout } from 'lucide-react';
import { isLanguageCode, languages, useLanguage } from '@/lib/i18n';
import {
  readFarmerProfile,
  saveFarmerProfile,
  type FarmerProfile,
} from '@/lib/farmerProfile';

type FormMode = 'login' | 'register';

const initialProfile: FarmerProfile = {
  name: '',
  email: '',
  phone: '',
  village: 'Junnar, Pune',
  language: 'en',
  age: 30,
  gender: 'Other',
  category: 'General',
  landAcres: 1,
  soilType: 'Loamy',
  crop: 'Tomato',
  waterSource: 'Borewell',
};

export default function LoginPage() {
  const router = useRouter();
  const { language, setLanguage, t } = useLanguage();
  const [mode, setMode] = useState<FormMode>('login');
  const [profile, setProfile] = useState<FarmerProfile>(initialProfile);
  const [formError, setFormError] = useState('');

  useEffect(() => {
    try {
      const saved = readFarmerProfile();
      if (saved) {
        setProfile(saved);
        setLanguage(saved.language);
      } else {
        setProfile((current) => ({ ...current, language }));
      }
    } catch (error) {
      console.error('Could not load saved farmer details.', error);
    }
  }, []);

  const updateProfile = <Key extends keyof FarmerProfile>(
    key: Key,
    value: FarmerProfile[Key],
  ) => {
    setProfile((current) => ({ ...current, [key]: value }));
  };

  const submitProfile = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const normalized: FarmerProfile = {
      ...profile,
      name: profile.name.trim(),
      email: profile.email.trim(),
      phone: profile.phone.replace(/\D/g, ''),
      village: profile.village.trim(),
      landAcres: Number(profile.landAcres),
      age: Number(profile.age),
      language,
    };

    if (
      !normalized.name ||
      !normalized.email ||
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalized.email) ||
      normalized.phone.length !== 10 ||
      !normalized.village ||
      !Number.isInteger(normalized.age) ||
      normalized.age < 18 ||
      normalized.age > 120 ||
      !Number.isFinite(normalized.landAcres) ||
      normalized.landAcres <= 0
    ) {
      setFormError(
        'Check your name, email, 10-digit mobile number, age (18–120), village, and positive land size.',
      );
      return;
    }

    try {
      saveFarmerProfile(normalized);
      window.dispatchEvent(new Event('mandilog:profile-updated'));
      setFormError('');
      router.replace('/dashboard');
    } catch (error) {
      console.error('Could not save farmer details on this device.', error);
      setFormError(
        'Your profile could not be saved. Check this browser’s storage settings and try again.',
      );
    }
  };

  return (
    <main className="flex min-h-screen items-center justify-center bg-[#F7F8F2] px-4 py-8 font-sans text-[#26352B]">
      <section className="w-full max-w-3xl rounded-2xl border border-[#DFE5DA] bg-white p-6 shadow-sm sm:p-8">
        <div className="text-center">
          <Link href="/" className="inline-flex flex-col items-center">
            <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#E8EFE4] text-[#246B45]">
              <Sprout className="h-7 w-7" />
            </span>
            <span className="mt-2 font-serif text-2xl font-bold text-[#246B45]">
              MandiLog
            </span>
          </Link>
          <p className="mt-1 text-xs text-[#76A94C]">{t('brandTagline')}</p>
          <h1 className="mt-5 font-serif text-2xl font-bold">
            Farmer Profile &amp; Login
          </h1>
          <p className="mt-1 text-sm text-[#26352B]/70">
            Add your details once to personalize farm tools and scheme matches.
          </p>
        </div>

        <div
          role="tablist"
          aria-label="Profile access"
          className="mx-auto mt-6 grid max-w-sm grid-cols-2 rounded-xl bg-[#E8EFE4] p-1"
        >
          {(['login', 'register'] as const).map((tab) => (
            <button
              key={tab}
              type="button"
              role="tab"
              aria-selected={mode === tab}
              onClick={() => setMode(tab)}
              className={`rounded-lg px-3 py-2.5 text-sm font-semibold transition-colors ${
                mode === tab
                  ? 'bg-white text-[#246B45] shadow-sm'
                  : 'text-[#26352B]/70 hover:text-[#26352B]'
              }`}
            >
              {tab === 'login' ? 'Login / Update' : 'Create Account'}
            </button>
          ))}
        </div>

        <form onSubmit={submitProfile} className="mt-6 space-y-5">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <label className="space-y-1.5 text-sm font-medium">
              <span>Full Name</span>
              <input
                autoComplete="name"
                required
                value={profile.name}
                onChange={(event) => updateProfile('name', event.target.value)}
                placeholder="e.g. Vedant Mhatre"
                className="w-full rounded-xl border border-[#DFE5DA] bg-white px-3.5 py-3 outline-none focus:border-[#246B45]"
              />
            </label>
            <label className="space-y-1.5 text-sm font-medium">
              <span>Email Address</span>
              <input
                type="email"
                autoComplete="email"
                required
                value={profile.email}
                onChange={(event) => updateProfile('email', event.target.value)}
                placeholder="farmer@example.com"
                className="w-full rounded-xl border border-[#DFE5DA] bg-white px-3.5 py-3 outline-none focus:border-[#246B45]"
              />
            </label>
            <label className="space-y-1.5 text-sm font-medium">
              <span>Mobile Number (10 digits)</span>
              <input
                type="tel"
                inputMode="numeric"
                autoComplete="tel-national"
                pattern="[0-9]{10}"
                maxLength={10}
                required
                value={profile.phone}
                onChange={(event) =>
                  updateProfile(
                    'phone',
                    event.target.value.replace(/\D/g, '').slice(0, 10),
                  )
                }
                placeholder="10-digit mobile"
                className="w-full rounded-xl border border-[#DFE5DA] bg-white px-3.5 py-3 outline-none focus:border-[#246B45]"
              />
            </label>
            <label className="space-y-1.5 text-sm font-medium">
              <span>Age</span>
              <input
                type="number"
                min="18"
                max="120"
                step="1"
                required
                value={profile.age}
                onChange={(event) =>
                  updateProfile('age', Number(event.target.value))
                }
                className="w-full rounded-xl border border-[#DFE5DA] bg-white px-3.5 py-3 outline-none focus:border-[#246B45]"
              />
            </label>
            <label className="space-y-1.5 text-sm font-medium">
              <span>Gender</span>
              <select
                value={profile.gender}
                onChange={(event) =>
                  updateProfile(
                    'gender',
                    event.target.value as FarmerProfile['gender'],
                  )
                }
                className="w-full rounded-xl border border-[#DFE5DA] bg-white px-3.5 py-3 outline-none focus:border-[#246B45]"
              >
                <option>Male</option>
                <option>Female</option>
                <option>Other</option>
              </select>
            </label>
            <label className="space-y-1.5 text-sm font-medium">
              <span>Social / Caste Category</span>
              <select
                value={profile.category}
                onChange={(event) =>
                  updateProfile(
                    'category',
                    event.target.value as FarmerProfile['category'],
                  )
                }
                className="w-full rounded-xl border border-[#DFE5DA] bg-white px-3.5 py-3 outline-none focus:border-[#246B45]"
              >
                <option>General</option>
                <option>OBC</option>
                <option>SC</option>
                <option>ST</option>
              </select>
            </label>
            <label className="space-y-1.5 text-sm font-medium">
              <span>Village / District</span>
              <input
                required
                value={profile.village}
                onChange={(event) =>
                  updateProfile('village', event.target.value)
                }
                className="w-full rounded-xl border border-[#DFE5DA] bg-white px-3.5 py-3 outline-none focus:border-[#246B45]"
              />
            </label>
            <label className="space-y-1.5 text-sm font-medium">
              <span>Land Size (Acres)</span>
              <input
                type="number"
                min="0.1"
                step="0.1"
                required
                value={profile.landAcres}
                onChange={(event) =>
                  updateProfile('landAcres', Number(event.target.value))
                }
                className="w-full rounded-xl border border-[#DFE5DA] bg-white px-3.5 py-3 outline-none focus:border-[#246B45]"
              />
            </label>
            <label className="space-y-1.5 text-sm font-medium">
              <span>Soil Type</span>
              <select
                value={profile.soilType}
                onChange={(event) =>
                  updateProfile(
                    'soilType',
                    event.target.value as FarmerProfile['soilType'],
                  )
                }
                className="w-full rounded-xl border border-[#DFE5DA] bg-white px-3.5 py-3 outline-none focus:border-[#246B45]"
              >
                <option>Black Cotton</option>
                <option>Loamy</option>
                <option>Red</option>
                <option>Sandy</option>
              </select>
            </label>
            <label className="space-y-1.5 text-sm font-medium">
              <span>Primary Crop</span>
              <select
                value={profile.crop}
                onChange={(event) => updateProfile('crop', event.target.value)}
                className="w-full rounded-xl border border-[#DFE5DA] bg-white px-3.5 py-3 outline-none focus:border-[#246B45]"
              >
                <option>Tomato</option>
                <option>Onion</option>
                <option>Wheat</option>
                <option>Soyabean</option>
                <option>Chilli</option>
                <option>Other</option>
              </select>
            </label>
            <label className="space-y-1.5 text-sm font-medium">
              <span>Water Source</span>
              <select
                value={profile.waterSource}
                onChange={(event) =>
                  updateProfile(
                    'waterSource',
                    event.target.value as FarmerProfile['waterSource'],
                  )
                }
                className="w-full rounded-xl border border-[#DFE5DA] bg-white px-3.5 py-3 outline-none focus:border-[#246B45]"
              >
                <option>Drip</option>
                <option>Canal</option>
                <option>Borewell</option>
                <option>Rainfed</option>
              </select>
            </label>
            <label className="space-y-1.5 text-sm font-medium">
              <span>Preferred Language</span>
              <select
                value={language}
                onChange={(event) => {
                  if (isLanguageCode(event.target.value)) {
                    setLanguage(event.target.value);
                    updateProfile('language', event.target.value);
                  }
                }}
                className="w-full rounded-xl border border-[#DFE5DA] bg-white px-3.5 py-3 outline-none focus:border-[#246B45]"
              >
                {languages.map((item) => (
                  <option key={item.code} value={item.code}>
                    {item.nativeName}
                  </option>
                ))}
              </select>
            </label>
          </div>

          <button
            type="submit"
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#246B45] py-3.5 font-semibold text-white transition-colors hover:bg-[#1d5738]"
          >
            Save Profile &amp; Enter Dashboard
            <ArrowRight className="h-4 w-4" />
          </button>
          {formError && (
            <p role="alert" className="text-sm text-red-700">
              {formError}
            </p>
          )}
        </form>

        <p className="mt-4 text-center text-xs leading-5 text-[#26352B]/60">
          Your details are saved locally in this browser. Category and profile
          details help with preliminary scheme matching and do not guarantee
          eligibility.
        </p>
      </section>
    </main>
  );
}
