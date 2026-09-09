import { NextRequest, NextResponse } from 'next/server';
import { checkDrugInteractionsWithGemini } from '@/lib/gemini';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { cartMedicines, userHistory } = body;

    if (!Array.isArray(cartMedicines) || cartMedicines.length === 0) {
      return NextResponse.json(
        { error: 'cartMedicines array is required' },
        { status: 400 }
      );
    }

    const result = await checkDrugInteractionsWithGemini(
      cartMedicines,
      Array.isArray(userHistory) ? userHistory : []
    );

    return NextResponse.json({
      success: true,
      data: result,
    });
  } catch (error: any) {
    console.error('Error in /api/ai/check-interactions:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to check drug interactions' },
      { status: 500 }
    );
  }
}
