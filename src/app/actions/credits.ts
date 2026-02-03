
'use server';

import { getFirestore } from 'firebase-admin/firestore';
import { initializeApp, getApps, App, cert } from 'firebase-admin/app';

// Helper function to format the private key from environment variables
const formatPrivateKey = (key: string) => {
  return key.replace(/\\n/g, '\n').replace(/"/g, '');
};

// Initializes and returns the Firebase Admin App, reusing an existing instance if available
function getAdminApp(): App {
  const existingApp = getApps().find(app => app.name === 'admin');
  if (existingApp) return existingApp;

  const projectId = process.env.FIREBASE_PROJECT_ID;
  const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
  const privateKeyRaw = process.env.FIREBASE_PRIVATE_KEY;

  if (!projectId || !clientEmail || !privateKeyRaw) {
    console.error("Firebase Admin credentials are not configured.");
    throw new Error("Missing Firebase Admin credentials.");
  }

  const privateKey = formatPrivateKey(privateKeyRaw);

  const serviceAccount = {
      projectId,
      clientEmail,
      privateKey,
  };

  return initializeApp({ credential: cert(serviceAccount) }, 'admin');
}

/**
 * Atomically checks if a school has enough credits and spends them.
 * @param schoolId The ID of the school document.
 * @param cost The number of credits to spend.
 * @returns An object indicating success or failure.
 */
export async function checkAndSpendCredits(schoolId: string, cost: number): Promise<{ success: boolean; error?: string }> {
  if (!schoolId) {
    return { success: false, error: 'School ID is required.' };
  }
  
  const adminApp = getAdminApp();
  const db = getFirestore(adminApp);
  const schoolRef = db.collection('schools').doc(schoolId);

  try {
    const success = await db.runTransaction(async (t) => {
      const doc = await t.get(schoolRef);
      if (!doc.exists) {
        // We throw an error inside the transaction to cause it to fail.
        throw new Error("School not found in the database.");
      }

      const currentCredits = doc.data()?.aiCredits || 0;

      if (currentCredits < cost) {
        // Returning false indicates failure due to insufficient credits.
        return false;
      }

      // If there are enough credits, update the document.
      t.update(schoolRef, { aiCredits: currentCredits - cost });
      return true; // Success
    });

    if (!success) {
      return { success: false, error: 'Insufficient AI credits.' };
    }

    return { success };

  } catch (error: any) {
    console.error("Credit transaction failed:", error);
    // The error message from inside the transaction will be propagated here.
    return { success: false, error: error.message || 'An unexpected error occurred during the transaction.' };
  }
}
