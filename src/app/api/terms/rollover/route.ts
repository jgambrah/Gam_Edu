import { NextResponse } from 'next/server';
import { executeTermFinancialRollover } from '../../../../../functions/src/financial-rollover';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { schoolId, currentTermId, nextTermId } = body;

    if (!schoolId || !currentTermId || !nextTermId) {
      return NextResponse.json(
        { error: 'Missing required fields: schoolId, currentTermId, nextTermId' },
        { status: 400 }
      );
    }

    const result = await executeTermFinancialRollover(schoolId, currentTermId, nextTermId);

    return NextResponse.json(result);
  } catch (error: any) {
    console.error('API /api/terms/rollover Error:', error);
    return NextResponse.json(
      { error: error?.message || 'Failed to execute financial rollover', details: String(error) },
      { status: 500 }
    );
  }
}
