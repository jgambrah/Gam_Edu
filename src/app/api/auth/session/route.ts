import { NextResponse } from 'next/server';
import { getAdminAuth } from '@/lib/firebaseAdmin';
import { SESSION_COOKIE, ID_TOKEN_COOKIE } from '@/lib/session-guard';

/**
 * Keeps a server-readable sign-in cookie in step with the Firebase user in the browser.
 *   POST { idToken }  → sets an httpOnly session cookie (5 days)
 *   DELETE            → clears it (sign-out)
 * Server actions use it (src/lib/session-guard.ts) to know who is calling them.
 */

const FIVE_DAYS_MS = 5 * 24 * 60 * 60 * 1000;

function cookieOptions(maxAgeSeconds: number) {
  return {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax' as const,
    path: '/',
    maxAge: maxAgeSeconds,
  };
}

export async function POST(req: Request) {
  let idToken = '';
  try {
    const body = await req.json();
    idToken = String(body?.idToken || '');
  } catch {
    /* fall through */
  }
  if (!idToken) return NextResponse.json({ error: 'Missing token.' }, { status: 400 });

  const auth = getAdminAuth();
  let decoded: any;
  try {
    decoded = await auth.verifyIdToken(idToken);
  } catch {
    return NextResponse.json({ error: 'Invalid or expired token.' }, { status: 401 });
  }

  const res = NextResponse.json({ ok: true, uid: decoded.uid });
  try {
    const session = await auth.createSessionCookie(idToken, { expiresIn: FIVE_DAYS_MS });
    res.cookies.set(SESSION_COOKIE, session, cookieOptions(FIVE_DAYS_MS / 1000));
    res.cookies.set(ID_TOKEN_COOKIE, '', cookieOptions(0));
  } catch (e) {
    // Session cookies need the service-account credentials. Without them, fall back to the (1 hour) ID
    // token itself; the browser refreshes it automatically every hour.
    console.warn('[auth/session] createSessionCookie failed, using ID token cookie:', (e as any)?.message);
    res.cookies.set(ID_TOKEN_COOKIE, idToken, cookieOptions(60 * 60));
  }
  return res;
}

export async function DELETE() {
  const res = NextResponse.json({ ok: true });
  res.cookies.set(SESSION_COOKIE, '', cookieOptions(0));
  res.cookies.set(ID_TOKEN_COOKIE, '', cookieOptions(0));
  return res;
}
