'use server';

import { getFirestore } from 'firebase-admin/firestore';
import { initializeApp, getApps, cert } from 'firebase-admin/app';

function getAdminApp() {
  const existingApp = getApps().find(app => app.name === 'admin');
  if (existingApp) return existingApp;

  const projectId = process.env.FIREBASE_PROJECT_ID;
  const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
  const privateKey = process.env.FIREBASE_PRIVATE_KEY;

  if (!projectId || !clientEmail || !privateKey) {
    throw new Error("Missing Firebase Admin credentials in .env file.");
  }

  return initializeApp({
    credential: cert({
      projectId,
      clientEmail,
      privateKey: privateKey.replace(/\\n/g, '\n'),
    }),
  }, 'admin');
}

/**
 * Sends a WhatsApp message using the school's configured UltraMsg instance.
 * Handles phone number sanitization for Ghana.
 */
export async function sendSchoolWhatsApp(schoolId: string, phone: string, message: string) {
  if (!schoolId || !phone) return { success: false, error: "Missing required data" };

  try {
    const db = getFirestore(getAdminApp());
    
    // 1. Get School Credentials from the secure settings path
    const schoolDoc = await db.collection('schoolSettings').doc(schoolId).get();
    const settings = schoolDoc.data();
    
    if (!settings?.enableWhatsApp || !settings?.waInstanceId || !settings?.waToken) {
        return { success: false, error: "WhatsApp automation is not fully configured for this school." };
    }

    // 2. Format Phone Number for Ghana (Convert local 0... to international 233...)
    let cleanPhone = phone.replace(/\s+/g, '');
    if (cleanPhone.startsWith('0')) {
        cleanPhone = '233' + cleanPhone.substring(1);
    }
    
    // API providers usually require the @c.us suffix for direct chats
    const whatsappNumber = `${cleanPhone}@c.us`;

    // 3. Send via UltraMsg API
    const url = `https://api.ultramsg.com/${settings.waInstanceId}/messages/chat`;
    
    const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams({
            token: settings.waToken,
            to: whatsappNumber,
            body: message
        })
    });

    const result = await response.json();
    
    if (result.sent === "true" || result.sent === true) {
        return { success: true };
    }
    
    return { success: false, error: result.error || "Provider failed to send message." };

  } catch (error: any) {
    console.error("WhatsApp Server Action Error:", error);
    return { success: false, error: error.message };
  }
}
