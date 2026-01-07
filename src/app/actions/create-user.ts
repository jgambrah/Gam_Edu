
'use server';

import { getAuth } from 'firebase-admin/auth';
import { getFirestore } from 'firebase-admin/firestore';
import { initializeApp, getApps, App, ServiceAccount, cert } from 'firebase-admin/app';
import type { UserRole } from '@/lib/types';
import { sendWelcomeEmail } from '@/lib/email'; // Import the email function

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
    let isNewUser = false; // Flag to check if we should send an email

    // Check if a user with this email already exists in Firebase Auth.
    try {
        userRecord = await auth.getUserByEmail(email);
    } catch (error: any) {
        if (error.code === 'auth/user-not-found') {
            // User does not exist, so create them.
            userRecord = await auth.createUser({
                email: email,
                password: password,
                displayName: `${details?.firstName} ${details?.lastName}`.trim(),
            });
            isNewUser = true; // Mark as a new user
        } else {
            // A different error occurred (e.g., network issue).
            throw error;
        }
    }
    
    // At this point, userRecord is guaranteed to be a valid Auth user record, either existing or newly created.
    const selectedRole = role || 'Parent';

    // Create a document in the collection that corresponds to the user's role.
    const collectionName = selectedRole === 'Parent' ? 'parents' : selectedRole === 'Student' ? 'students' : 'staff';
    const profileDocRef = firestore.collection(collectionName).doc(userRecord.uid);
    
    const profileData: any = {
        uid: userRecord.uid,
        email: email,
        firstName: details?.firstName,
        lastName: details?.lastName,
    };
    if(collectionName === 'staff') {
        profileData.role = selectedRole;
    }
    await profileDocRef.set(profileData, { merge: true });

    // FIX: Also create a document in the 'users' collection for the security rule check.
    const userRoleRef = firestore.collection('users').doc(userRecord.uid);
    await userRoleRef.set({ role: selectedRole }, { merge: true });


    // Special handling for demo users to ensure profiles exist
    if (email === 'director@sunnyside.com') {
        const directorDocRef = firestore.collection('staff').doc(userRecord.uid);
        await directorDocRef.set({ uid: userRecord.uid, email: email, role: 'Director', firstName: 'Director', lastName: 'User' }, { merge: true });
        await firestore.collection('users').doc(userRecord.uid).set({ role: 'Director' }, { merge: true });
    }

    if (email === 'teacher@sunnyside.com') {
        const teacherDocRef = firestore.collection('staff').doc(userRecord.uid);
        await teacherDocRef.set({ uid: userRecord.uid, email: email, role: 'Teacher', firstName: 'Teacher', lastName: 'User' }, { merge: true });
        await firestore.collection('users').doc(userRecord.uid).set({ role: 'Teacher' }, { merge: true });
    }
    
    // Send welcome email ONLY if it's a new user creation
    if (isNewUser) {
        const fullName = `${details?.firstName} ${details?.lastName}`.trim();
        await sendWelcomeEmail(email, fullName || 'New User');
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
