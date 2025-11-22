
'use server';

import { getAuth } from 'firebase-admin/auth';
import { getFirestore } from 'firebase-admin/firestore';
import { initializeApp, getApps, App, ServiceAccount, cert } from 'firebase-admin/app';
import type { UserRole } from '@/lib/types';

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
  role?: UserRole
): Promise<{ uid: string } | { error: string }> {
  const adminApp = getAdminApp();
  const auth = getAuth(adminApp);
  const firestore = getFirestore(adminApp);

  try {
    let userRecord;
    try {
        // First try to get user, they might have been created on the client
        userRecord = await auth.getUserByEmail(email);
    } catch (error: any) {
        if (error.code === 'auth/user-not-found') {
            // If user doesn't exist, create them
            userRecord = await auth.createUser({
                email: email,
                password: password,
            });
        } else {
            // Re-throw other errors
            throw error;
        }
    }
    
    // Set custom claims for the user's role
    const selectedRole = role || 'Parent'; // Default to 'Parent' if no role is provided
    await auth.setCustomUserClaims(userRecord.uid, { role: selectedRole });

    return { uid: userRecord.uid };

  } catch (error: any) {
    console.error('Error creating/updating user:', error);
    
    let errorMessage = 'An unknown error occurred during user processing.';
    if (error.code) {
        switch(error.code) {
            case 'auth/email-already-exists':
                errorMessage = 'This email is already in use by another account.';
                break;
            case 'auth/invalid-credential':
            case 'auth/invalid-grant':
                 errorMessage = 'Invalid Firebase credentials. Please ensure your service account key in the .env file is correct and has not been revoked.';
                 break;
            default:
                errorMessage = error.message;
                break;
        }
    }
    
    return { error: errorMessage };
  }
}
