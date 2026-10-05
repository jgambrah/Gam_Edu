'use server';

import { getAdminDb, getAdminAuth, FieldValue } from '@/lib/firebaseAdmin';

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
        name: settings.name || schoolData.name,
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
    schoolName: settings.name || 'School',
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
  const allowedRoles = [
    'super admin', 'administrator', 'director', 'principal', 'headmaster', 'headmistress',
    'admin', 'school_admin', 'teacher', 'accountant', 'accounts officer', 'finance', 'finance officer',
    'bursar', 'cashier', 'secretary', 'receptionist', 'staff'
  ];

  const hasAllowedRole = allowedRoles.includes(callerRole);
  const schoolMatches = !callerSchoolId || callerSchoolId === targetSchoolId;

  if (isSuperAdmin || (hasAllowedRole && schoolMatches)) {
    return { authorized: true, callerUid, userData };
  }

  return { authorized: false, error: 'Unauthorized role privileges.' };
}

/**
 * Parses and normalizes phone numbers into E.164-compatible Ghana format (233...).
 * Handles multiple numbers separated by commas, slashes, semicolons, etc.
 */
function extractAndFormatPhoneNumbers(rawPhone: any): string[] {
  if (!rawPhone) return [];
  const parts = String(rawPhone).split(/[,/;\&|]+/);
  const results: string[] = [];

  for (const part of parts) {
    let clean = part.replace(/[\s\-\(\)\.]/g, '');
    if (clean.startsWith('+')) clean = clean.substring(1);
    if (clean.startsWith('00')) clean = clean.substring(2);
    if (clean.startsWith('0')) clean = '233' + clean.substring(1);
    else if (clean.length === 9 && !clean.startsWith('233')) clean = '233' + clean;

    // Validate digits only and valid length (Ghana mobile is 12 digits starting with 233)
    if (/^\d{9,15}$/.test(clean)) {
      if (!results.includes(clean)) {
        results.push(clean);
      }
    }
  }
  return results;
}

function formatPhoneNumber(phone: string): string {
  const list = extractAndFormatPhoneNumbers(phone);
  return list[0] || '';
}

/**
 * Resolves phone numbers for a student by checking:
 * 1. Direct phone fields on the student document
 * 2. student.parentId linked parent document and user document
 * 3. parents collection where studentIds array-contains student document ID
 * 4. parents collection where studentIds array-contains student admission number
 */
async function resolveParentPhonesForStudent(db: any, schoolId: string, studentId: string, studentName?: string) {
  const candidatePhones: string[] = [];
  let studentDocId = studentId;
  let studentData: any = null;

  if (studentId) {
    // 1. Check student by document ID
    const sDoc = await db.collection('students').doc(studentId).get();
    if (sDoc.exists) {
      studentData = sDoc.data();
      studentDocId = sDoc.id;
    } else {
      // Try admission number
      const q = await db.collection('students').where('schoolId', '==', schoolId).where('studentId', '==', studentId).get();
      if (!q.empty) {
        studentData = q.docs[0].data();
        studentDocId = q.docs[0].id;
      } else {
        const q2 = await db.collection('students').where('schoolId', '==', schoolId).where('uid', '==', studentId).get();
        if (!q2.empty) {
          studentData = q2.docs[0].data();
          studentDocId = q2.docs[0].id;
        }
      }
    }
  }

  if (studentData) {
    // A. Direct fields on student document
    const directFields = [
      studentData.parentPhone, studentData.guardianPhone, studentData.emergencyPhone,
      studentData.phone, studentData.phoneNumber, studentData.fatherPhone,
      studentData.motherPhone, studentData.contactNumber, studentData.telephone,
      studentData.smsPhone, studentData.emergencyContact?.phone,
      studentData.parent1?.phone, studentData.parent2?.phone
    ];
    for (const p of directFields) {
      if (p) candidatePhones.push(...extractAndFormatPhoneNumbers(p));
    }

    // B. Check student.parentId in parents and users collection
    if (studentData.parentId) {
      const pDoc = await db.collection('parents').doc(studentData.parentId).get();
      if (pDoc.exists) {
        const pd = pDoc.data();
        const pPhone = pd.phone || pd.phoneNumber || pd.telephone || pd.contactNumber;
        if (pPhone) candidatePhones.push(...extractAndFormatPhoneNumbers(pPhone));
      }
      const uDoc = await db.collection('users').doc(studentData.parentId).get();
      if (uDoc.exists) {
        const ud = uDoc.data();
        const uPhone = ud.phone || ud.phoneNumber || ud.telephone;
        if (uPhone) candidatePhones.push(...extractAndFormatPhoneNumbers(uPhone));
      }
    }
  }

  // C. Query parents collection by studentIds array-contains studentDocId
  if (studentDocId) {
    const qParents = await db.collection('parents').where('schoolId', '==', schoolId).where('studentIds', 'array-contains', studentDocId).get();
    qParents.forEach((p: any) => {
      const pd = p.data();
      const pPhone = pd.phone || pd.phoneNumber || pd.telephone || pd.contactNumber;
      if (pPhone) candidatePhones.push(...extractAndFormatPhoneNumbers(pPhone));
    });
  }

  // D. Query parents collection by student admission number
  if (studentData && studentData.studentId && studentData.studentId !== studentDocId) {
    const qParents2 = await db.collection('parents').where('schoolId', '==', schoolId).where('studentIds', 'array-contains', studentData.studentId).get();
    qParents2.forEach((p: any) => {
      const pd = p.data();
      const pPhone = pd.phone || pd.phoneNumber || pd.telephone || pd.contactNumber;
      if (pPhone) candidatePhones.push(...extractAndFormatPhoneNumbers(pPhone));
    });
  }

  const uniquePhones = Array.from(new Set(candidatePhones));
  return {
    studentDocId,
    studentData,
    phones: uniquePhones
  };
}

export type SendPaymentSMSParams = {
  schoolId: string;
  studentId: string;
  studentName: string;
  paymentAmount: number;
  feeType: string;
  receiptId: string;
  paymentMethod: string;
  remainingBalance?: number;
  idToken?: string;
  senderName?: string;
  senderRole?: string;
};

/**
 * Automatically dispatches an SMS notification to the parent when a fee payment is recorded.
 * Resolves parent phone number automatically and logs delivery in the sms_logs collection.
 */
export async function sendPaymentSMSNotificationAction(params: SendPaymentSMSParams) {
  const {
    schoolId,
    studentId,
    studentName,
    paymentAmount,
    feeType,
    receiptId,
    paymentMethod,
    remainingBalance,
    idToken
  } = params;

  if (!schoolId || !studentId) {
    return { success: false, error: 'Missing school or student identifier.' };
  }
  if (!idToken) {
    return { success: false, error: 'Authentication required to send SMS.' };
  }

  try {
    const db = getAdminDb();
    const auth = getAdminAuth();

    // Verify caller permissions
    const authResult = await verifyCallerAuthorization(db, auth, idToken, schoolId);
    if (!authResult.authorized) {
      return { success: false, error: authResult.error };
    }

    // 1. Fetch SMS settings
    const smsConfig = await resolveSchoolSMSSettings(db, schoolId);
    if (!smsConfig.isEnabled || !smsConfig.apiKey || !smsConfig.senderId) {
      console.warn(`[Payment SMS] Skipped for school ${schoolId}: SMS not enabled or missing credentials.`);
      return { success: false, skipped: true, error: 'SMS API is not enabled or credentials are missing.' };
    }

    // 2. Resolve parent phone numbers
    const resolution = await resolveParentPhonesForStudent(db, schoolId, studentId, studentName);
    const phones = resolution.phones;

    if (!phones || phones.length === 0) {
      console.warn(`[Payment SMS] No phone number resolved for student ${studentName} (${studentId}) at school ${schoolId}.`);
      return { success: false, skipped: true, error: `No parent phone number on file for ${studentName}.` };
    }

    // 3. Format SMS message (Ghana standard GSM-7, no unicode quote corruption)
    const cleanSchool = (smsConfig.senderId || smsConfig.schoolName || 'School').trim();
    const balSnippet = (remainingBalance !== undefined && remainingBalance > 0)
      ? ` Bal: GHS ${remainingBalance.toFixed(2)}.`
      : (remainingBalance === 0 ? ` Paid in full.` : '');
    const cleanFee = (feeType || 'Fees').trim();
    const cleanMethod = (paymentMethod || 'Cash').trim();

    const message = `Receipt: ${receiptId}. GHS ${paymentAmount.toFixed(2)} received for ${studentName} (${cleanFee}). Method: ${cleanMethod}.${balSnippet} Thanks! - ${cleanSchool}`;

    // 4. Send via provider
    let sendSuccess = false;
    let providerError = '';

    if (smsConfig.provider === 'hubtel') {
      const promises = phones.map(async (cleanPhone) => {
        const url = `https://smsc.hubtel.com/v1/messages/send?clientid=${smsConfig.apiKey}&clientsecret=${smsConfig.apiKey}&from=${encodeURIComponent(smsConfig.senderId)}&to=${cleanPhone}&content=${encodeURIComponent(message)}`;
        try {
          const res = await fetch(url, { method: 'GET' });
          return res.ok;
        } catch {
          return false;
        }
      });
      const results = await Promise.all(promises);
      sendSuccess = results.some(Boolean);
      if (!sendSuccess) providerError = 'Hubtel delivery failed.';
    } else {
      // Default: Arkesel v2
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
          recipients: phones
        })
      });

      const responseText = await response.text();
      try {
        const data = JSON.parse(responseText);
        if (data.status === 'success' || data.code === '1000' || data.code === 1000) {
          sendSuccess = true;
        } else {
          providerError = data.message || 'SMS delivery rejected by Arkesel.';
        }
      } catch {
        sendSuccess = response.ok;
        if (!sendSuccess) providerError = `Provider response: ${responseText.substring(0, 100)}`;
      }
    }

    // 5. Audit log in sms_logs
    try {
      await db.collection('sms_logs').add({
        schoolId,
        type: 'PAYMENT_RECEIPT',
        studentId: resolution.studentDocId || studentId,
        studentName,
        receiptId,
        paymentAmount,
        paymentMethod: cleanMethod,
        feeType: cleanFee,
        remainingBalance: remainingBalance ?? null,
        recipients: phones,
        message,
        provider: smsConfig.provider,
        senderId: smsConfig.senderId,
        status: sendSuccess ? 'DELIVERED' : 'FAILED',
        error: sendSuccess ? null : providerError,
        sentByUid: authResult.callerUid,
        createdAt: FieldValue.serverTimestamp()
      });
    } catch (logErr) {
      console.warn('[Payment SMS] Could not write sms_log:', logErr);
    }

    if (sendSuccess) {
      console.log(`[Payment SMS] Dispatched receipt ${receiptId} to ${phones.join(', ')} for ${studentName}`);
      return { success: true, count: phones.length, phones, message };
    } else {
      console.warn(`[Payment SMS] Delivery failed: ${providerError}`);
      return { success: false, error: providerError };
    }

  } catch (error: any) {
    console.error('[Payment SMS Action] Critical Error:', error);
    return { success: false, error: error.message || 'An unexpected error occurred during SMS notification.' };
  }
}

export type BulkPaymentSMSParams = {
  schoolId: string;
  payments: Array<{
    studentId: string;
    studentName: string;
    paymentAmount: number;
    feeType: string;
    receiptId: string;
    paymentMethod: string;
    remainingBalance?: number;
  }>;
  idToken?: string;
};

/**
 * Processes automated payment SMS receipts for a bulk batch of processed student payments.
 */
export async function sendBulkPaymentSMSNotificationAction(params: BulkPaymentSMSParams) {
  const { schoolId, payments, idToken } = params;

  if (!schoolId || !payments || payments.length === 0) {
    return { success: false, error: 'Missing school or payment items.' };
  }
  if (!idToken) {
    return { success: false, error: 'Authentication required.' };
  }

  try {
    const db = getAdminDb();
    const auth = getAdminAuth();

    // Verify caller once
    const authResult = await verifyCallerAuthorization(db, auth, idToken, schoolId);
    if (!authResult.authorized) {
      return { success: false, error: authResult.error };
    }

    // Verify school SMS configuration once
    const smsConfig = await resolveSchoolSMSSettings(db, schoolId);
    if (!smsConfig.isEnabled || !smsConfig.apiKey || !smsConfig.senderId) {
      return { success: false, skipped: true, error: 'SMS API is not enabled or credentials are missing for this school.' };
    }

    let successCount = 0;
    let failedCount = 0;
    let skippedCount = 0;

    // Process payments in parallel batches of 5 to avoid throttling
    const chunkSize = 5;
    for (let i = 0; i < payments.length; i += chunkSize) {
      const chunk = payments.slice(i, i + chunkSize);
      await Promise.allSettled(chunk.map(async (p) => {
        try {
          const res = await sendPaymentSMSNotificationAction({
            schoolId,
            studentId: p.studentId,
            studentName: p.studentName,
            paymentAmount: p.paymentAmount,
            feeType: p.feeType,
            receiptId: p.receiptId,
            paymentMethod: p.paymentMethod || 'Cash',
            remainingBalance: p.remainingBalance,
            idToken
          });
          if (res.success) {
            successCount++;
          } else if (res.skipped) {
            skippedCount++;
          } else {
            failedCount++;
          }
        } catch {
          failedCount++;
        }
      }));
    }

    return {
      success: true,
      total: payments.length,
      successCount,
      failedCount,
      skippedCount
    };

  } catch (error: any) {
    console.error('[Bulk Payment SMS Action] Error:', error);
    return { success: false, error: error.message || 'Bulk payment SMS dispatch failed.' };
  }
}

/**
 * Sends an SMS message using a school's individual API credentials (BYOK).
 * Supports Arkesel and Hubtel.
 */
export async function sendSchoolSMSAction(schoolId: string, phone: string, message: string, idToken?: string) {
  if (!schoolId || !phone) {
    return { success: false, error: "Missing school or recipient information." };
  }
  if (!idToken) {
    return { success: false, error: "Authentication required." };
  }

  try {
    const db = getAdminDb();
    const auth = getAdminAuth();

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
    const cleanPhones = extractAndFormatPhoneNumbers(phone);
    if (cleanPhones.length === 0) {
      return { success: false, error: "Invalid recipient phone number." };
    }
    const cleanPhone = cleanPhones[0];

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
 */
export async function sendSchoolBulkSMSAction(schoolId: string, phones: string[], message: string, idToken?: string) {
  if (!schoolId || !phones || phones.length === 0) {
    return { success: false, error: "Missing school or recipient information." };
  }
  if (!idToken) {
    return { success: false, error: "Authentication required." };
  }

  try {
    const db = getAdminDb();
    const auth = getAdminAuth();

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
    const cleanPhones: string[] = [];
    for (const p of phones) {
      cleanPhones.push(...extractAndFormatPhoneNumbers(p));
    }
    const uniqueCleanPhones = Array.from(new Set(cleanPhones));

    if (uniqueCleanPhones.length === 0) {
      return { success: false, error: "No valid recipient numbers after formatting." };
    }

    // 3. Route to provider
    if (smsConfig.provider === 'hubtel') {
      const promises = uniqueCleanPhones.map(async (cleanPhone) => {
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
        return { success: true, count: successCount, total: uniqueCleanPhones.length };
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
        recipients: uniqueCleanPhones
      })
    });

    const responseText = await response.text();
    if (!responseText) return { success: false, error: "Empty response from SMS provider." };

    try {
      const data = JSON.parse(responseText);
      if (data.status === 'success' || data.code === '1000' || data.code === 1000) {
        return { success: true, count: uniqueCleanPhones.length };
      }
      return { success: false, error: data.message || "Arkesel bulk delivery failed." };
    } catch {
      if (response.ok) return { success: true, count: uniqueCleanPhones.length };
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
