'use server';

import { getAuth } from 'firebase-admin/auth';
import { getFirestore } from 'firebase-admin/firestore';
import { initializeApp, getApps, cert } from 'firebase-admin/app';
import { sanitizeErrorMessage } from '@/lib/error-handler';
import { savePendingCredential } from '@/lib/pending-credentials';
import { makeFriendlyPassword, isWeakDefaultPassword } from '@/lib/friendly-password';

// Initialize Admin App
function getAdminApp() {
  const existingApp = getApps().find(app => app.name === 'admin');
  if (existingApp) return existingApp;

  const projectId = process.env.FIREBASE_PROJECT_ID;
  const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
  const privateKey = process.env.FIREBASE_PRIVATE_KEY;

  if (!projectId || !clientEmail || !privateKey) {
    throw new Error("Missing Firebase Admin credentials in .env file.");
  }

  return initializeApp({
    credential: cert({
      projectId,
      clientEmail,
      privateKey: privateKey.replace(/\\n/g, '\n'),
    }),
  }, 'admin');
}

export async function adminResetUserPassword(
  uid: string,
  newPassword: string,
  collectionName: string,
  idToken?: string
) {
  try {
    const adminApp = getAdminApp();
    const auth = getAuth(adminApp);
    const db = getFirestore(adminApp);

    // --- SECURE: Caller Authentication and Authorization Check ---
    if (!idToken) {
      throw new Error("Authentication token required.");
    }

    const decodedToken = await auth.verifyIdToken(idToken);
    const callerUid = decodedToken.uid;
    const isSuperAdmin = callerUid === "L4oE5XWweKRYrhtIXn6hB8IDHBC2" || callerUid === "gZxe3nMbGcQhNgEzkwEZwDBnkFR2";

    if (!isSuperAdmin) {
      const callerUserSnap = await db.collection('users').doc(callerUid).get();
      if (!callerUserSnap.exists) {
        throw new Error("Unauthorized caller profile context.");
      }
      const callerData = callerUserSnap.data();
      const callerSchoolId = callerData?.schoolId || "";
      const callerRole = callerData?.role || "";

      if (!['Director', 'Administrator', 'Admin'].includes(callerRole)) {
        throw new Error("Unauthorized role privileges.");
      }

      // Verify the target user belongs to the same school
      const targetUserDoc = await db.collection('users').doc(uid).get();
      if (!targetUserDoc.exists || targetUserDoc.data()?.schoolId !== callerSchoolId) {
        throw new Error("Unauthorized: Cannot reset password for users outside your school.");
      }
    }

    // No more shared defaults such as "password123": a personal temporary password is used instead (returned).
    if (isWeakDefaultPassword(newPassword)) newPassword = makeFriendlyPassword();

    // 1. Update the password in Firebase Auth directly
    await auth.updateUser(uid, { password: newPassword });

    // Keep it available to the school until the person chooses their own (see LoginDetailsCard).
    try {
      const [targetUser, authUser] = await Promise.all([db.collection('users').doc(uid).get(), auth.getUser(uid)]);
      const t: any = targetUser.data() || {};
      await savePendingCredential(db as any, {
        uid,
        schoolId: t.schoolId || '',
        password: newPassword,
        email: authUser.email || t.email || '',
        name: authUser.displayName || `${t.firstName || ''} ${t.lastName || ''}`.trim(),
        role: t.role || '',
        setBy: callerUid,
      });
    } catch (e) {
      console.warn('Reset done; temporary password not stored for later look-up:', e);
    }

    // 2. Reactivate the "First Login" lockout flag
    const updateData = { requirePasswordChange: true };
    
    // Update their specific role collection
    await db.collection(collectionName).doc(uid).set(updateData, { merge: true });
    
    // Update the master users collection
    await db.collection('users').doc(uid).set(updateData, { merge: true });

    return { success: true, password: newPassword };
  } catch (error: any) {
    const errorMessage = sanitizeErrorMessage(error);
    return { success: false, error: errorMessage };
  }
}
