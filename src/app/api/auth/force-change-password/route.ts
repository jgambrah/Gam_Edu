import { NextRequest, NextResponse } from 'next/server';
import { adminAuth, adminDb } from '@/lib/firebaseAdmin';

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

    // If idToken is provided, verify user authenticity
    if (idToken) {
      try {
        const decoded = await adminAuth.verifyIdToken(idToken);
        if (decoded.uid !== uid) {
          return NextResponse.json({ error: 'Forbidden: UID mismatch' }, { status: 403 });
        }
      } catch (tokenErr) {
        console.warn('[force-change-password] Token verification note:', tokenErr);
      }
    }

    // 1. Update Firebase Auth Password via Admin SDK (bypasses requires-recent-login constraint)
    await adminAuth.updateUser(uid, { password: newPassword });

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
