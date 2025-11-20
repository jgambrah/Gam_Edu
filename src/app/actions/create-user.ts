
'use server';

import { getAuth } from 'firebase-admin/auth';
import { initializeApp, getApps, App, ServiceAccount, cert } from 'firebase-admin/app';

// This function initializes the Firebase Admin SDK.
function getAdminApp(): App {
  // If the app named 'admin' is already initialized, return it.
  const existingApp = getApps().find(app => app.name === 'admin');
  if (existingApp) {
    return existingApp;
  }

  // Check for necessary environment variables.
  const projectId = process.env.FIREBASE_PROJECT_ID;
  const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
  const privateKey = process.env.FIREBASE_PRIVATE_KEY;

  if (!projectId || !clientEmail || !privateKey) {
    throw new Error("Firebase admin credentials are not set in the environment. Please check your .env file for FIREBASE_PROJECT_ID, FIREBASE_CLIENT_EMAIL, and FIREBASE_PRIVATE_KEY.");
  }

  const serviceAccount: ServiceAccount = {
    projectId,
    clientEmail,
    // The private key must have its newlines properly escaped.
    privateKey: privateKey.replace(/\\n/g, '\n'),
  };

  // Initialize the Firebase Admin SDK with a unique name.
  return initializeApp({
    credential: cert(serviceAccount),
  }, 'admin');
}

export async function createNewUser(
  email: string,
  password: string,
  role: string
): Promise<{ uid: string } | { error: string }> {
  const auth = getAuth(getAdminApp());
  try {
    const userRecord = await auth.createUser({
      email: email,
      password: password,
    });
    // Set custom claims for the user's role
    await auth.setCustomUserClaims(userRecord.uid, { role: role });
    return { uid: userRecord.uid };
  } catch (error: any) {
    console.error('Error creating new user:', error);
    // If the user already exists, find their UID and set their custom claim.
    if (error.code === 'auth/email-already-exists') {
        try {
            const userRecord = await auth.getUserByEmail(email);
            // Set custom claims for the existing user
            await auth.setCustomUserClaims(userRecord.uid, { role: role });
            return { uid: userRecord.uid };
        } catch (lookupError: any) {
            console.error('Error looking up existing user or setting claims:', lookupError);
            return { error: 'An existing user was found, but their details could not be updated.' };
        }
    }
    // For other errors, return the original error message.
    let errorMessage = 'An unknown error occurred during user creation.';
    if (error.code === 'auth/invalid-credential' || error.message.includes('invalid_grant')) {
        errorMessage = 'Invalid Firebase credentials. Please ensure your service account key in the .env file is correct and has not been revoked.';
    } else {
        errorMessage = error.message;
    }
    return { error: errorMessage };
  }
}
