
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

  if (!serviceAccountKey) {
     // This will be the case for environments that DO provide credentials (like GCF/Cloud Run)
     // This is the original behavior, kept as a fallback.
     try {
       return initializeApp();
     } catch(e) {
        console.error('ERROR: Automatic Firebase Admin SDK initialization failed. Is the app running in a Google Cloud environment or is the service account key missing?', e);
        throw new Error("Firebase Admin SDK initialization failed.");
     }
  }

  try {
    // 2. Parse the JSON string into a ServiceAccount object
    // It's crucial that the env variable is a valid JSON string.
    // Newlines within the private key should be `\n` in the .env file.
    const serviceAccount: ServiceAccount = JSON.parse(serviceAccountKey);

    // 3. Initialize the app using the explicit credentials
    return initializeApp({
      credential: admin.credential.cert(serviceAccount),
    });

  } catch (e: any) {
    console.error('ERROR: Failed to parse FIREBASE_SERVICE_ACCOUNT_KEY JSON. Make sure the environment variable is a valid, single-line JSON string.', e);
    // Throw a more specific error if parsing fails
    throw new Error(`Invalid Firebase Service Account Configuration: ${e.message}`);
  }

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
