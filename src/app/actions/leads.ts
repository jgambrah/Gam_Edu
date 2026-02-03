
'use server';

import { Resend } from 'resend';
import { getFirestore } from 'firebase-admin/firestore';
import { initializeApp, getApps, App, cert } from 'firebase-admin/app';

// Helper function to format the private key from environment variables
const formatPrivateKey = (key: string) => {
  return key.replace(/\\n/g, '\n').replace(/"/g, '');
};

// 1. Initialize Admin SDK (Reuse this logic)
function getAdminApp(): App {
  const existingApp = getApps().find(app => app.name === 'admin');
  if (existingApp) return existingApp;

  const projectId = process.env.FIREBASE_PROJECT_ID;
  const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
  const privateKeyRaw = process.env.FIREBASE_PRIVATE_KEY;

  if (!projectId || !clientEmail || !privateKeyRaw) {
    throw new Error("Missing Firebase Admin credentials.");
  }
  
  const privateKey = formatPrivateKey(privateKeyRaw);

  return initializeApp({
    credential: cert({
      projectId,
      clientEmail,
      privateKey,
    }),
  }, 'admin');
}

const apiKey = process.env.RESEND_API_KEY;
const resend = apiKey ? new Resend(apiKey) : null;

// 2. Main Function
export async function submitSchoolLead(formData: FormData) {
  const schoolName = formData.get('schoolName') as string;
  const contactName = formData.get('contactName') as string;
  const email = formData.get('email') as string;
  const phone = formData.get('phone') as string;
  const studentCount = formData.get('studentCount') as string;

  if (!schoolName || !email || !contactName) {
    return { error: 'Missing required fields' };
  }

  try {
    // A. Save to Firestore 'leads' collection
    const adminApp = getAdminApp();
    const db = getFirestore(adminApp);
    
    await db.collection('leads').add({
      schoolName,
      contactName,
      email,
      phone,
      studentCount,
      status: 'pending', // pending, approved, rejected
      createdAt: new Date()
    });

    // B. Send Email Notification
    if (resend) {
      await resend.emails.send({
        from: 'GAM Sales <info@gam-it-service.app>',
        to: 'jamesgambrah@gmail.com',
        subject: `🚀 New Lead: ${schoolName}`,
        html: `
          <h1>New School Lead</h1>
          <p><strong>School:</strong> ${schoolName}</p>
          <p><strong>Contact:</strong> ${contactName}</p>
          <p><strong>Email:</strong> ${email}</p>
          <p><strong>Phone:</strong> ${phone}</p>
          <p><i>Log in to your CEO Portal to approve this lead.</i></p>
        `
      });
    }

    return { success: true };

  } catch (error: any) {
    console.error('Lead Submission Failed:', error);
    return { error: 'Failed to submit request.' };
  }
}

// ... keep your sendSchoolCredentialsEmail function here too ...
export async function sendSchoolCredentialsEmail(email: string, name: string, schoolName: string, password: string) {
    // ... (Keep existing code) ...
    if(resend) {
         await resend.emails.send({
            from: 'GAM Edu <info@gam-it-service.app>',
            to: email,
            subject: `Welcome to GAM Edu - ${schoolName} Portal Access`,
            html: `... (Your HTML) ...` 
         });
    }
}
