import { NextResponse } from 'next/server';
import { requestTermUnlock } from '../../../../../functions/src/term-management';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { schoolId, termId, requestedDurationHours, reason, requestedBy } = body;

    if (!schoolId || !termId || !reason) {
      return NextResponse.json(
        { error: 'Missing required fields: schoolId, termId, and reason are required.' },
        { status: 400 }
      );
    }

    const result = await requestTermUnlock({
      schoolId,
      termId,
      requestedDurationHours,
      reason,
      requestedBy,
    });

    return NextResponse.json(result);
  } catch (error: any) {
    console.error('API /api/terms/unlock Error:', error);
    return NextResponse.json(
      { error: error?.message || 'Failed to unlock term for correction' },
      { status: 500 }
    );
  }
}
