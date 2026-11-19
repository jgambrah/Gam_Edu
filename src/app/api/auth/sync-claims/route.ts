import { NextResponse } from 'next/server';
import { getAdminAuth, getAdminDb } from '@/lib/firebaseAdmin';
import { syncUserCustomClaims, isCustomClaimsEnabled } from '../../../../../functions/src/auth-claims';

export async function POST(req: Request) {
  try {
    if (!isCustomClaimsEnabled()) {
      return NextResponse.json({ ok: true, enabled: false, updated: false });
    }

    const header = req.headers.get('Authorization') || '';
    if (!header.startsWith('Bearer ')) {
      return NextResponse.json({ ok: false, error: 'Missing authorization token.' }, { status: 401 });
    }

    const idToken = header.slice(7).trim();
    const auth = getAdminAuth();
    const decoded = await auth.verifyIdToken(idToken);

    const result = await syncUserCustomClaims({
      uid: decoded.uid,
      auth,
      store: getAdminDb(),
    });

    return NextResponse.json({ ok: true, ...result });
  } catch (err: any) {
    console.warn('[api/auth/sync-claims] Warning:', err?.message);
    return NextResponse.json({ ok: false, error: 'Failed to synchronize auth claims.' }, { status: 500 });
  }
}
