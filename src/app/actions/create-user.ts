
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
    throw new Error("Firebase admin credentials are not set correctly in the environment. Please check your .env file for FIREBASE_PROJECT_ID, FIREBASE_CLIENT_EMAIL, and FIREBASE_PRIVATE_KEY.");
  }

  const serviceAccount: ServiceAccount = {
    projectId,
    clientEmail,
    // The private key must have its newlines properly escaped in the .env file.
    privateKey: privateKey.replace(/\\n/g, '\n'),
  };

  // Initialize the Firebase Admin SDK with a unique name.
  return initializeApp({
    credential: cert(serviceAccount),
  }, 'admin');
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
    // Provide a more specific and helpful error message to the client.
    let errorMessage = 'An unknown error occurred during user creation.';
    if (error.code === 'auth/email-already-exists') {
        errorMessage = 'This email is already in use by another account.';
    } else if (error.code === 'auth/invalid-credential' || error.message.includes('invalid_grant')) {
        errorMessage = 'Invalid Firebase credentials. Please ensure your service account key in the .env file is correct and has not been revoked.';
    } else {
        errorMessage = error.message;
    }
    return { error: errorMessage };
  }
}
