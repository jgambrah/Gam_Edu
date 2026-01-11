'use server';

import { getAuth } from 'firebase-admin/auth';
import { getFirestore } from 'firebase-admin/firestore';
import { initializeApp, getApps, App, ServiceAccount, cert } from 'firebase-admin/app';
import { sendSchoolCredentialsEmail } from '@/lib/email'; // Ensure this path is correct

// Initialize Admin SDK Safely
function getAdminApp(): App {
  const existingApp = getApps().find(app => app.name === 'admin');
  if (existingApp) return existingApp;

  const serviceAccountString = process.env.FIREBASE_SERVICE_ACCOUNT_KEY;
  if (!serviceAccountString) {
    throw new Error("The FIREBASE_SERVICE_ACCOUNT_KEY environment variable is not set.");
  }
  
  try {
    const serviceAccount: ServiceAccount = JSON.parse(serviceAccountString);

    return initializeApp({
      credential: cert(serviceAccount),
    }, 'admin');

  } catch (error: any) {
    console.error("Failed to parse Firebase service account key:", error.message);
    throw new Error("Firebase service account key is not a valid JSON object.");
  }
}

export async function createNewUser(
  email: string,
  password: string,
  role?: string,
  details?: { firstName: string, lastName: string },
  schoolId?: string 
) {
  
  // 1. Initialize Admin App
  const adminApp = getAdminApp();
  const auth = getAuth(adminApp);
  const firestore = getFirestore(adminApp);

  try {
    let userRecord;
    
    // 2. Check if user exists
    try {
        userRecord = await auth.getUserByEmail(email);
    } catch (error: any) {
        if (error.code === 'auth/user-not-found') {
            // Create new user
            userRecord = await auth.createUser({
                email: email,
                password: password,
                displayName: `${details?.firstName} ${details?.lastName}`.trim(),
            });
        } else {
            throw error;
        }
    }
    
    const selectedRole = role || 'Parent';
    const collectionName = selectedRole === 'Parent' ? 'parents' : selectedRole === 'Student' ? 'students' : 'staff';
    
    // 3. Create Profile Document
    const profileData: any = {
        uid: userRecord.uid,
        email: email,
        firstName: details?.firstName,
        lastName: details?.lastName,
        createdAt: new Date(), // Admin SDK uses native Date, not serverTimestamp()
        isActive: true
    };

    if (schoolId) profileData.schoolId = schoolId;
    if (collectionName === 'staff') profileData.role = selectedRole;
    
    await firestore.collection(collectionName).doc(userRecord.uid).set(profileData, { merge: true });

    // 4. Update 'users' mapping collection
    const userRoleData: any = { role: selectedRole, email };
    if (schoolId) userRoleData.schoolId = schoolId;
    
    await firestore.collection('users').doc(userRecord.uid).set(userRoleData, { merge: true });

    return { uid: userRecord.uid, success: true };

  } catch (error: any) {
    console.error('Create User Error:', error);
    return { error: error.message || 'Failed to create user' };
  }
}
