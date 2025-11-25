
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
  role?: UserRole,
  details?: { firstName: string, lastName: string }
): Promise<{ uid: string } | { error: string }> {
  const adminApp = getAdminApp();
  const auth = getAuth(adminApp);
  const firestore = getFirestore(adminApp);

  try {
    let userRecord;
    try {
        // First, check if a user with this email already exists.
        userRecord = await auth.getUserByEmail(email);
        // If we found a user, it's a duplicate.
        return { error: `A user with email '${email}' already exists. Please use a different email address.` };
    } catch (error: any) {
        // 'auth/user-not-found' is the expected error if the user doesn't exist.
        // In that case, we can proceed with creation.
        if (error.code !== 'auth/user-not-found') {
            // For any other error (e.g., network issues), we should stop and report it.
            throw error;
        }
    }

    // If we've reached here, it means the user does not exist, so we can create them.
    userRecord = await auth.createUser({
        email: email,
        password: password,
        displayName: `${details?.firstName} ${details?.lastName}`.trim(),
    });
    
    // Instead of custom claims, write role to the correct Firestore collection.
    const selectedRole = role || 'Parent';

    if (selectedRole === 'Parent') {
        const parentDocRef = firestore.collection('parents').doc(userRecord.uid);
        await parentDocRef.set({
            uid: userRecord.uid,
            email: email,
            firstName: details?.firstName,
            lastName: details?.lastName,
            // ... any other parent-specific fields
        });
    } else { // All other roles are considered 'staff'
        const staffDocRef = firestore.collection('staff').doc(userRecord.uid);
        await staffDocRef.set({
            uid: userRecord.uid,
            email: email,
            role: selectedRole,
            firstName: details?.firstName,
            lastName: details?.lastName,
             // ... any other staff-specific fields
        });
    }

    return { uid: userRecord.uid };

  } catch (error: any) {
    console.error('Error creating/updating user:', error);
    
    let errorMessage = 'An unknown error occurred during user processing.';
    if (error.code) {
        switch(error.code) {
            case 'auth/email-already-exists':
                errorMessage = 'A user with this email address already exists. Please use a different email.';
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
