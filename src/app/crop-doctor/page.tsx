'use client';

import { ChangeEvent, DragEvent, useRef, useState } from 'react';
import {
  Camera,
  CheckCircle2,
  ImagePlus,
  Leaf,
  Upload,
} from 'lucide-react';
import Navbar from '@/components/Navbar';

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
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [message, setMessage] = useState('');
  const uploadInput = useRef<HTMLInputElement>(null);
  const cameraInput = useRef<HTMLInputElement>(null);

  const selectImage = (file?: File) => {
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      setMessage('Please choose an image file to continue.');
      return;
    }

    setSelectedImage(file);
    setMessage('');
  };

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    selectImage(event.target.files?.[0]);
    event.target.value = '';
  };

  const handleDrop = (event: DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    selectImage(event.dataTransfer.files[0]);
  };

  return (
    <div className="min-h-screen bg-[#F7F8F2] text-[#26352B] font-sans">
      <Navbar />
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
            disabled={!selectedImage}
            onClick={() =>
              setMessage('Your photo is ready for crop diagnosis.')
            }
            className="mt-6 inline-flex items-center justify-center gap-2 rounded-xl bg-[#246B45] px-6 py-3 font-semibold text-white transition-colors hover:bg-[#1d5738] disabled:cursor-not-allowed disabled:opacity-50"
          >
            <Leaf className="h-4 w-4" />
            Analyze Crop
          </button>
          {message && (
            <p role="status" className="mt-3 text-sm text-[#246B45]">
              {message}
            </p>
          )}
        </section>

        <section>
          <div className="mb-4">
            <h2 className="font-serif text-2xl">Sample Results</h2>
            <p className="mt-1 text-sm text-[#26352B]/70">
              Examples of the insights a crop diagnosis can provide.
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
    </div>
  );
}
