import { NextRequest, NextResponse } from 'next/server';
import { getGenericAlternativeWithGemini } from '@/lib/gemini';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { brandName, saltComposition, price } = body;

    if (!brandName || !saltComposition) {
      return NextResponse.json(
        { error: 'brandName and saltComposition are required' },
        { status: 400 }
      );
    }

    const result = await getGenericAlternativeWithGemini(
      brandName,
      saltComposition,
      Number(price) || 100
    );

    return NextResponse.json({
      success: true,
      data: result,
    });
  } catch (error: any) {
    console.error('Error in /api/ai/generic-alternative:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to suggest generic alternative' },
      { status: 500 }
    );
  }
}
