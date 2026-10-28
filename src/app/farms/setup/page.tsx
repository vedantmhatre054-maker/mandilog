'use client';

import { FormEvent, useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowRight, CloudSun, Save } from 'lucide-react';
import Navbar from '@/components/Navbar';
import { getWeatherForecast } from '@/lib/weather';

const cropCycles: Record<string, number> = {
  Tomato: 90,
  Onion: 120,
  Wheat: 120,
  Soyabean: 100,
};

const rotationByCrop: Record<string, string> = {
  Tomato: 'Consider a legume such as chickpea or green gram in the next cycle to diversify the rotation.',
  Onion: 'Consider a legume crop in the next cycle; confirm soil suitability and sowing window locally.',
  Wheat: 'Consider a legume such as chickpea in the next cycle to diversify crop families.',
  Soyabean: 'Consider a cereal such as wheat in the next cycle, subject to local season and soil conditions.',
};

interface FarmProfile {
  landAcres: number;
  soilType: string;
  waterSource: string;
  crop: string;
  sowingDate: string;
  location: string;
}

export default function FarmSetupPage() {
  const router = useRouter();
  const [landAcres, setLandAcres] = useState('3.5');
  const [soilType, setSoilType] = useState('Loamy Soil');
  const [waterSource, setWaterSource] = useState('Borewell');
  const [crop, setCrop] = useState('Tomato');
  const [sowingDate, setSowingDate] = useState('');
  const [location, setLocation] = useState('Junnar, Pune');
  const [weatherAdvisory, setWeatherAdvisory] = useState('');
  const [weatherLoading, setWeatherLoading] = useState(false);
  const [notice, setNotice] = useState('');

  useEffect(() => {
    try {
      const saved = window.localStorage.getItem('mandilog-farm-profile');
      if (!saved) return;
      const profile: unknown = JSON.parse(saved);
      if (typeof profile !== 'object' || profile === null) return;
      if ('landAcres' in profile && typeof profile.landAcres === 'number') {
        setLandAcres(String(profile.landAcres));
      }
      if ('soilType' in profile && typeof profile.soilType === 'string') {
        setSoilType(profile.soilType);
      }
      if ('waterSource' in profile && typeof profile.waterSource === 'string') {
        setWaterSource(profile.waterSource);
      }
      if ('crop' in profile && typeof profile.crop === 'string') {
        setCrop(profile.crop);
      }
      if ('sowingDate' in profile && typeof profile.sowingDate === 'string') {
        setSowingDate(profile.sowingDate);
      }
      if ('location' in profile && typeof profile.location === 'string') {
        setLocation(profile.location);
      }
    } catch (error) {
      console.error('Could not restore the saved farm profile.', error);
    }
  }, []);

  const estimatedCycleDays = cropCycles[crop] ?? 100;
  const cropDay = useMemo(() => {
    if (!sowingDate) return 0;
    const elapsed = Math.floor(
      (Date.now() - new Date(`${sowingDate}T00:00:00`).getTime()) /
        (1000 * 60 * 60 * 24),
    );
    return Math.max(0, Math.min(estimatedCycleDays, elapsed));
  }, [estimatedCycleDays, sowingDate]);
  const progress = Math.min(
    100,
    Math.round((cropDay / estimatedCycleDays) * 100),
  );

  const saveProfile = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const acres = Number(landAcres);
    if (!Number.isFinite(acres) || acres <= 0) {
      setNotice('Enter a land area greater than zero.');
      return;
    }

    const profile: FarmProfile = {
      landAcres: acres,
      soilType,
      waterSource,
      crop,
      sowingDate,
      location: location.trim() || 'Junnar, Pune',
    };
    try {
      window.localStorage.setItem(
        'mandilog-farm-profile',
        JSON.stringify(profile),
      );
      setNotice('Farm profile saved on this browser.');
      router.refresh();
    } catch (error) {
      console.error('Could not save the farm profile.', error);
      setNotice('Could not save your profile. Check browser storage and retry.');
    }
  };

  const loadWeatherAdvisory = async () => {
    setWeatherLoading(true);
    setWeatherAdvisory('');
    try {
      const forecast = await getWeatherForecast(location);
      const advice =
        forecast.rainProbabilityPercent >= 60
          ? 'Rain chance is elevated. Check field moisture before irrigating; postpone irrigation if the root zone is already moist.'
          : forecast.temperatureCelsius >= 35
            ? 'High temperatures are forecast. Check soil moisture early in the day and irrigate according to crop stage and local guidance.'
            : 'Use soil moisture and crop stage to plan irrigation. Forecast conditions do not replace a field moisture check.';
      setWeatherAdvisory(
        `${advice} Forecast: ${forecast.temperatureCelsius}°C, rain probability ${forecast.rainProbabilityPercent}%.`,
      );
    } catch (error) {
      console.error('Could not fetch farm weather advisory.', error);
      setWeatherAdvisory(
        error instanceof Error
          ? error.message
          : 'Weather forecast unavailable. Check irrigation using field conditions.',
      );
    } finally {
      setWeatherLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F7F8F2] font-sans text-[#26352B]">
      <Navbar />
      <main className="mx-auto w-full max-w-4xl space-y-8 px-4 py-8 sm:px-6 lg:px-8">
        <header>
          <h1 className="font-serif text-3xl tracking-tight sm:text-4xl">
            Farm Profile &amp; Crop Setup
          </h1>
          <p className="mt-2 text-[#26352B]/70">
            Save your land and crop details for personalized farm summaries.
          </p>
        </header>

        <form
          onSubmit={saveProfile}
          className="rounded-2xl border border-[#DFE5DA] bg-white p-6 shadow-sm sm:p-8"
        >
          <div className="grid gap-5 sm:grid-cols-2">
            <label className="space-y-1.5 text-sm font-medium">
              <span>Total Land Area (Acres)</span>
              <input
                type="number"
                min="0.1"
                step="0.1"
                required
                value={landAcres}
                onChange={(event) => setLandAcres(event.target.value)}
                className="w-full rounded-xl border border-[#DFE5DA] px-3.5 py-3 outline-none focus:border-[#246B45]"
              />
            </label>
            <label className="space-y-1.5 text-sm font-medium">
              <span>Village / Mandi</span>
              <input
                required
                value={location}
                onChange={(event) => setLocation(event.target.value)}
                className="w-full rounded-xl border border-[#DFE5DA] px-3.5 py-3 outline-none focus:border-[#246B45]"
              />
            </label>
            <label className="space-y-1.5 text-sm font-medium">
              <span>Soil Type</span>
              <select
                value={soilType}
                onChange={(event) => setSoilType(event.target.value)}
                className="w-full rounded-xl border border-[#DFE5DA] bg-white px-3.5 py-3 outline-none focus:border-[#246B45]"
              >
                <option>Black Soil</option>
                <option>Loamy Soil</option>
                <option>Red Soil</option>
                <option>Sandy Soil</option>
              </select>
            </label>
            <label className="space-y-1.5 text-sm font-medium">
              <span>Water Source</span>
              <select
                value={waterSource}
                onChange={(event) => setWaterSource(event.target.value)}
                className="w-full rounded-xl border border-[#DFE5DA] bg-white px-3.5 py-3 outline-none focus:border-[#246B45]"
              >
                <option>Borewell</option>
                <option>Canal</option>
                <option>Rainfed</option>
              </select>
            </label>
            <label className="space-y-1.5 text-sm font-medium">
              <span>Current Crop</span>
              <select
                value={crop}
                onChange={(event) => setCrop(event.target.value)}
                className="w-full rounded-xl border border-[#DFE5DA] bg-white px-3.5 py-3 outline-none focus:border-[#246B45]"
              >
                {Object.keys(cropCycles).map((cropName) => (
                  <option key={cropName}>{cropName}</option>
                ))}
              </select>
            </label>
            <label className="space-y-1.5 text-sm font-medium">
              <span>Sowing Date</span>
              <input
                type="date"
                required
                value={sowingDate}
                onChange={(event) => setSowingDate(event.target.value)}
                className="w-full rounded-xl border border-[#DFE5DA] px-3.5 py-3 outline-none focus:border-[#246B45]"
              />
            </label>
          </div>
          <button
            type="submit"
            className="mt-6 inline-flex items-center gap-2 rounded-xl bg-[#246B45] px-5 py-3 font-semibold text-white hover:bg-[#1e5838]"
          >
            <Save className="h-4 w-4" />
            Save Farm Profile
          </button>
          {notice && (
            <p role="status" className="mt-3 text-sm text-[#246B45]">
              {notice}
            </p>
          )}
        </form>

        <section className="rounded-2xl border border-[#DFE5DA] bg-white p-6 shadow-sm sm:p-8">
          <div>
            <p className="text-sm font-semibold text-[#246B45]">
              General guidance · not a soil test or agronomist recommendation
            </p>
            <h2 className="mt-1 font-serif text-2xl font-semibold">
              Farm advisory
            </h2>
          </div>
          <div className="mt-5 grid gap-4 sm:grid-cols-2">
            <article className="rounded-xl bg-[#E8EFE4] p-4">
              <h3 className="font-semibold">Next crop rotation</h3>
              <p className="mt-2 text-sm leading-6">
                {rotationByCrop[crop]}
              </p>
              <p className="mt-2 text-xs text-[#26352B]/65">
                Soil selected: {soilType}. Verify suitability with a local
                extension officer.
              </p>
            </article>
            <article className="rounded-xl bg-[#F7F8F2] p-4">
              <h3 className="font-semibold">Fertilizer schedule</h3>
              <p className="mt-2 text-sm leading-6">
                Plan basal and split N-P-K applications around sowing and crop
                growth stages. Exact dose must follow a soil test and the
                locally recommended crop package; no generic dosage is safe for
                every plot.
              </p>
            </article>
            <article className="rounded-xl border border-[#DFE5DA] p-4 sm:col-span-2">
              <h3 className="flex items-center gap-2 font-semibold">
                <CloudSun className="h-5 w-5 text-[#246B45]" />
                Weather-informed irrigation
              </h3>
              <p className="mt-2 text-sm leading-6 text-[#26352B]/75">
                Fetch the local Open-Meteo forecast, then use rainfall outlook,
                crop stage and a field moisture check to plan irrigation.
              </p>
              <button
                type="button"
                onClick={loadWeatherAdvisory}
                disabled={weatherLoading || !location.trim()}
                className="mt-3 rounded-xl border border-[#DFE5DA] bg-[#E8EFE4] px-4 py-2.5 text-sm font-semibold text-[#246B45] disabled:opacity-50"
              >
                {weatherLoading ? 'Checking forecast…' : 'Check weather advisory'}
              </button>
              {weatherAdvisory && (
                <p
                  role="status"
                  className="mt-3 rounded-xl bg-[#F7F8F2] p-3 text-sm leading-6"
                >
                  {weatherAdvisory}
                </p>
              )}
            </article>
          </div>
          <p className="mt-4 text-xs text-[#26352B]/60">
            Indicative crop cycle: {cropDay} / {estimatedCycleDays} days (
            {progress}%). Growth duration varies by variety and local
            conditions.
          </p>
          <button
            type="button"
            onClick={() => router.push('/dashboard')}
            className="mt-4 inline-flex items-center gap-2 font-semibold text-[#246B45]"
          >
            Return to dashboard <ArrowRight className="h-4 w-4" />
          </button>
        </section>
      </main>
    </div>
  );
}
