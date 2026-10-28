'use client';

import { useEffect, useState } from 'react';
import { CloudSun, Droplets, Wind } from 'lucide-react';
import {
  getCachedWeatherForecast,
  getWeatherForecast,
  WeatherForecast,
} from '@/lib/weather';

export default function WeatherCard({ location }: { location: string }) {
  const [forecast, setForecast] = useState<WeatherForecast | null>(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const controller = new AbortController();
    const cachedForecast = getCachedWeatherForecast(location);
    if (cachedForecast) {
      setForecast(cachedForecast);
      setLoading(false);
    } else {
      setLoading(true);
    }
    setError('');
    getWeatherForecast(location, controller.signal)
      .then(setForecast)
      .catch((requestError: unknown) => {
        if (controller.signal.aborted) return;
        console.error('Could not load the local weather forecast.', requestError);
        setError(
          requestError instanceof Error
            ? requestError.message
            : 'Could not load the weather forecast.',
        );
      })
      .finally(() => {
        if (!controller.signal.aborted) setLoading(false);
      });

    return () => controller.abort();
  }, [location]);

  return (
    <section
      aria-label="Local weather and climate alert"
      className="rounded-2xl border border-[#DFE5DA] bg-white p-5 shadow-sm"
    >
      <div className="flex items-start gap-3">
        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#E8EFE4] text-[#246B45]">
          <CloudSun className="h-5 w-5" />
        </span>
        <div className="min-w-0 flex-1">
          <h2 className="font-serif text-lg font-semibold">Local Weather</h2>
          <p className="mt-0.5 text-xs text-[#26352B]/65">{location}</p>
        </div>
      </div>
      {loading ? (
        <p className="mt-4 text-sm text-[#26352B]/70" role="status">
          Loading the latest forecast…
        </p>
      ) : error ? (
        <p className="mt-4 text-sm text-amber-800" role="status">
          {error}
        </p>
      ) : forecast ? (
        <>
          <div className="mt-4 flex flex-wrap items-center gap-x-5 gap-y-2 text-sm">
            <p className="font-semibold text-[#246B45]">
              {Math.round(forecast.temperatureCelsius)}°C
            </p>
            <p className="inline-flex items-center gap-1.5 text-[#26352B]/75">
              <Droplets className="h-4 w-4 text-[#246B45]" />
              Humidity {forecast.relativeHumidityPercent}%
            </p>
            <p className="inline-flex items-center gap-1.5 text-[#26352B]/75">
              <Wind className="h-4 w-4 text-[#246B45]" />
              Rain chance {forecast.rainProbabilityPercent}%
            </p>
          </div>
          <p className="mt-4 rounded-xl bg-[#E8EFE4] p-3 text-sm leading-6 text-[#26352B]">
            {forecast.advisory}
          </p>
          <p className="mt-2 text-xs text-[#26352B]/60">
            Open-Meteo · Updated {forecast.observedAt.replace('T', ' ')} local
            time
          </p>
        </>
      ) : null}
    </section>
  );
}
