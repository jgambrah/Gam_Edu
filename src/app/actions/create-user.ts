
'use server';

import { getAuth } from 'firebase-admin/auth';
import { initializeApp, getApps, App } from 'firebase-admin/app';

// This function ensures that we initialize the app only once.
function getAdminApp(): App {
  if (getApps().length) {
    return getApps()[0]!;
  }
  return initializeApp();
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
