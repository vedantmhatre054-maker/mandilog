import { isLanguageCode, type LanguageCode } from '@/lib/i18n';

export const FARMER_PROFILE_KEY = 'mandilog_user_profile';

export interface FarmerProfile {
  name: string;
  phone: string;
  email: string;
  village: string;
  language: LanguageCode;
  age: number;
  gender: 'Male' | 'Female' | 'Other';
  category: 'General' | 'OBC' | 'SC' | 'ST';
  landAcres: number;
  soilType: 'Black Cotton' | 'Loamy' | 'Red' | 'Sandy';
  crop: string;
  waterSource: 'Drip' | 'Canal' | 'Borewell' | 'Rainfed';
}

export function readFarmerProfile(): FarmerProfile | null {
  const raw =
    window.localStorage.getItem(FARMER_PROFILE_KEY) ??
    window.localStorage.getItem('mandilog-profile');
  if (!raw) return null;
  const value: unknown = JSON.parse(raw);
  if (
    typeof value !== 'object' ||
    value === null ||
    !('name' in value) ||
    typeof value.name !== 'string' ||
    !('language' in value) ||
    typeof value.language !== 'string' ||
    !isLanguageCode(value.language)
  ) {
    return null;
  }

  const profile = value as Partial<FarmerProfile> & {
    name?: unknown;
    village?: unknown;
    phone?: unknown;
  };
  return {
    name: typeof profile.name === 'string' ? profile.name : '',
    phone: typeof profile.phone === 'string' ? profile.phone : '',
    email: typeof profile.email === 'string' ? profile.email : '',
    village:
      typeof profile.village === 'string' ? profile.village : 'Junnar, Pune',
    language: profile.language ?? 'en',
    age: typeof profile.age === 'number' ? profile.age : 0,
    gender:
      profile.gender === 'Male' ||
      profile.gender === 'Female' ||
      profile.gender === 'Other'
        ? profile.gender
        : 'Other',
    category:
      profile.category === 'OBC' ||
      profile.category === 'SC' ||
      profile.category === 'ST' ||
      profile.category === 'General'
        ? profile.category
        : 'General',
    landAcres: Number.isFinite(profile.landAcres) ? profile.landAcres! : 0,
    soilType:
      profile.soilType === 'Black Cotton' ||
      profile.soilType === 'Loamy' ||
      profile.soilType === 'Red' ||
      profile.soilType === 'Sandy'
        ? profile.soilType
        : 'Loamy',
    crop: typeof profile.crop === 'string' ? profile.crop : 'Tomato',
    waterSource:
      profile.waterSource === 'Drip' ||
      profile.waterSource === 'Canal' ||
      profile.waterSource === 'Borewell' ||
      profile.waterSource === 'Rainfed'
        ? profile.waterSource
        : 'Borewell',
  };
}

export function saveFarmerProfile(profile: FarmerProfile): void {
  const serialized = JSON.stringify(profile);
  window.localStorage.setItem(FARMER_PROFILE_KEY, serialized);
  window.localStorage.setItem('mandilog-profile', serialized);
  window.localStorage.setItem('mandilog-user', profile.name);
  window.localStorage.setItem('mandilog-language', profile.language);
}
