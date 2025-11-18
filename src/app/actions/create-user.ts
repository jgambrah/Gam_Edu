'use server';

import { getAuth } from 'firebase-admin/auth';
import { getFirestore } from 'firebase-admin/firestore';
import { initializeApp, getApps } from 'firebase-admin/app';

// Initialize Firebase Admin SDK
if (!getApps().length) {
  initializeApp();
}

const auth = getAuth();
const firestore = getFirestore();

export async function createNewUser(
  email: string,
  password: string
): Promise<{ uid: string } | { error: string }> {
  try {
    const userRecord = await auth.createUser({
      email: email,
      password: password,
    });
    return { uid: userRecord.uid };
  } catch (error: any) {
    console.error('Error creating new user:', error);
    return { error: error.message };
  }
}
