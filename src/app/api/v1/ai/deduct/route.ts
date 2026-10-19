import { NextRequest, NextResponse } from 'next/server';
import { spendSchoolCredits } from '@/lib/credits-server';
import { getAdminAuth } from '@/lib/firebaseAdmin';
import { schoolsOfUser } from '@/lib/session-guard';

/**
 * Who may spend a school's credits through this API:
 *  - a trusted server holding INTERNAL_API_KEY (header `x-internal-api-key`), or
 *  - a signed-in member of that school (header `Authorization: Bearer <Firebase ID token>`).
 * Before, it accepted anonymous requests, so anyone could drain any school's credits.
 */
async function isAllowed(req: NextRequest, schoolId: string): Promise<{ ok: true } | { ok: false; status: number; error: string }> {
  const internalKey = process.env.INTERNAL_API_KEY;
  const givenKey = req.headers.get('x-internal-api-key');
  if (internalKey && givenKey && givenKey === internalKey) return { ok: true };

  const header = req.headers.get('Authorization') || '';
  if (!header.startsWith('Bearer ')) return { ok: false, status: 401, error: 'Missing authorization.' };
  let decoded: any;
  try {
    decoded = await getAdminAuth().verifyIdToken(header.slice(7));
  } catch {
    return { ok: false, status: 401, error: 'Invalid or expired token.' };
  }
  const email = String(decoded.email || '').toLowerCase();
  const user = {
    uid: decoded.uid, email, name: decoded.name || email || decoded.uid,
    isSuperAdmin: ['jamesgambrah@gmail.com', 'atampokaadongo@gmail.com'].includes(email) || decoded.role === 'super_admin',
    claims: decoded,
  };
  if (user.isSuperAdmin) return { ok: true };
  const schools = await schoolsOfUser(user);
  return schools.includes(schoolId) ? { ok: true } : { ok: false, status: 403, error: 'Not a member of this school.' };
}

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

    const allowed = await isAllowed(req, String(schoolId));
    if (!allowed.ok) {
      return NextResponse.json({ error: allowed.error }, { status: allowed.status });
    }

    const result = await spendSchoolCredits(String(schoolId), Number(credits));

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
