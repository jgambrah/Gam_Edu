
'use server';

import { getAuth } from 'firebase-admin/auth';
import { initializeApp, getApps, App, ServiceAccount, cert } from 'firebase-admin/app';

// This function now correctly initializes the app with service account credentials from environment variables.
function getAdminApp(): App {
  // If the app is already initialized, return the existing instance.
  if (getApps().length > 0) {
    return getApps()[0]!;
  }

  const serviceAccountBase64 = process.env.FIREBASE_SERVICE_ACCOUNT_BASE64;
  
  if (!serviceAccountBase64) {
    throw new Error("Invalid Firebase Service Account Configuration. The FIREBASE_SERVICE_ACCOUNT_BASE64 environment variable is not set.");
  }
  
  try {
    const decodedServiceAccount = Buffer.from(serviceAccountBase64, 'base64').toString('utf8');
    const serviceAccount: ServiceAccount = JSON.parse(decodedServiceAccount);

    // Initialize the Firebase Admin SDK with the constructed credential.
    return initializeApp({
      credential: cert(serviceAccount),
    });
  } catch (error: any) {
    throw new Error(`Invalid Firebase Service Account Configuration: Could not parse the Base64-encoded service account key. Please ensure it is a valid Base64 string. Error: ${error.message}`);
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
    // Provide a more specific and helpful error message to the client.
    let errorMessage = 'An unknown error occurred during user creation.';
    if (error.code === 'auth/email-already-exists') {
        errorMessage = 'This email is already in use by another account.';
    } else if (error.message.includes('invalid_grant')) {
        errorMessage = 'Invalid Firebase credentials. Please ensure your service account key in the .env file is correct and has not been revoked.';
    } else if (error.message.includes("Invalid Firebase Service Account Configuration")) {
        errorMessage = error.message;
    } else {
        errorMessage = error.message;
    }
    return { error: errorMessage };
  }
}
