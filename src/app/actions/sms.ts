'use server';

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
 * Sends an SMS message using a school's individual API credentials (BYOK).
 * Supports Arkesel and Hubtel.
 * 
 * @param schoolId - The unique ID of the school.
 * @param phone - The recipient's phone number.
 * @param message - The SMS text content.
 */
export async function sendSchoolSMSAction(schoolId: string, phone: string, message: string) {
  if (!schoolId || !phone) {
    return { success: false, error: "Missing school or recipient information." };
  }

  try {
    const db = getFirestore(getAdminApp());
    
    // 1. Fetch School Credentials from the secure settings path
    const schoolDoc = await db.collection('schoolSettings').doc(schoolId).get();
    const settings = schoolDoc.data();
    
    if (!settings?.enableSms || !settings?.smsApiKey || !settings?.smsSenderId) {
        return { success: false, error: "SMS API is not enabled or configured for this school." };
    }

    // 2. Format Phone Number for International Delivery (Ghana default: 233...)
    let cleanPhone = phone.replace(/\s+/g, '');
    if (cleanPhone.startsWith('0')) {
        cleanPhone = '233' + cleanPhone.substring(1);
    } else if (cleanPhone.startsWith('+')) {
        cleanPhone = cleanPhone.substring(1);
    }

    // 3. Route to the correct provider based on school configuration
    if (settings.smsProvider === 'arkesel') {
        const url = 'https://sms.arkesel.com/api/v2/sms/send';
        
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'api-key': settings.smsApiKey,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                sender: settings.smsSenderId,
                message: message,
                recipients: [cleanPhone]
            })
        });

        // Safe JSON parsing handling for empty responses
        const responseText = await response.text();
        if (!responseText) return { success: false, error: "Empty response from Arkesel" };
        
        const data = JSON.parse(responseText);
        if (data.status === 'success' || data.code === '1000' || data.code === 1000) {
            return { success: true };
        }
        return { success: false, error: data.message || "Arkesel delivery failed." };
    } 
    
    else if (settings.smsProvider === 'hubtel') {
        // Hubtel Basic Send API (using Client Credentials)
        // Hubtel often uses clientId and clientSecret, if they only provide one "API Key", we use it for both for simple integrations.
        const url = `https://smsc.hubtel.com/v1/messages/send?clientid=${settings.smsApiKey}&clientsecret=${settings.smsApiKey}&from=${encodeURIComponent(settings.smsSenderId)}&to=${cleanPhone}&content=${encodeURIComponent(message)}`;
        
        const response = await fetch(url, { method: 'GET' });
        
        if (response.ok) {
            return { success: true };
        }
        return { success: false, error: "Hubtel delivery failed. Check API key permissions." };
    }

    return { success: false, error: "Configured SMS provider is not recognized." };

  } catch (error: any) {
    console.error("[SMS Server Action] Critical Error:", error);
    return { success: false, error: error.message || "An unexpected server error occurred during SMS routing." };
  }
}

/**
 * @deprecated Use sendSchoolSMSAction instead to ensure correct school billing attribution.
 */
export async function sendSMSAction(phone: string, message: string) {
    console.warn("sendSMSAction is deprecated. Use sendSchoolSMSAction with schoolId.");
    return { success: false, error: "System migration in progress. Use institutional SMS hub." };
}
