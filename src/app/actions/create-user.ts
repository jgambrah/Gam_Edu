
'use server';

import { getAuth } from 'firebase-admin/auth';
import { initializeApp, getApps, App, ServiceAccount, cert } from 'firebase-admin/app';

function getAdminApp(): App {
  if (getApps().length > 0) {
    return getApps()[0]!;
  }

  const serviceAccountKey = process.env.FIREBASE_SERVICE_ACCOUNT_KEY;

  if (!serviceAccountKey) {
     try {
       return initializeApp();
     } catch(e) {
        console.error('ERROR: Automatic Firebase Admin SDK initialization failed. Is the app running in a Google Cloud environment or is the service account key missing?', e);
        throw new Error("Firebase Admin SDK initialization failed.");
     }
  }

  try {
    // The service account key might be wrapped in quotes if copied directly from some terminals.
    // This removes the outer quotes before parsing.
    const keyString = serviceAccountKey.startsWith("'") && serviceAccountKey.endsWith("'") 
      ? serviceAccountKey.substring(1, serviceAccountKey.length - 1)
      : serviceAccountKey;

    const serviceAccount: ServiceAccount = JSON.parse(keyString);

    return initializeApp({
      credential: cert(serviceAccount),
    });

  } catch (e: any) {
    console.error('ERROR: Failed to parse FIREBASE_SERVICE_ACCOUNT_KEY JSON. Make sure the environment variable is a valid, single-line JSON string.', e);
    throw new Error(`Invalid Firebase Service Account Configuration: ${e.message}`);
  }
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
