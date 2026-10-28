export interface WeatherForecast {
  location: string;
  temperatureCelsius: number;
  relativeHumidityPercent: number;
  weatherCode: number;
  windSpeedKmh: number;
  rainProbabilityPercent: number;
  observedAt: string;
  advisory: string;
}

interface GeocodingResponse {
  results?: Array<{
    name: string;
    latitude: number;
    longitude: number;
    admin1?: string;
    admin2?: string;
    country_code?: string;
  }>;
}

interface ForecastResponse {
  current?: {
    time: string;
    temperature_2m: number;
    relative_humidity_2m: number;
    weather_code: number;
    wind_speed_10m: number;
  };
  daily?: {
    precipitation_probability_max?: number[];
  };
}

const JunnarFallback = {
  name: 'Junnar',
  latitude: 19.2088,
  longitude: 73.8767,
};
const WEATHER_CACHE_PREFIX = 'mandilog-weather-v1:';
const WEATHER_CACHE_TTL_MS = 30 * 60 * 1000;

interface CachedWeather {
  cachedAt: number;
  forecast: WeatherForecast;
}

const weatherMemoryCache = new Map<string, CachedWeather>();

function readWeatherCache(location: string): CachedWeather | null {
  const key = location.trim().toLowerCase();
  const memoryCached = weatherMemoryCache.get(key);
  if (memoryCached) return memoryCached;
  try {
    const raw = window.localStorage.getItem(
      `${WEATHER_CACHE_PREFIX}${encodeURIComponent(key)}`,
    );
    if (!raw) return null;
    const parsed: unknown = JSON.parse(raw);
    if (
      typeof parsed !== 'object' ||
      parsed === null ||
      !('cachedAt' in parsed) ||
      typeof parsed.cachedAt !== 'number' ||
      !('forecast' in parsed) ||
      typeof parsed.forecast !== 'object' ||
      parsed.forecast === null
    ) {
      return null;
    }
    const forecast = parsed.forecast as WeatherForecast;
    if (
      typeof forecast.location !== 'string' ||
      typeof forecast.observedAt !== 'string' ||
      !Number.isFinite(forecast.temperatureCelsius) ||
      !Number.isFinite(forecast.relativeHumidityPercent) ||
      !Number.isFinite(forecast.rainProbabilityPercent)
    ) {
      return null;
    }
    const cached = { cachedAt: parsed.cachedAt, forecast };
    weatherMemoryCache.set(key, cached);
    return cached;
  } catch (error) {
    console.error('Could not read the cached local weather.', error);
    return null;
  }
}

export function getCachedWeatherForecast(
  location: string,
): WeatherForecast | null {
  const cached = readWeatherCache(location);
  return cached && Date.now() - cached.cachedAt < WEATHER_CACHE_TTL_MS
    ? cached.forecast
    : null;
}

function saveWeatherCache(location: string, forecast: WeatherForecast): void {
  const key = location.trim().toLowerCase();
  const cached = { cachedAt: Date.now(), forecast };
  weatherMemoryCache.set(key, cached);
  try {
    window.localStorage.setItem(
      `${WEATHER_CACHE_PREFIX}${encodeURIComponent(key)}`,
      JSON.stringify(cached),
    );
  } catch (error) {
    console.error('Could not cache local weather forecast.', error);
  }
}

function isValidForecast(data: ForecastResponse): boolean {
  const current = data.current;
  const rain = data.daily?.precipitation_probability_max?.[0];
  return (
    typeof current?.time === 'string' &&
    Number.isFinite(current.temperature_2m) &&
    Number.isFinite(current.relative_humidity_2m) &&
    Number.isFinite(current.weather_code) &&
    Number.isFinite(current.wind_speed_10m) &&
    Number.isFinite(rain)
  );
}

export async function getWeatherForecast(
  location: string,
  signal?: AbortSignal,
): Promise<WeatherForecast> {
  const trimmedLocation = location.trim();
  if (!trimmedLocation) {
    throw new Error('Enter a village or town to check its weather.');
  }
  const cached = readWeatherCache(trimmedLocation);
  if (cached && Date.now() - cached.cachedAt < WEATHER_CACHE_TTL_MS) {
    return cached.forecast;
  }
  const staleForecast = cached?.forecast;

  let place = JunnarFallback;
  const placeQuery = trimmedLocation.split(',')[0].trim();
  if (placeQuery.toLowerCase() !== 'junnar') {
    const geocodingUrl = new URL(
      'https://geocoding-api.open-meteo.com/v1/search',
    );
    geocodingUrl.search = new URLSearchParams({
      name: placeQuery,
      count: '1',
      language: 'en',
      format: 'json',
    }).toString();

    const geocodingResponse = await fetch(geocodingUrl, { signal });
    if (!geocodingResponse.ok) {
      throw new Error('Could not look up that location. Please try again.');
    }

    const geocodingData = (await geocodingResponse.json()) as GeocodingResponse;
    const result = geocodingData.results?.find(
      (candidate) => candidate.country_code === 'IN',
    );
    if (!result) {
      throw new Error('No matching Indian location was found.');
    }
    place = {
      name: [result.name, result.admin2, result.admin1]
        .filter(Boolean)
        .join(', '),
      latitude: result.latitude,
      longitude: result.longitude,
    };
  }

  const forecastUrl = new URL('https://api.open-meteo.com/v1/forecast');
  forecastUrl.search = new URLSearchParams({
    latitude: String(place.latitude),
    longitude: String(place.longitude),
    current:
      'temperature_2m,relative_humidity_2m,weather_code,wind_speed_10m',
    daily: 'precipitation_probability_max',
    timezone: 'Asia/Kolkata',
    forecast_days: '1',
  }).toString();

  let forecast: ForecastResponse;
  try {
    const forecastResponse = await fetch(forecastUrl, { signal });
    if (!forecastResponse.ok) {
      throw new Error('Weather service is unavailable. Please try again later.');
    }
    forecast = (await forecastResponse.json()) as ForecastResponse;
  } catch (error) {
    if (signal?.aborted) throw error;
    if (staleForecast) return staleForecast;
    throw error;
  }
  if (!isValidForecast(forecast)) {
    throw new Error('Weather service returned incomplete forecast data.');
  }

  const current = forecast.current!;
  const rainProbability = forecast.daily!.precipitation_probability_max![0];
  const advisory =
    current.relative_humidity_2m >= 80
      ? 'High humidity detected: fungal disease risk may increase. Check crops regularly and use Crop Doctor if you notice symptoms.'
      : rainProbability >= 70
        ? 'Rain is likely today. Plan field work and protect harvested produce from getting wet.'
        : current.wind_speed_10m >= 35
          ? 'Strong winds are forecast. Check crop supports and secure lightweight materials.'
          : 'No major weather alert right now. Check the latest forecast before field work.';

  const result = {
    location: place.name,
    temperatureCelsius: current.temperature_2m,
    relativeHumidityPercent: current.relative_humidity_2m,
    weatherCode: current.weather_code,
    windSpeedKmh: current.wind_speed_10m,
    rainProbabilityPercent: rainProbability,
    observedAt: current.time,
    advisory,
  };
  saveWeatherCache(trimmedLocation, result);
  return result;
}
