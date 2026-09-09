import { NextRequest, NextResponse } from 'next/server';
import { readPrescriptionWithGemini } from '@/lib/gemini';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { imageBase64, mimeType } = body;

    if (!imageBase64) {
      return NextResponse.json(
        { error: 'Missing prescription image data' },
        { status: 400 }
      );
    }

    const result = await readPrescriptionWithGemini(imageBase64, mimeType || 'image/jpeg');

    return NextResponse.json({
      success: true,
      data: result,
    });
  } catch (error: any) {
    console.error('Error in /api/ai/read-prescription:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to process prescription' },
      { status: 500 }
    );
  }
}
