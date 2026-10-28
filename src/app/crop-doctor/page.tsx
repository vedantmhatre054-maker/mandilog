'use client';

import { ChangeEvent, DragEvent, useEffect, useRef, useState } from 'react';
import {
  Camera,
  CheckCircle2,
  ImagePlus,
  Leaf,
  LoaderCircle,
  Upload,
  Volume2,
} from 'lucide-react';
import AppShell from '@/components/AppShell';
import { useLanguage } from '@/lib/i18n';

interface PixelSummary {
  greenPercent: number;
  brownPercent: number;
  yellowPercent: number;
  darkSpotPercent: number;
}

interface Diagnosis {
  disease: string;
  confidence: number;
  confidenceLabel: string;
  severity: 'Mild' | 'Moderate' | 'Critical';
  symptoms: string[];
  actionPlan: {
    organic: string;
    chemical: string;
    safety: string;
  };
  method: string;
}

const speechLocales: Record<string, string> = {
  en: 'en-IN',
  hi: 'hi-IN',
  mr: 'mr-IN',
};

const sampleResults = [
  {
    name: 'Healthy Crop',
    status: 'No disease detected',
    crop: '🌿',
    badge: 'bg-[#76A94C] text-white',
  },
  {
    name: 'Early Blight',
    status: 'Fungicide recommended',
    crop: '🍂',
    badge: 'bg-[#E8CFA3] text-[#26352B]',
  },
  {
    name: 'Leaf Curl',
    status: 'Whitefly control needed',
    crop: '🍃',
    badge: 'bg-[#E8CFA3] text-[#26352B]',
  },
  {
    name: 'Powdery Mildew',
    status: 'Neem oil spray suggested',
    crop: '🌱',
    badge: 'bg-[#E8CFA3] text-[#26352B]',
  },
];

export default function CropDoctorPage() {
  const { language } = useLanguage();
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState('');
  const [crop, setCrop] = useState('tomato');
  const [message, setMessage] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [diagnosis, setDiagnosis] = useState<Diagnosis | null>(null);
  const [diagnosisError, setDiagnosisError] = useState('');
  const uploadInput = useRef<HTMLInputElement>(null);
  const cameraInput = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!selectedImage) {
      setPreviewUrl('');
      return;
    }
    const url = URL.createObjectURL(selectedImage);
    setPreviewUrl(url);
    return () => URL.revokeObjectURL(url);
  }, [selectedImage]);

  const selectImage = (file?: File) => {
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      setMessage('Please choose an image file to continue.');
      return;
    }

    setSelectedImage(file);
    setMessage('');
    setDiagnosis(null);
    setDiagnosisError('');
  };

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    selectImage(event.target.files?.[0]);
    event.target.value = '';
  };

  const handleDrop = (event: DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    selectImage(event.dataTransfer.files[0]);
  };

  const summarizePixels = async (file: File): Promise<PixelSummary> => {
    const bitmap = await createImageBitmap(file);
    try {
      const canvas = document.createElement('canvas');
      canvas.width = 64;
      canvas.height = 64;
      const context = canvas.getContext('2d', { willReadFrequently: true });
      if (!context) throw new Error('Image color screening is not available.');
      context.drawImage(bitmap, 0, 0, canvas.width, canvas.height);
      const pixels = context.getImageData(0, 0, canvas.width, canvas.height).data;
      let green = 0;
      let brown = 0;
      let yellow = 0;
      let dark = 0;
      let visible = 0;
      for (let index = 0; index < pixels.length; index += 4) {
        const red = pixels[index];
        const greenChannel = pixels[index + 1];
        const blue = pixels[index + 2];
        const alpha = pixels[index + 3];
        if (alpha < 32) continue;
        visible += 1;
        if (
          greenChannel > red * 1.08 &&
          greenChannel > blue * 1.05 &&
          greenChannel > 45
        ) {
          green += 1;
        }
        if (
          red > greenChannel * 1.18 &&
          greenChannel > blue * 1.05 &&
          red < 210
        ) {
          brown += 1;
        }
        if (red > 125 && greenChannel > 105 && blue < 115) yellow += 1;
        if (red < 75 && greenChannel < 75 && blue < 75) dark += 1;
      }
      if (visible === 0) throw new Error('The selected image has no visible pixels.');
      const asPercent = (amount: number) =>
        Math.round((amount / visible) * 1000) / 10;
      return {
        greenPercent: asPercent(green),
        brownPercent: asPercent(brown),
        yellowPercent: asPercent(yellow),
        darkSpotPercent: asPercent(dark),
      };
    } finally {
      bitmap.close();
    }
  };

  const analyzeCrop = async () => {
    if (!selectedImage) return;
    setIsAnalyzing(true);
    setDiagnosis(null);
    setDiagnosisError('');

    try {
      const pixelSummary = await summarizePixels(selectedImage);
      const formData = new FormData();
      formData.append('image', selectedImage);
      formData.append('crop', crop);
      formData.append('pixelSummary', JSON.stringify(pixelSummary));

      const [response] = await Promise.all([
        fetch('/api/crop-doctor', { method: 'POST', body: formData }),
        new Promise((resolve) => window.setTimeout(resolve, 1500)),
      ]);
      const result = (await response.json()) as Diagnosis & { error?: string };
      if (!response.ok) {
        setDiagnosisError(
          result.error ?? 'Could not screen the selected crop image.',
        );
        return;
      }
      setDiagnosis(result);
    } catch (error) {
      console.error('Crop image request failed.', error);
      setDiagnosisError(
        error instanceof Error
          ? error.message
          : 'Could not analyze the selected image. Please try another photo.',
      );
    } finally {
      setIsAnalyzing(false);
    }
  };

  const listenToDiagnosis = () => {
    if (!diagnosis || !('speechSynthesis' in window)) {
      setDiagnosisError('Speech playback is not supported in this browser.');
      return;
    }
    const summary = `${diagnosis.disease}. ${diagnosis.confidenceLabel}. Severity: ${diagnosis.severity}. ${diagnosis.symptoms.join(' ')} Organic guidance: ${diagnosis.actionPlan.organic} ${diagnosis.actionPlan.safety}`;
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(summary);
    utterance.lang = speechLocales[language] ?? 'en-IN';
    window.speechSynthesis.speak(utterance);
  };

  return (
    <AppShell>
      <main className="mx-auto w-full max-w-7xl space-y-10 px-4 py-10 sm:px-6 lg:px-8">
        <header className="text-center">
          <h1 className="font-serif text-3xl tracking-tight sm:text-4xl">
            AI Crop Doctor
          </h1>
          <p className="mt-2 text-[#26352B]/75">
            Upload or capture a photo of your crop for diagnosis
          </p>
        </header>

        <section className="mx-auto max-w-3xl rounded-2xl border border-[#DFE5DA] bg-white p-6 text-center shadow-sm sm:p-8">
          <div className="mb-6 flex justify-center gap-3">
            <button
              type="button"
              onClick={() => cameraInput.current?.click()}
              className="inline-flex items-center gap-2 rounded-xl border border-[#DFE5DA] bg-[#F7F8F2] px-4 py-2.5 text-sm font-semibold transition-colors hover:bg-[#E8EFE4]"
            >
              <Camera className="h-4 w-4 text-[#246B45]" />
              Take Photo
            </button>
            <button
              type="button"
              onClick={() => uploadInput.current?.click()}
              className="inline-flex items-center gap-2 rounded-xl border border-[#DFE5DA] bg-[#F7F8F2] px-4 py-2.5 text-sm font-semibold transition-colors hover:bg-[#E8EFE4]"
            >
              <Upload className="h-4 w-4 text-[#246B45]" />
              Upload Image
            </button>
          </div>
          <label className="mx-auto mb-4 block max-w-xs text-left text-sm font-medium">
            <span className="mb-1.5 block">Crop for visual screening</span>
            <select
              value={crop}
              onChange={(event) => setCrop(event.target.value)}
              className="w-full rounded-xl border border-[#DFE5DA] bg-white px-3 py-2.5"
            >
              <option value="tomato">Tomato</option>
              <option value="chilli">Chilli</option>
              <option value="onion">Onion</option>
              <option value="wheat">Wheat</option>
              <option value="other">Other / unsure</option>
            </select>
          </label>

          <input
            ref={cameraInput}
            type="file"
            accept="image/*"
            capture="environment"
            onChange={handleFileChange}
            className="sr-only"
            aria-label="Take a crop photo"
          />
          <input
            ref={uploadInput}
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="sr-only"
            aria-label="Upload a crop image"
          />

          <div
            onDragOver={(event) => event.preventDefault()}
            onDrop={handleDrop}
            className="rounded-2xl border-2 border-dashed border-[#DFE5DA] bg-[#F7F8F2]/70 px-5 py-10"
          >
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-[#E8EFE4] text-[#246B45]">
              <ImagePlus className="h-7 w-7" />
            </div>
            {previewUrl && (
              <img
                src={previewUrl}
                alt="Selected crop preview"
                className="mx-auto mt-4 max-h-56 max-w-full rounded-xl border border-[#DFE5DA] object-contain"
              />
            )}
            <p className="mt-4 font-semibold">
              {selectedImage ? selectedImage.name : 'Drop your crop photo here'}
            </p>
            <p className="mt-1 text-sm text-[#26352B]/65">
              {selectedImage
                ? `${(selectedImage.size / (1024 * 1024)).toFixed(2)} MB · Image ready`
                : 'or choose Take Photo or Upload Image above'}
            </p>
            <button
              type="button"
              onClick={() => uploadInput.current?.click()}
              className="mt-4 text-sm font-semibold text-[#246B45] underline-offset-4 hover:underline"
            >
              Browse files
            </button>
          </div>

          <button
            type="button"
            disabled={!selectedImage || isAnalyzing}
            onClick={analyzeCrop}
            className="mt-6 inline-flex items-center justify-center gap-2 rounded-xl bg-[#246B45] px-6 py-3 font-semibold text-white transition-colors hover:bg-[#1d5738] disabled:cursor-not-allowed disabled:opacity-50"
          >
            {isAnalyzing ? (
              <LoaderCircle className="h-4 w-4 animate-spin" />
            ) : (
              <Leaf className="h-4 w-4" />
            )}
            {isAnalyzing ? 'Scanning leaf pigments and fungal patterns…' : 'Analyze Crop'}
          </button>
          {message && (
            <p role="status" className="mt-3 text-sm text-[#246B45]">
              {message}
            </p>
          )}
          {isAnalyzing && (
            <p role="status" className="mt-3 animate-pulse text-sm font-medium text-[#246B45]">
              Scanning leaf pigments and fungal patterns…
            </p>
          )}
          {diagnosisError && (
            <div
              role="status"
              className="mt-4 rounded-xl border border-[#DFE5DA] bg-[#F7F8F2] p-4 text-left text-sm leading-6"
            >
              <p>{diagnosisError}</p>
            </div>
          )}
          {diagnosis && (
            <article className="mt-5 space-y-4 rounded-2xl border border-[#DFE5DA] bg-white p-5 text-left shadow-sm">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wide text-[#246B45]">
                    Offline visual screening · not a confirmed diagnosis
                  </p>
                  <h2 className="mt-1 font-serif text-2xl font-semibold">
                    {diagnosis.disease}
                  </h2>
                </div>
                <div className="rounded-xl bg-[#E8EFE4] px-3 py-2 text-sm font-semibold text-[#246B45]">
                  {diagnosis.confidenceLabel}
                </div>
              </div>
              <p className="text-sm">
                Severity indicator:{' '}
                <strong>{diagnosis.severity}</strong>
              </p>
              <div>
                <h3 className="font-semibold">Visual symptoms identified</h3>
                <ul className="mt-1 list-disc space-y-1 pl-5 text-sm leading-6">
                  {diagnosis.symptoms.map((symptom) => (
                    <li key={symptom}>{symptom}</li>
                  ))}
                </ul>
              </div>
              <div className="grid gap-3 sm:grid-cols-2">
                <div className="rounded-xl bg-[#E8EFE4] p-4">
                  <h3 className="font-semibold">Organic / field care</h3>
                  <p className="mt-1 text-sm leading-6">
                    {diagnosis.actionPlan.organic}
                  </p>
                </div>
                <div className="rounded-xl bg-[#F7F8F2] p-4">
                  <h3 className="font-semibold">Chemical option</h3>
                  <p className="mt-1 text-sm leading-6">
                    {diagnosis.actionPlan.chemical}
                  </p>
                </div>
              </div>
              <p className="rounded-xl border border-[#DFE5DA] p-3 text-sm leading-6">
                <strong>Safety &amp; harvest timing:</strong>{' '}
                {diagnosis.actionPlan.safety}
              </p>
              <p className="text-xs leading-5 text-[#26352B]/65">
                {diagnosis.method} Color and lighting variation can produce
                incorrect results. Consult a local agricultural extension
                officer before treatment.
              </p>
              <button
                type="button"
                onClick={listenToDiagnosis}
                className="inline-flex items-center gap-2 rounded-xl bg-[#246B45] px-4 py-2.5 text-sm font-semibold text-white"
              >
                <Volume2 className="h-4 w-4" />
                🔊 Listen to Diagnosis
              </button>
            </article>
          )}
        </section>

        <section>
          <div className="mb-4">
            <h2 className="font-serif text-2xl">Sample Results</h2>
            <p className="mt-1 text-sm text-[#26352B]/70">
              Illustrative examples only; they are not results for your photo.
            </p>
          </div>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {sampleResults.map((result) => (
              <article
                key={result.name}
                className="rounded-xl border border-[#DFE5DA] bg-white p-4 shadow-sm"
              >
                <div className="mb-4 flex h-28 items-center justify-center rounded-lg bg-[#E8EFE4] text-5xl">
                  {result.crop}
                </div>
                <h3 className="font-semibold">{result.name}</h3>
                <span
                  className={`mt-2 inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold ${result.badge}`}
                >
                  {result.name === 'Healthy Crop' && (
                    <CheckCircle2 className="h-3.5 w-3.5" />
                  )}
                  {result.status}
                </span>
              </article>
            ))}
          </div>
        </section>
      </main>
    </AppShell>
  );
}
