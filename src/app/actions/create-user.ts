
'use server';

import { getAuth } from 'firebase-admin/auth';
import { initializeApp, getApps, App, ServiceAccount } from 'firebase-admin/app';
import * as admin from 'firebase-admin';

// This function ensures that we initialize the app only once per server instance.
function getAdminApp(): App {
  // If the app is already initialized, return the existing instance.
  if (getApps().length > 0) {
    return getApps()[0]!;
  }

  // --- START FIX ---

  // 1. Check for the service account key in environment variables
  const serviceAccountKey = process.env.FIREBASE_SERVICE_ACCOUNT_KEY;

  if (serviceAccountKey) {
    try {
      // 2. Parse the JSON string into a ServiceAccount object, handling escaped newlines
      const serviceAccount: ServiceAccount = JSON.parse(serviceAccountKey.replace(/\\n/g, '\n'));

      // 3. Initialize the app using the explicit credentials
      return initializeApp({
        credential: admin.credential.cert(serviceAccount),
      });

    } catch (e) {
      console.error('ERROR: Failed to parse FIREBASE_SERVICE_ACCOUNT_KEY JSON. Is the variable correctly formatted and escaped?', e);
      // Fallback or throw if explicit initialization fails
      throw new Error("Invalid Firebase Service Account Configuration.");
    }
  }

  // 4. Fallback for environments that *do* provide credentials (like GCF/Cloud Run)
  // This is the original behavior, kept as a fallback.
  return initializeApp(); 

  // --- END FIX ---
}

export async function createNewUser(
  email: string,
  password: string
): Promise<{ uid: string } | { error: string }> {
  try {
    const auth = getAuth(getAdminApp());
    const userRecord = await auth.createUser({
      email: email,
      password: password,
    });
    return { uid: userRecord.uid };
  } catch (error: any) {
    console.error('Error creating new user:', error);
    // Return a serializable error message
    return { error: error.message || 'An unknown error occurred.' };
  }
}
