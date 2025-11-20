
'use server';

import { getAuth } from 'firebase-admin/auth';
import { initializeApp, getApps, App, ServiceAccount, cert } from 'firebase-admin/app';

function getAdminApp(): App {
  if (getApps().length > 0) {
    return getApps()[0]!;
  }

  // Use individual environment variables to construct the credential
  const projectId = process.env.FIREBASE_PROJECT_ID;
  const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
  // Replace the literal `\n` in the private key with actual newline characters.
  const privateKey = process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n');

  if (projectId && clientEmail && privateKey) {
    const serviceAccount: ServiceAccount = {
      projectId,
      clientEmail,
      privateKey,
    };
    
    return initializeApp({
      credential: cert(serviceAccount),
    });
  }

  // Fallback for environments with default credentials (like Google Cloud Run/Functions)
   try {
     // This will succeed in a Google Cloud environment with default credentials
     return initializeApp();
   } catch(e) {
      console.error('ERROR: Automatic Firebase Admin SDK initialization failed. Is the app running in a Google Cloud environment or are the FIREBASE_PROJECT_ID, FIREBASE_CLIENT_EMAIL, and FIREBASE_PRIVATE_KEY environment variables missing?', e);
      throw new Error("Firebase Admin SDK initialization failed: No credentials found.");
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
    let errorMessage = 'An unknown error occurred.';
    if (typeof error.message === 'string') {
        if (error.message.includes('EMAIL_EXISTS')) {
            errorMessage = 'This email is already in use by another account.';
        } else if (error.message.includes('invalid-credential')) {
            errorMessage = 'Invalid Firebase Admin credentials. Please check your .env file configuration.';
        } else {
            errorMessage = error.message;
        }
    }
    return { error: errorMessage };
  }
}
