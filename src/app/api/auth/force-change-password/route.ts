import { NextRequest, NextResponse } from 'next/server';
import { adminAuth, adminDb } from '@/lib/firebaseAdmin';
import { clearPendingCredential } from '@/lib/pending-credentials';

export async function POST(req: NextRequest) {
  try {
    const { uid, newPassword, idToken } = await req.json();

    if (!uid || !newPassword) {
      return NextResponse.json(
        { error: 'User ID and new password are required.' },
        { status: 400 }
      );
    }

    if (newPassword.length < 6) {
      return NextResponse.json(
        { error: 'Password must be at least 6 characters long.' },
        { status: 400 }
      );
    }

    // The caller MUST prove they are the account owner. (Before, the check was optional and a failed check
    // was ignored, so anyone could change ANY user's password — including a Director's — with one request.)
    if (!idToken) {
      return NextResponse.json({ error: 'Please sign in again and retry.' }, { status: 401 });
    }
    try {
      const decoded = await adminAuth.verifyIdToken(idToken);
      if (decoded.uid !== uid) {
        return NextResponse.json({ error: 'Forbidden: UID mismatch' }, { status: 403 });
      }
    } catch (tokenErr) {
      console.warn('[force-change-password] Token verification failed:', tokenErr);
      return NextResponse.json({ error: 'Your session has expired. Please sign in again and retry.' }, { status: 401 });
    }

    // 1. Update Firebase Auth Password via Admin SDK (bypasses requires-recent-login constraint)
    await adminAuth.updateUser(uid, { password: newPassword });

    // The temporary password is no longer valid — forget it.
    await clearPendingCredential(adminDb as any, uid);

    // 2. Clear requirePasswordChange on users/{uid}
    const userRef = adminDb.collection('users').doc(uid);
    await userRef.set({ requirePasswordChange: false }, { merge: true });

    // 3. Clear requirePasswordChange on students/{uid}, staff/{uid}, parents/{uid}
    const collections = ['students', 'staff', 'parents'];
    await Promise.all(
      collections.map(async (col) => {
        try {
          const docRef = adminDb.collection(col).doc(uid);
          const snap = await docRef.get();
          if (snap.exists) {
            await docRef.update({ requirePasswordChange: false });
          }
        } catch (e) {
          // non-fatal per-collection error
        }
      })
    );

    return NextResponse.json({
      success: true,
      message: 'Password changed successfully via Admin SDK.',
    });
  } catch (error: any) {
    console.error('[force-change-password] Fatal error:', error);
    return NextResponse.json(
      { error: error?.message || 'Failed to update password.' },
      { status: 500 }
    );
  }
}
