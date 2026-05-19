'use server';

import { getAuth } from 'firebase-admin/auth';
import { getFirestore } from 'firebase-admin/firestore';
import { initializeApp, getApps, cert } from 'firebase-admin/app';

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

export async function adminResetUserPassword(uid: string, newPassword: string, collectionName: string) {
  try {
    const adminApp = getAdminApp();
    const auth = getAuth(adminApp);
    const db = getFirestore(adminApp);

    // 1. Update the password in Firebase Auth directly
    await auth.updateUser(uid, { password: newPassword });

    // 2. Reactivate the "First Login" lockout flag
    const updateData = { requirePasswordChange: true };
    
    // Update their specific role collection
    await db.collection(collectionName).doc(uid).set(updateData, { merge: true });
    
    // Update the master users collection
    await db.collection('users').doc(uid).set(updateData, { merge: true });

    return { success: true };
  } catch (error: any) {
    console.error("Admin Password Reset Error:", error);
    return { success: false, error: error.message };
  }
}
