'use server';

import { getMessaging } from 'firebase-admin/messaging';
import { getFirestore } from 'firebase-admin/firestore';
import { initializeApp, getApps, cert, type App } from 'firebase-admin/app';

/**
 * Initializes and returns the Firebase Admin App instance.
 * Uses a named 'admin' instance to avoid conflicts.
 */
function getAdminApp(): App {
  const existingApp = getApps().find(app => app.name === 'admin');
  if (existingApp) return existingApp;

  const projectId = process.env.FIREBASE_PROJECT_ID;
  const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
  const privateKeyRaw = process.env.FIREBASE_PRIVATE_KEY;

  if (!projectId || !clientEmail || !privateKeyRaw) {
    throw new Error("Missing Firebase Admin credentials for notifications.");
  }
  
  const privateKey = privateKeyRaw.replace(/\\n/g, '\n').replace(/"/g, '');
  
  const serviceAccount = { projectId, clientEmail, privateKey };

  return initializeApp({
    credential: cert(serviceAccount),
  }, 'admin');
}

/**
 * Sends a push notification to parents linked to specific students.
 * 
 * @param studentIds - Array of student UIDs whose parents should be notified.
 * @param title - The title of the notification.
 * @param body - The body text of the notification.
 * @param url - The dashboard URL to open when the notification is tapped.
 */
export async function notifyParents(studentIds: string[], title: string, body: string, url: string) {
  if (!studentIds || studentIds.length === 0) {
    return { success: false, error: 'No students provided for notification.' };
  }

  try {
    const adminApp = getAdminApp();
    const db = getFirestore(adminApp);
    const messaging = getMessaging(adminApp);

    // 1. Find all parents linked to these students
    // We search the 'parents' collection for documents where the studentIds array contains any of our targets
    const parentsSnap = await db.collection('parents')
      .where('studentIds', 'array-contains-any', studentIds)
      .get();

    if (parentsSnap.empty) {
      return { success: true, message: 'No linked parents found to notify.' };
    }

    // 2. Collect all FCM Tokens from the matched parents
    let allTokens: string[] = [];
    parentsSnap.docs.forEach(doc => {
      const data = doc.data();
      if (data.fcmTokens && Array.isArray(data.fcmTokens)) {
        allTokens = [...allTokens, ...data.fcmTokens];
      }
    });

    // Deduplicate tokens
    const uniqueTokens = Array.from(new Set(allTokens)).filter(t => !!t);

    if (uniqueTokens.length === 0) {
      return { success: true, message: 'Parents found, but no devices are registered for push notifications.' };
    }

    // 3. Send the Multicast Message
    const messagePayload = {
      notification: { title, body },
      data: { url }, // Custom data used by the service worker to route the user
      tokens: uniqueTokens,
    };

    const response = await messaging.sendEachForMulticast(messagePayload);
    
    console.log(`[Push Notification] Success: ${response.successCount}, Failure: ${response.failureCount}`);
    
    return { 
      success: true, 
      sentCount: response.successCount, 
      failedCount: response.failureCount 
    };

  } catch (error: any) {
    console.error('Push Notification Error:', error);
    return { success: false, error: error.message || 'Failed to send notification.' };
  }
}
