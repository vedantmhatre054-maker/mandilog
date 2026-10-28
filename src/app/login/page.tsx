'use client';

import { FormEvent, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowRight, Sprout } from 'lucide-react';
import { isLanguageCode, languages, useLanguage } from '@/lib/i18n';

type FormMode = 'login' | 'register';

interface FarmerProfile {
  name: string;
  phone: string;
  village: string;
  language: (typeof languages)[number]['code'];
}

export default function LoginPage() {
  const router = useRouter();
  const { language, setLanguage, t } = useLanguage();
  const [mode, setMode] = useState<FormMode>('login');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [village, setVillage] = useState('Junnar, Pune');
  const [storageError, setStorageError] = useState('');

  const submitProfile = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const profile: FarmerProfile = {
      name: name.trim(),
      phone: phone.replace(/\D/g, ''),
      village: village.trim(),
      language,
    };

    if (!profile.name || profile.phone.length !== 10 || !profile.village) {
      setStorageError('Enter your full name, a 10-digit mobile number, and village.');
      return;
    }

    try {
      window.localStorage.setItem('mandilog-profile', JSON.stringify(profile));
      window.localStorage.setItem('mandilog-user', profile.name);
    } catch (error) {
      console.error('Could not save the MandiLog profile on this device.', error);
      setStorageError(
        'We could not save your details on this device. Check your browser storage settings and try again.',
      );
      return;
    }

    setLanguage(profile.language);
    setStorageError('');
    router.replace('/dashboard');
  };

  return (
    <main className="flex min-h-screen items-center justify-center bg-[#F7F8F2] px-4 py-8 font-sans text-[#26352B]">
      <section className="w-full max-w-md rounded-2xl border border-[#DFE5DA] bg-white p-6 shadow-sm sm:p-8">
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
            {t('loginTitle')}
          </h1>
          <p className="mt-1 text-sm text-[#26352B]/70">
            Your farm tools, one simple step away.
          </p>
        </div>

        <div
          role="tablist"
          aria-label="Account access"
          className="mt-6 grid grid-cols-2 rounded-xl bg-[#E8EFE4] p-1"
        >
          <button
            type="button"
            role="tab"
            aria-selected={mode === 'login'}
            onClick={() => setMode('login')}
            className={`rounded-lg px-3 py-2.5 text-sm font-semibold transition-colors ${
              mode === 'login'
                ? 'bg-white text-[#246B45] shadow-sm'
                : 'text-[#26352B]/70 hover:text-[#26352B]'
            }`}
          >
            Login
          </button>
          <button
            type="button"
            role="tab"
            aria-selected={mode === 'register'}
            onClick={() => setMode('register')}
            className={`rounded-lg px-3 py-2.5 text-sm font-semibold transition-colors ${
              mode === 'register'
                ? 'bg-white text-[#246B45] shadow-sm'
                : 'text-[#26352B]/70 hover:text-[#26352B]'
            }`}
          >
            Create Account
          </button>
        </div>

        <form onSubmit={submitProfile} className="mt-6 space-y-4">
          <label className="block space-y-1.5 text-sm font-medium">
            <span>{t('fullName')}</span>
            <input
              type="text"
              autoComplete="name"
              required
              value={name}
              onChange={(event) => setName(event.target.value)}
              placeholder="e.g. Ramesh Patil"
              className="w-full rounded-xl border border-[#DFE5DA] bg-white px-3.5 py-3 outline-none placeholder:text-[#26352B]/45 focus:border-[#246B45]"
            />
          </label>

          <label className="block space-y-1.5 text-sm font-medium">
            <span>{t('mobileNumber')}</span>
            <input
              type="tel"
              inputMode="numeric"
              autoComplete="tel-national"
              pattern="[0-9]{10}"
              maxLength={10}
              required
              value={phone}
              onChange={(event) =>
                setPhone(event.target.value.replace(/\D/g, '').slice(0, 10))
              }
              placeholder="10-digit mobile number"
              title="Enter a 10-digit mobile number"
              className="w-full rounded-xl border border-[#DFE5DA] bg-white px-3.5 py-3 outline-none placeholder:text-[#26352B]/45 focus:border-[#246B45]"
            />
          </label>

          <label className="block space-y-1.5 text-sm font-medium">
            <span>Village / District</span>
            <input
              type="text"
              autoComplete="address-level2"
              required
              value={village}
              onChange={(event) => setVillage(event.target.value)}
              className="w-full rounded-xl border border-[#DFE5DA] bg-white px-3.5 py-3 outline-none focus:border-[#246B45]"
            />
          </label>

          <label className="block space-y-1.5 text-sm font-medium">
            <span>Preferred Language</span>
            <select
              value={language}
              onChange={(event) => {
                if (isLanguageCode(event.target.value)) {
                  setLanguage(event.target.value);
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

          <button
            type="submit"
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#246B45] py-3.5 font-semibold text-white transition-colors hover:bg-[#1d5738]"
          >
            {t('enterDashboard')}
            <ArrowRight className="h-4 w-4" />
          </button>
          {storageError && (
            <p role="alert" className="text-sm text-red-700">
              {storageError}
            </p>
          )}
        </form>

        <p className="mt-4 text-center text-xs leading-5 text-[#26352B]/60">
          No password or OTP required. Your details are saved only in this
          browser on this device.
        </p>
      </section>
    </main>
  );
}
