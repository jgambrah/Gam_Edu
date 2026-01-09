
'use server';

import { getAuth } from 'firebase-admin/auth';
import { getFirestore } from 'firebase-admin/firestore';
import { initializeApp, getApps, App, ServiceAccount, cert } from 'firebase-admin/app';
import type { UserRole } from '@/lib/types';
import { sendWelcomeEmail } from '@/lib/email'; 

// Initialize Admin SDK
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
  role?: UserRole,
  details?: { firstName: string, lastName: string },
  schoolId?: string // <--- NEW PARAMETER
): Promise<{ uid: string } | { error: string }> {
  
  const adminApp = getAdminApp();
  const auth = getAuth(adminApp);
  const firestore = getFirestore(adminApp);

  try {
    let userRecord;
    let isNewUser = false; 

    // 1. Create or Fetch Auth User
    try {
        userRecord = await auth.getUserByEmail(email);
    } catch (error: any) {
        if (error.code === 'auth/user-not-found') {
            userRecord = await auth.createUser({
                email: email,
                password: password,
                displayName: `${details?.firstName} ${details?.lastName}`.trim(),
            });
            isNewUser = true; 
        } else {
            throw error;
        }
    }
    
    const selectedRole = role || 'Parent';

    // 2. Determine Collection based on Role
    // Note: Staff/Teachers go to 'staff', Students to 'students', Parents to 'parents'
    const collectionName = selectedRole === 'Parent' ? 'parents' : selectedRole === 'Student' ? 'students' : 'staff';
    const profileDocRef = firestore.collection(collectionName).doc(userRecord.uid);
    
    // 3. Prepare Profile Data (Now including schoolId)
    const profileData: any = {
        uid: userRecord.uid,
        email: email,
        firstName: details?.firstName,
        lastName: details?.lastName,
        createdAt: new Date(),
    };

    if (schoolId) {
        profileData.schoolId = schoolId; // <--- LINK TO SCHOOL
    }

    if(collectionName === 'staff') {
        profileData.role = selectedRole;
    }
    
    await profileDocRef.set(profileData, { merge: true });

    // 4. Update the core 'users' collection (Critical for Auth/Rules)
    const userRoleRef = firestore.collection('users').doc(userRecord.uid);
    const userRoleData: any = { role: selectedRole };
    
    if (schoolId) {
        userRoleData.schoolId = schoolId; // <--- LINK TO SCHOOL
    }
    
    // Add display name if available
    if (details?.firstName) {
        userRoleData.firstName = details.firstName;
        userRoleData.lastName = details.lastName;
        userRoleData.email = email;
    }

    await userRoleRef.set(userRoleData, { merge: true });

    // 5. Send Welcome Email (Only for new users)
    if (isNewUser) {
        const fullName = `${details?.firstName} ${details?.lastName}`.trim();
        // You can customize the email here to mention the school if schoolId is present
        await sendWelcomeEmail(email, fullName || 'User');
    }

    return { uid: userRecord.uid };

  } catch (error: any) {
    console.error('Error creating/updating user:', error);
    
    let errorMessage = 'An unknown error occurred.';
    if (error.code === 'auth/email-already-exists') {
        errorMessage = 'This email is already registered.';
    }
    
    return { error: errorMessage };
  }
}
