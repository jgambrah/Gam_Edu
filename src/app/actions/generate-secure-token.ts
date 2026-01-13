
'use server';

import { getAuth } from 'firebase-admin/auth';
import { initializeApp, getApps, App, ServiceAccount, cert } from 'firebase-admin/app';
import jwt from 'jsonwebtoken';

// --- HELPER: Fixes Vercel Key Formatting Issues ---
const formatPrivateKey = (key: string) => {
  return key.replace(/\\n/g, '\n').replace(/"/g, ''); 
};

function getAdminApp(): App {
  const existingApp = getApps().find(app => app.name === 'admin');
  if (existingApp) return existingApp;

  const projectId = process.env.FIREBASE_PROJECT_ID;
  const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
  const privateKeyRaw = process.env.FIREBASE_PRIVATE_KEY;

  if (!projectId || !clientEmail || !privateKeyRaw) {
    console.error("❌ FIREBASE CREDENTIALS MISSING IN generate-secure-token:", {
      projectId: !!projectId,
      clientEmail: !!clientEmail,
      privateKey: !!privateKeyRaw
    });
    throw new Error("Missing Firebase Admin credentials for token generation.");
  }
  
  const privateKey = formatPrivateKey(privateKeyRaw);
  
  const serviceAccount = { projectId, clientEmail, privateKey };

  return initializeApp({
    credential: cert(serviceAccount),
  }, 'admin');
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
