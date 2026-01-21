'use server';

import { getAuth } from 'firebase-admin/auth';
import { getFirestore } from 'firebase-admin/firestore';
import { initializeApp, getApps, App, ServiceAccount, cert } from 'firebase-admin/app';
import { sendSchoolCredentialsEmail } from '@/lib/email';

// --- HELPER: Fixes Vercel Key Formatting Issues ---
const formatPrivateKey = (key: string) => {
  return key.replace(/\\n/g, '\n').replace(/"/g, ''); 
};

function getAdminApp(): App {
  const existingApp = getApps().find(app => app.name === 'admin');
  if (existingApp) return existingApp;

  const projectId = process.env.FIREBASE_PROJECT_ID;
  const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
  const privateKeyRaw = process.env.FIREBASE_PRIVATE_KEY;

  if (!projectId || !clientEmail || !privateKeyRaw) {
    console.error("❌ FIREBASE CREDENTIALS MISSING:", {
      projectId: !!projectId,
      clientEmail: !!clientEmail,
      privateKey: !!privateKeyRaw
    });
    throw new Error("Missing Firebase Admin credentials.");
  }
  
  const privateKey = formatPrivateKey(privateKeyRaw);
  
  const serviceAccount = { projectId, clientEmail, privateKey };

  return initializeApp({
    credential: cert(serviceAccount),
  }, 'admin');
}

export async function createNewUser(
  email: string,
  password: string,
  role?: string,
  details?: { firstName: string, lastName: string },
  schoolId?: string 
) {
  console.log("🚀 Starting User Creation for:", email);

  try {
    const adminApp = getAdminApp();
    const auth = getAuth(adminApp);
    const firestore = getFirestore(adminApp);

    let userRecord;
    
    // 1. Auth Creation
    try {
        userRecord = await auth.getUserByEmail(email);
        console.log("User already exists, linking to new school...");
    } catch (error: any) {
        if (error.code === 'auth/user-not-found') {
            console.log("Creating new Auth User...");
            userRecord = await auth.createUser({
                email,
                password,
                displayName: `${details?.firstName} ${details?.lastName}`,
            });
        } else {
            throw error; 
        }
    }
    
    // 2. Firestore Profile Creation
    let collectionName: string;
    switch (role) {
        case 'Student':
            collectionName = 'students';
            break;
        case 'Parent':
            collectionName = 'parents';
            break;
        default:
            collectionName = 'staff';
            break;
    }
    
    const profileData: any = {
        uid: userRecord.uid,
        email,
        firstName: details?.firstName,
        lastName: details?.lastName,
        role: role || 'Parent',
        createdAt: new Date(),
        isActive: true
    };

    if (schoolId) profileData.schoolId = schoolId;

    await firestore.collection(collectionName).doc(userRecord.uid).set(profileData, { merge: true });
    
    // 3. User Mapping
    await firestore.collection('users').doc(userRecord.uid).set({
        role: role || 'Parent',
        schoolId: schoolId,
        email
    }, { merge: true });
    
    // 4. Send Credentials Email (Integrated Step)
    if (details?.firstName && schoolId) {
        const schoolDoc = await firestore.collection('schools').doc(schoolId).get();
        const schoolName = schoolDoc.data()?.name || 'Your School';
        await sendSchoolCredentialsEmail(email, details.firstName, schoolName, password);
    }

    console.log("✅ User Created Successfully");
    return { uid: userRecord.uid, success: true };

  } catch (error: any) {
    console.error("❌ FATAL SERVER ERROR:", error);
    return { error: error.message || 'Internal Server Error' };
  }
}
