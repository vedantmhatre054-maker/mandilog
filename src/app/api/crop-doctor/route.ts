import { NextResponse } from 'next/server';

const MAX_IMAGE_SIZE_BYTES = 8 * 1024 * 1024;
const allowedCrops = new Set(['tomato', 'chilli', 'onion', 'wheat', 'other']);

interface PixelSummary {
  greenPercent: number;
  brownPercent: number;
  yellowPercent: number;
  darkSpotPercent: number;
}

function isPixelSummary(value: unknown): value is PixelSummary {
  if (typeof value !== 'object' || value === null) return false;
  const summary = value as Record<string, unknown>;
  return ['greenPercent', 'brownPercent', 'yellowPercent', 'darkSpotPercent']
    .every(
      (key) =>
        typeof summary[key] === 'number' &&
        Number.isFinite(summary[key]) &&
        summary[key] >= 0 &&
        summary[key] <= 100,
    );
}

export async function POST(request: Request) {
  let formData: FormData;
  try {
    formData = await request.formData();
  } catch {
    return NextResponse.json(
      { error: 'Send a crop image using multipart form data.' },
      { status: 400 },
    );
  }

  const image = formData.get('image');
  if (!(image instanceof File)) {
    return NextResponse.json(
      { error: 'Choose a crop image before requesting analysis.' },
      { status: 400 },
    );
  }
  if (!['image/jpeg', 'image/png', 'image/webp'].includes(image.type)) {
    return NextResponse.json(
      { error: 'Use a JPEG, PNG, or WebP crop image.' },
      { status: 415 },
    );
  }
  if (image.size > MAX_IMAGE_SIZE_BYTES) {
    return NextResponse.json(
      { error: 'Image must be 8 MB or smaller.' },
      { status: 413 },
    );
  }

  const crop = formData.get('crop');
  let summary: unknown;
  try {
    summary = JSON.parse(String(formData.get('pixelSummary') ?? ''));
  } catch {
    return NextResponse.json(
      { error: 'Image color analysis is missing or invalid.' },
      { status: 400 },
    );
  }
  if (typeof crop !== 'string' || !allowedCrops.has(crop) || !isPixelSummary(summary)) {
    return NextResponse.json(
      { error: 'Provide a supported crop and valid image color summary.' },
      { status: 400 },
    );
  }

  const { greenPercent, brownPercent, yellowPercent, darkSpotPercent } = summary;
  const hasLeafPixels = greenPercent >= 8;
  const discoloration = brownPercent + yellowPercent;
  let disease: string;
  let symptoms: string[];
  let severity: 'Mild' | 'Moderate' | 'Critical';
  let patternMatch: number;

  if (!hasLeafPixels) {
    disease = 'Image not suitable for leaf screening';
    symptoms = [
      'Too little green foliage color was detected for a useful leaf image.',
      'Try a close, evenly lit photo of one affected leaf against a plain background.',
    ];
    severity = 'Mild';
    patternMatch = 0;
  } else if (discoloration > 24 && darkSpotPercent > 4 && crop === 'tomato') {
    disease = 'Possible tomato early-blight-like discoloration';
    symptoms = [
      'Elevated brown pixels and dark patches in the sampled image.',
      'Concentric rings and yellow halos cannot be reliably confirmed by this color-only screen.',
    ];
    severity = discoloration > 45 ? 'Critical' : 'Moderate';
    patternMatch = Math.min(68, 45 + Math.round(discoloration / 5));
  } else if (discoloration > 24 && darkSpotPercent > 4 && crop === 'onion') {
    disease = 'Possible onion leaf-spot discoloration';
    symptoms = [
      'Elevated brown pixels and dark patches in the sampled image.',
      'Purple blotch lesions cannot be distinguished from other damage by color statistics alone.',
    ];
    severity = discoloration > 45 ? 'Critical' : 'Moderate';
    patternMatch = Math.min(65, 42 + Math.round(discoloration / 5));
  } else if (yellowPercent > 24 && crop === 'chilli') {
    disease = 'Possible chilli leaf stress / yellowing';
    symptoms = [
      'High yellow-color proportion in the sampled image.',
      'Leaf curl virus and insect damage require shape, pest, and field examination to distinguish.',
    ];
    severity = yellowPercent > 42 ? 'Moderate' : 'Mild';
    patternMatch = Math.min(62, 40 + Math.round(yellowPercent / 5));
  } else if (discoloration > 35 || darkSpotPercent > 12) {
    disease = 'Possible leaf discoloration or physical damage';
    symptoms = [
      'Brown/yellow color or dark spots exceed this screening threshold.',
      'This screen cannot identify the cause; nutrient, water, pest, and disease stress may look similar.',
    ];
    severity = discoloration > 50 ? 'Moderate' : 'Mild';
    patternMatch = 40;
  } else {
    disease = 'No strong discoloration pattern detected';
    symptoms = [
      'Green pixels were present without a strong brown, yellow, or dark-spot pattern.',
      'Small lesions, pests, viruses, and early disease can still be missed.',
    ];
    severity = 'Mild';
    patternMatch = 55;
  }

  return NextResponse.json({
    disease,
    confidence: patternMatch,
    confidenceLabel: `${patternMatch}% visual pattern match`,
    severity,
    symptoms,
    actionPlan: {
      organic:
        'Remove only clearly affected leaves when practical, avoid overhead watering, and clean tools. Ask a local extension officer whether a registered neem or Trichoderma product is appropriate for this crop and problem.',
      chemical:
        'No chemical spray is prescribed by this color-only screen. A locally registered product such as Mancozeb may only be considered if a qualified adviser confirms the disease and its label permits use on this crop.',
      safety:
        'Follow the exact product label for dose, protective equipment, re-entry interval, and pre-harvest interval (PHI). PHI varies by product and crop; do not assume a generic 7-day interval.',
    },
    method:
      'Offline color-pixel screening only. This is not a trained AI model, laboratory test, or confirmed diagnosis.',
  });
}
