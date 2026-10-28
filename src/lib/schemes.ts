export type SchemeFilter =
  | 'All'
  | 'Central Govt'
  | 'State Govt'
  | 'Loan / Credit'
  | 'Equipment Subsidy'
  | 'Insurance'
  | 'Solar';

export interface SchemeMatchInput {
  landAcres: number;
  crop: string;
  category: SchemeFilter;
}

export interface SchemeMatch {
  id: string;
  name: string;
  category: Exclude<SchemeFilter, 'All' | 'Loan / Credit'>;
  description: string;
  benefit: string;
  eligibilityNote: string;
  matchesProfile: boolean;
}

export function matchSchemes({
  landAcres,
  crop,
  category,
}: SchemeMatchInput): SchemeMatch[] {
  const safeAcres = Number.isFinite(landAcres) ? Math.max(0, landAcres) : 0;
  const normalizedCrop = crop.trim().toLowerCase();
  const hasCrop = normalizedCrop.length > 0;

  const candidates: SchemeMatch[] = [
    {
      id: 'pm-kisan',
      name: 'PM Kisan Samman Nidhi',
      category: 'Central Govt',
      description:
        'Direct-income support for eligible landholding farmer families.',
      benefit: '₹6,000 per year, subject to official eligibility and approval.',
      eligibilityNote:
        'Landholding alone does not confirm eligibility; exclusions and household criteria apply.',
      matchesProfile: safeAcres > 0,
    },
    {
      id: 'pmfby',
      name: 'PM Fasal Bima Yojana',
      category: 'Insurance',
      description:
        'Crop insurance for notified crops and areas during eligible seasons.',
      benefit: 'Premium and claim amounts vary by crop, season, area, and cover.',
      eligibilityNote:
        'Check the current state notification, enrollment window, and crop/area availability.',
      matchesProfile: hasCrop,
    },
    {
      id: 'mahadbt-drip',
      name: 'MahaDBT Drip Irrigation Subsidy',
      category: 'Equipment Subsidy',
      description:
        'Apply for assistance for eligible micro-irrigation equipment through MahaDBT.',
      benefit: 'Subsidy amount depends on approved cost, landholding category, and current rules.',
      eligibilityNote:
        'Acreage and crop are useful for screening but do not determine the sanctioned amount.',
      matchesProfile: safeAcres > 0 && hasCrop,
    },
    {
      id: 'magel-tyala-saur',
      name: 'Magel Tyala Saur Krishi Pump',
      category: 'Solar',
      description:
        'Maharashtra solar agricultural pump scheme for eligible applicants.',
      benefit: 'Pump capacity, contribution, and approval depend on scheme rules.',
      eligibilityNote:
        'Eligibility may depend on water source, power connection, and application status.',
      matchesProfile: safeAcres > 0,
    },
  ];

  return candidates.filter(
    (scheme) =>
      (category === 'All' || scheme.category === category) &&
      scheme.matchesProfile,
  );
}
