import { NextResponse } from 'next/server';

const MAX_IMAGE_SIZE_BYTES = 8 * 1024 * 1024;

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

  if (!image.type.startsWith('image/')) {
    return NextResponse.json(
      { error: 'The uploaded file must be an image.' },
      { status: 400 },
    );
  }

  if (image.size > MAX_IMAGE_SIZE_BYTES) {
    return NextResponse.json(
      { error: 'Image must be 8 MB or smaller.' },
      { status: 413 },
    );
  }

  return NextResponse.json(
    {
      error:
        'Crop image received, but no trained disease-detection model is configured. No diagnosis or treatment can be safely inferred from the image.',
    },
    { status: 503 },
  );
}
