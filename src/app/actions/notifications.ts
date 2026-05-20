'use server';

import { getMessaging } from 'firebase-admin/messaging';
import { getFirestore } from 'firebase-admin/firestore';
import { initializeApp, getApps, cert } from 'firebase-admin/app';

/**
 * Initializes and returns the Firebase Admin App instance.
 * Uses a named 'admin' instance to avoid conflicts.
 */
function getAdminApp() {
  const existingApp = getApps().find(app => app.name === 'admin');
  if (existingApp) return existingApp;

  const serviceAccount = {
    projectId: process.env.FIREBASE_PROJECT_ID,
    clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
    privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
  };

  return initializeApp({ credential: cert(serviceAccount) }, 'admin');
}

/**
 * Sends a push notification to parents linked to specific students.
 * Handles Firestore 'array-contains-any' limit of 30 by chunking studentIds.
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

    // 1. Chunk studentIds into groups of 30 (Firestore limit for array-contains-any)
    const chunks: string[][] = [];
    for (let i = 0; i < studentIds.length; i += 30) {
      chunks.push(studentIds.slice(i, i + 30));
    }

    // 2. Fetch all parents linked to these students in parallel
    const parentSnapshots = await Promise.all(
      chunks.map(chunk => 
        db.collection('parents').where('studentIds', 'array-contains-any', chunk).get()
      )
    );

    // 3. Collect all unique parent FCM Tokens
    const tokensSet = new Set<string>();
    parentSnapshots.forEach(snap => {
      snap.docs.forEach(doc => {
        const data = doc.data();
        if (data.fcmTokens && Array.isArray(data.fcmTokens)) {
          data.fcmTokens.forEach((token: string) => tokensSet.add(token));
        }
      });
    });

    const tokens = Array.from(tokensSet);

    if (tokens.length === 0) {
      return { success: true, message: 'No devices are registered for push notifications.' };
    }

    // 4. Send the Multicast Message (FCM limit is 500 tokens per multicast)
    // For very large schools, we'd chunk tokens here too, but for one class it's safe.
    const messagePayload = {
      notification: { title, body },
      data: { url }, 
      tokens: tokens,
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
