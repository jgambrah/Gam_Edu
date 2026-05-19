'use server';

import { getFirestore } from 'firebase-admin/firestore';
import { initializeApp, getApps, cert } from 'firebase-admin/app';

function getAdminApp() {
  const existingApp = getApps().find(app => app.name === 'admin');
  if (existingApp) return existingApp;
  
  const projectId = process.env.FIREBASE_PROJECT_ID;
  const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
  const privateKeyRaw = process.env.FIREBASE_PRIVATE_KEY;

  if (!projectId || !clientEmail || !privateKeyRaw) {
    throw new Error("Missing Firebase Admin credentials in environment variables.");
  }

  return initializeApp({
    credential: cert({
      projectId,
      clientEmail,
      privateKey: privateKeyRaw.replace(/\\n/g, '\n'),
    }),
  }, 'admin');
}

export async function getPublicInvoiceDetails(recordId: string) {
  try {
    const db = getFirestore(getAdminApp());
    
    // 1. Fetch Financial Record
    const recordDoc = await db.collection('financialRecords').doc(recordId).get();
    if (!recordDoc.exists) return { success: false, error: "Invoice not found." };
    const recordData = recordDoc.data();

    // 2. Fetch School Settings for Branding & Paystack Keys
    const schoolDoc = await db.collection('schoolSettings').doc(recordData?.schoolId).get();
    const schoolData = schoolDoc.data();

    if (!schoolData?.enablePaystack || !schoolData?.paystackPubKey) {
        return { success: false, error: "Online payments are not enabled for this school." };
    }

    const balance = (recordData?.billedAmount || 0) - (recordData?.amountPaid || 0) - (recordData?.waiverAmount || 0);

    return { 
        success: true, 
        invoice: {
            id: recordDoc.id,
            description: recordData?.description,
            studentName: recordData?.studentName,
            studentId: recordData?.studentId,
            balance: balance,
            status: recordData?.status
        },
        school: {
            id: recordData?.schoolId,
            name: schoolData?.name,
            logoUrl: schoolData?.logoUrl || null,
            primaryColor: schoolData?.brandColor || '#2563eb',
            paystackPubKey: schoolData?.paystackPubKey
        }
    };
  } catch (error: any) {
    console.error("Public Fetch Error:", error);
    return { success: false, error: "System error retrieving invoice." };
  }
}
