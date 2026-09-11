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
/**
 * Resolves SMS settings by checking schoolSettings and falling back to the schools collection.
 */
async function resolveSchoolSMSSettings(db: any, schoolId: string) {
  const schoolSettingsDoc = await db.collection('schoolSettings').doc(schoolId).get();
  let settings = schoolSettingsDoc.data() || {};

  // If credentials are missing in schoolSettings, check the schools collection
  if (!settings.smsApiKey || !settings.smsSenderId) {
    const schoolDoc = await db.collection('schools').doc(schoolId).get();
    if (schoolDoc.exists) {
      const schoolData = schoolDoc.data() || {};
      settings = {
        ...schoolData,
        ...settings,
        enableSms: settings.enableSms ?? schoolData.enableSms ?? schoolData.smsEnabled ?? true,
        smsApiKey: settings.smsApiKey || schoolData.smsApiKey || schoolData.arkeselApiKey,
        smsSenderId: settings.smsSenderId || schoolData.smsSenderId || schoolData.senderId || schoolData.smsSender,
        smsProvider: settings.smsProvider || schoolData.smsProvider || 'arkesel',
      };
    }
  }

  // Treat as enabled if credentials exist unless explicitly turned off
  const isEnabled = settings.enableSms !== false && Boolean(settings.smsApiKey) && Boolean(settings.smsSenderId);
  const provider = (settings.smsProvider || 'arkesel').toLowerCase();

  return {
    isEnabled,
    apiKey: settings.smsApiKey,
    senderId: settings.smsSenderId,
    provider,
    rawSettings: settings
  };
}

/**
 * Verifies caller authorization against users and staff collections.
 */
async function verifyCallerAuthorization(db: any, auth: any, idToken: string, targetSchoolId: string) {
  const decodedToken = await auth.verifyIdToken(idToken);
  const callerUid = decodedToken.uid;

  let userDoc = await db.collection('users').doc(callerUid).get();
  let userData = userDoc.exists ? userDoc.data() : null;

  if (!userData) {
    const staffDoc = await db.collection('staff').doc(callerUid).get();
    if (staffDoc.exists) {
      userData = staffDoc.data();
    }
  }

  if (!userData) {
    return { authorized: false, error: 'Unauthorized user context.' };
  }

  const callerRole = (userData.role || '').toLowerCase();
  const callerSchoolId = userData.schoolId || '';

  const isSuperAdmin = callerUid === "L4oE5XWweKRYrhtIXn6hB8IDHBC2" || callerUid === "gZxe3nMbGcQhNgEzkwEZwDBnkFR2" || callerRole === 'super admin';
  const allowedRoles = ['director', 'administrator', 'admin', 'teacher', 'accountant', 'secretary', 'receptionist', 'bursar', 'cashier', 'staff'];

  const hasAllowedRole = allowedRoles.includes(callerRole);
  const schoolMatches = !callerSchoolId || callerSchoolId === targetSchoolId;

  if (isSuperAdmin || (hasAllowedRole && schoolMatches)) {
    return { authorized: true, callerUid, userData };
  }

  return { authorized: false, error: 'Unauthorized role privileges.' };
}

function formatPhoneNumber(phone: string): string {
  let clean = phone.replace(/[\s\-\(\)]/g, '');
  if (clean.startsWith('0')) {
    clean = '233' + clean.substring(1);
  } else if (clean.startsWith('+')) {
    clean = clean.substring(1);
  }
  return clean;
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

    // Verify caller identity and permissions
    const authResult = await verifyCallerAuthorization(db, auth, idToken, schoolId);
    if (!authResult.authorized) {
      return { success: false, error: authResult.error };
    }
    
    // 1. Fetch and resolve school SMS configuration
    const smsConfig = await resolveSchoolSMSSettings(db, schoolId);
    if (!smsConfig.isEnabled || !smsConfig.apiKey || !smsConfig.senderId) {
      return { success: false, error: "SMS API is not enabled or credentials (API Key & Sender ID) are missing for this school." };
    }

    // 2. Format phone number (Ghana default: 233...)
    const cleanPhone = formatPhoneNumber(phone);
    if (!cleanPhone || cleanPhone.length < 9) {
      return { success: false, error: "Invalid recipient phone number." };
    }

    // 3. Route to provider
    if (smsConfig.provider === 'hubtel') {
      const url = `https://smsc.hubtel.com/v1/messages/send?clientid=${smsConfig.apiKey}&clientsecret=${smsConfig.apiKey}&from=${encodeURIComponent(smsConfig.senderId)}&to=${cleanPhone}&content=${encodeURIComponent(message)}`;
      const response = await fetch(url, { method: 'GET' });
      if (response.ok) {
        return { success: true };
      }
      return { success: false, error: "Hubtel delivery failed. Check API key permissions." };
    } 
    
    // Default provider: Arkesel
    const url = 'https://sms.arkesel.com/api/v2/sms/send';
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'api-key': smsConfig.apiKey,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        sender: smsConfig.senderId,
        message: message,
        recipients: [cleanPhone]
      })
    });

    const responseText = await response.text();
    if (!responseText) return { success: false, error: "Empty response from SMS provider." };

    try {
      const data = JSON.parse(responseText);
      if (data.status === 'success' || data.code === '1000' || data.code === 1000) {
        return { success: true };
      }
      return { success: false, error: data.message || "SMS delivery rejected by provider." };
    } catch {
      if (response.ok) return { success: true };
      return { success: false, error: "Failed to parse provider response: " + responseText.substring(0, 100) };
    }

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

    // Verify caller identity and permissions
    const authResult = await verifyCallerAuthorization(db, auth, idToken, schoolId);
    if (!authResult.authorized) {
      return { success: false, error: authResult.error };
    }
    
    // 1. Fetch and resolve school SMS configuration
    const smsConfig = await resolveSchoolSMSSettings(db, schoolId);
    if (!smsConfig.isEnabled || !smsConfig.apiKey || !smsConfig.senderId) {
      return { success: false, error: "SMS API is not enabled or credentials (API Key & Sender ID) are missing for this school." };
    }

    // 2. Format recipient numbers
    const cleanPhones = phones
      .map(formatPhoneNumber)
      .filter(p => p && p.length >= 9);

    if (cleanPhones.length === 0) {
      return { success: false, error: "No valid recipient numbers after formatting." };
    }

    // 3. Route to provider
    if (smsConfig.provider === 'hubtel') {
      const promises = cleanPhones.map(async (cleanPhone) => {
        const url = `https://smsc.hubtel.com/v1/messages/send?clientid=${smsConfig.apiKey}&clientsecret=${smsConfig.apiKey}&from=${encodeURIComponent(smsConfig.senderId)}&to=${cleanPhone}&content=${encodeURIComponent(message)}`;
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
      return { success: false, error: "Hubtel bulk delivery failed." };
    }

    // Default provider: Arkesel
    const url = 'https://sms.arkesel.com/api/v2/sms/send';
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'api-key': smsConfig.apiKey,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        sender: smsConfig.senderId,
        message: message,
        recipients: cleanPhones
      })
    });

    const responseText = await response.text();
    if (!responseText) return { success: false, error: "Empty response from SMS provider." };

    try {
      const data = JSON.parse(responseText);
      if (data.status === 'success' || data.code === '1000' || data.code === 1000) {
        return { success: true, count: cleanPhones.length };
      }
      return { success: false, error: data.message || "Arkesel bulk delivery failed." };
    } catch {
      if (response.ok) return { success: true, count: cleanPhones.length };
      return { success: false, error: "Failed to parse provider response: " + responseText.substring(0, 100) };
    }

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
