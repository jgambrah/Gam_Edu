
'use server';

import { getAuth } from 'firebase-admin/auth';
import { initializeApp, getApps, App, ServiceAccount, cert } from 'firebase-admin/app';
import jwt from 'jsonwebtoken';

function getAdminApp(): App {
  const existingApp = getApps().find(app => app.name === 'admin');
  if (existingApp) return existingApp;

  const serviceAccountString = process.env.FIREBASE_SERVICE_ACCOUNT_KEY;
  if (!serviceAccountString) {
    throw new Error("The FIREBASE_SERVICE_ACCOUNT_KEY environment variable is not set.");
  }
  
  try {
    const serviceAccount: ServiceAccount = JSON.parse(serviceAccountString);

    return initializeApp({
      credential: cert(serviceAccount),
    }, 'admin');

  } catch (error: any) {
    console.error("Failed to parse Firebase service account key:", error.message);
    throw new Error("Firebase service account key is not a valid JSON object.");
  }
}

export async function generateSecureToken(uid: string): Promise<string> {
  const adminApp = getAdminApp();
  const auth = getAuth(adminApp);
  
  // 1. Verify the user exists to prevent generating tokens for fake UIDs
  try {
    await auth.getUser(uid);
  } catch (error) {
    console.error("Token generation failed: User does not exist.", error);
    throw new Error("Invalid user for token generation.");
  }

  // 2. Get the secret key from environment variables
  const secretKey = process.env.JWT_SECRET_KEY;
  if (!secretKey) {
    throw new Error("JWT_SECRET_KEY is not configured on the server.");
  }

  // 3. Create a short-lived token (e.g., expires in 2 minutes)
  const payload = { 
    uid,
    iss: 'CampusConnect', // Issuer
  };
  
  const token = jwt.sign(payload, secretKey, { expiresIn: '2m' });

  return token;
}
