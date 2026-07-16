'use server';

import { getFirestore } from 'firebase-admin/firestore';
import { getAuth } from 'firebase-admin/auth';
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
export async function sendSchoolSMSAction(schoolId: string, phone: string, message: string, idToken?: string) {
  if (!schoolId || !phone) {
    return { success: false, error: "Missing school or recipient information." };
  }
  if (!idToken) {
    return { success: false, error: "Authentication required." };
  }

  try {
    const adminApp = getAdminApp();
    const db = getFirestore(adminApp);
    const auth = getAuth(adminApp);

    // Verify token
    const decodedToken = await auth.verifyIdToken(idToken);
    const callerUid = decodedToken.uid;
    
    // Verify role is Staff/Admin, and schoolId matches
    const userDoc = await db.collection('users').doc(callerUid).get();
    if (!userDoc.exists) {
      return { success: false, error: 'Unauthorized user context' };
    }
    const userData = userDoc.data();
    const callerRole = userData?.role || '';
    const callerSchoolId = userData?.schoolId || '';

    const isSuperAdmin = callerUid === "L4oE5XWweKRYrhtIXn6hB8IDHBC2" || callerUid === "gZxe3nMbGcQhNgEzkwEZwDBnkFR2";
    const isAuthorized = isSuperAdmin || (
      ['Director', 'Administrator', 'Admin', 'Teacher', 'Accountant', 'Secretary', 'Receptionist'].includes(callerRole) && 
      callerSchoolId === schoolId
    );

    if (!isAuthorized) {
      return { success: false, error: 'Unauthorized role privileges.' };
    }
    
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
 * Sends a bulk SMS message to multiple recipients in a single API call.
 * Uses a school's individual API credentials (BYOK).
 * 
 * @param schoolId - The unique ID of the school.
 * @param phones - An array of recipient phone numbers.
 * @param message - The SMS text content.
 */
export async function sendSchoolBulkSMSAction(schoolId: string, phones: string[], message: string, idToken?: string) {
  if (!schoolId || !phones || phones.length === 0) {
    return { success: false, error: "Missing school or recipient information." };
  }
  if (!idToken) {
    return { success: false, error: "Authentication required." };
  }

  try {
    const adminApp = getAdminApp();
    const db = getFirestore(adminApp);
    const auth = getAuth(adminApp);

    // Verify token
    const decodedToken = await auth.verifyIdToken(idToken);
    const callerUid = decodedToken.uid;
    
    // Verify role is Staff/Admin, and schoolId matches
    const userDoc = await db.collection('users').doc(callerUid).get();
    if (!userDoc.exists) {
      return { success: false, error: 'Unauthorized user context' };
    }
    const userData = userDoc.data();
    const callerRole = userData?.role || '';
    const callerSchoolId = userData?.schoolId || '';

    const isSuperAdmin = callerUid === "L4oE5XWweKRYrhtIXn6hB8IDHBC2" || callerUid === "gZxe3nMbGcQhNgEzkwEZwDBnkFR2";
    const isAuthorized = isSuperAdmin || (
      ['Director', 'Administrator', 'Admin', 'Teacher', 'Accountant', 'Secretary', 'Receptionist'].includes(callerRole) && 
      callerSchoolId === schoolId
    );

    if (!isAuthorized) {
      return { success: false, error: 'Unauthorized role privileges.' };
    }
    
    // 1. Fetch School Credentials from the secure settings path
    const schoolDoc = await db.collection('schoolSettings').doc(schoolId).get();
    const settings = schoolDoc.data();
    
    if (!settings?.enableSms || !settings?.smsApiKey || !settings?.smsSenderId) {
        return { success: false, error: "SMS API is not enabled or configured for this school." };
    }

    // 2. Format Phone Numbers for International Delivery (Ghana default: 233...)
    const cleanPhones = phones.map(phone => {
        let clean = phone.replace(/\s+/g, '');
        if (clean.startsWith('0')) {
            clean = '233' + clean.substring(1);
        } else if (clean.startsWith('+')) {
            clean = clean.substring(1);
        }
        return clean;
    }).filter(Boolean);

    if (cleanPhones.length === 0) {
        return { success: false, error: "No valid recipient numbers after formatting." };
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
                recipients: cleanPhones
            })
        });

        // Safe JSON parsing handling for empty responses
        const responseText = await response.text();
        if (!responseText) return { success: false, error: "Empty response from Arkesel" };
        
        const data = JSON.parse(responseText);
        if (data.status === 'success' || data.code === '1000' || data.code === 1000) {
            return { success: true, count: cleanPhones.length };
        }
        return { success: false, error: data.message || "Arkesel delivery failed." };
    } 
    
    else if (settings.smsProvider === 'hubtel') {
        // Hubtel only takes one recipient at a time in its GET API; loop over them in parallel on the server side
        const promises = cleanPhones.map(async (cleanPhone) => {
            const url = `https://smsc.hubtel.com/v1/messages/send?clientid=${settings.smsApiKey}&clientsecret=${settings.smsApiKey}&from=${encodeURIComponent(settings.smsSenderId)}&to=${cleanPhone}&content=${encodeURIComponent(message)}`;
            try {
                const res = await fetch(url, { method: 'GET' });
                return res.ok;
            } catch {
                return false;
            }
        });
        const results = await Promise.all(promises);
        const successCount = results.filter(Boolean).length;
        if (successCount > 0) {
            return { success: true, count: successCount, total: cleanPhones.length };
        }
        return { success: false, error: "Hubtel delivery failed. Check API key permissions." };
    }

    return { success: false, error: "Configured SMS provider is not recognized." };

  } catch (error: any) {
    console.error("[SMS Bulk Server Action] Critical Error:", error);
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
