import { NextRequest, NextResponse } from 'next/server';
import { checkAndSpendCredits } from '@/app/actions/credits';

export async function POST(req: NextRequest) {
  try {
    const text = await req.text();
    
    if (!text) {
        return NextResponse.json({ error: 'Request body is empty' }, { status: 400 });
    }

    let body;
    try {
        body = JSON.parse(text);
    } catch (e) {
        return NextResponse.json({ error: 'Malformed JSON input' }, { status: 400 });
    }

    const { schoolId, credits, feature } = body;

    if (!schoolId || !credits) {
      return NextResponse.json(
        { error: 'Missing schoolId or credits amount' },
        { status: 400 }
      );
    }

    const result = await checkAndSpendCredits(schoolId, Number(credits));

    if (result.success) {
      console.log(`[Deduct] School: ${schoolId}, Feature: ${feature}, Cost: ${credits}`);
      return NextResponse.json({ success: true, remaining: 'unknown' });
    } else {
      console.warn(`[Deduct Failed] School: ${schoolId}, Feature: ${feature}, Cost: ${credits}, Reason: ${result.error}`);
      return NextResponse.json(
        { error: result.error || 'Insufficient AI credits.' },
        { status: 402 } // 402 Payment Required
      );
    }
  } catch (error: any) {
    console.error('[API Deduct Error]', error);
    return NextResponse.json(
      { error: 'An internal server error occurred.' },
      { status: 500 }
    );
  }
}
