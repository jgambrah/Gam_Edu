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
  schoolId?: string,
  idToken?: string
) {
  console.log("🚀 Starting User Creation for:", email);

  try {
    const adminApp = getAdminApp();
    const auth = getAuth(adminApp);
    const firestore = getFirestore(adminApp);

    // --- SECURE: Caller Authentication and Authorization Check ---
    if (!idToken) {
      throw new Error("Authentication token required.");
    }

    const decodedToken = await auth.verifyIdToken(idToken);
    const callerUid = decodedToken.uid;
    const isSuperAdmin = callerUid === "L4oE5XWweKRYrhtIXn6hB8IDHBC2" || callerUid === "gZxe3nMbGcQhNgEzkwEZwDBnkFR2";

    let callerSchoolId = "";
    let callerRole = "";

    if (!isSuperAdmin) {
      const callerUserSnap = await firestore.collection('users').doc(callerUid).get();
      if (!callerUserSnap.exists) {
        throw new Error("Unauthorized caller profile context.");
      }
      const callerData = callerUserSnap.data();
      callerSchoolId = callerData?.schoolId || "";
      callerRole = callerData?.role || "";

      if (!['Director', 'Administrator', 'Admin'].includes(callerRole)) {
        throw new Error("Unauthorized role privileges.");
      }
    }

    // Force target schoolId to match caller's schoolId unless Super Admin
    const targetSchoolId = isSuperAdmin ? (schoolId || "") : callerSchoolId;
    if (!targetSchoolId) {
      throw new Error("School ID context is required.");
    }

    // 1. Check if user already exists
    try {
      await auth.getUserByEmail(email);
      // If the above line does not throw, the user exists.
      throw new Error(`User with email ${email} already exists. Please try a different email address.`);
    } catch (error: any) {
      if (error.code !== 'auth/user-not-found') {
        throw error;
      }
    }
    
    // 2. Auth Creation with standardized displayName
    console.log("Creating new Auth User...");
    const displayName = `${details?.firstName || ''} ${details?.lastName || ''}`.trim();
    
    const userRecord = await auth.createUser({
        email,
        password,
        displayName: displayName || email,
    });
    
    // 3. Firestore Profile Creation
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
        isActive: true,
        requirePasswordChange: true 
    };

    if (targetSchoolId) profileData.schoolId = targetSchoolId;

    await firestore.collection(collectionName).doc(userRecord.uid).set(profileData, { merge: true });
    
    // 4. User Mapping
    await firestore.collection('users').doc(userRecord.uid).set({
        role: role || 'Parent',
        schoolId: targetSchoolId,
        email,
        requirePasswordChange: true 
    }, { merge: true });
    
    // 5. Send Credentials Email
    if (details?.firstName && targetSchoolId) {
        const schoolDoc = await firestore.collection('schools').doc(targetSchoolId).get();
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