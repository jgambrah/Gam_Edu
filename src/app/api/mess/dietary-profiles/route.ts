import { NextRequest, NextResponse } from 'next/server';
import { getApps, initializeApp, cert } from 'firebase-admin/app';
import { getAuth } from 'firebase-admin/auth';
import { getFirestore } from 'firebase-admin/firestore';

const formatPrivateKey = (key: string) => {
  return key.replace(/\\n/g, '\n').replace(/"/g, ''); 
};

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
      privateKey: formatPrivateKey(privateKeyRaw),
    }),
  }, 'admin');
}

export async function GET(request: NextRequest) {
  try {
    const authHeader = request.headers.get('Authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'Unauthorized: Missing or invalid token' }, { status: 401 });
    }
    const token = authHeader.split('Bearer ')[1];

    const adminApp = getAdminApp();
    const auth = getAuth(adminApp);
    const db = getFirestore(adminApp);

    // Verify token
    const decoded = await auth.verifyIdToken(token);
    const userId = decoded.uid;

    const { searchParams } = new URL(request.url);
    const schoolId = searchParams.get('schoolId');

    if (!schoolId) {
      return NextResponse.json({ error: 'Missing schoolId parameter' }, { status: 400 });
    }

    // Verify school access
    const isSuperAdmin = userId === "L4oE5XWweKRYrhtIXn6hB8IDHBC2" || userId === "gZxe3nMbGcQhNgEzkwEZwDBnkFR2";
    if (!isSuperAdmin) {
      const staffDoc = await db.collection('staff').doc(userId).get();
      const staffData = staffDoc.data();
      if (staffData && staffData.schoolId !== schoolId) {
        return NextResponse.json({ error: 'Forbidden: School access mismatch' }, { status: 403 });
      } else if (!staffData) {
        const userDoc = await db.collection('users').doc(userId).get();
        const userData = userDoc.data();
        if (!userData || userData.schoolId !== schoolId) {
          return NextResponse.json({ error: 'Forbidden: School access mismatch' }, { status: 403 });
        }
      }
    }

    // 1. Fetch active students in the school
    const studentsSnap = await db.collection('students')
      .where('schoolId', '==', schoolId)
      .where('enrollmentStatus', '==', 'Active')
      .get();

    const allergiesSummary: Record<string, number> = {};
    const dietsSummary: Record<string, number> = {};
    const profiles: any[] = [];

    // 2. Loop and aggregate dietary preferences and allergies
    studentsSnap.docs.forEach(doc => {
      const student = doc.data();
      const studentId = student.studentId || 'Pending ID';
      const fullName = `${student.firstName || ''} ${student.lastName || ''}`.trim() || 'Unknown Student';

      // Resolve allergies from profile or medical info
      let allergiesString = student.allergies || '';
      if (!allergiesString && student.medical && typeof student.medical === 'object') {
        allergiesString = student.medical.allergies || '';
      }

      // Resolve dietary restrictions
      let dietString = student.diet || student.dietaryRestrictions || '';
      if (!dietString && student.medical && typeof student.medical === 'object') {
        dietString = student.medical.dietaryRestrictions || '';
      }

      const allergyList = allergiesString
        ? allergiesString.split(',').map((s: string) => s.trim()).filter(Boolean)
        : [];
      const dietList = dietString
        ? dietString.split(',').map((s: string) => s.trim()).filter(Boolean)
        : [];

      // Increment summaries
      allergyList.forEach((allergy: string) => {
        const key = allergy.toLowerCase();
        allergiesSummary[key] = (allergiesSummary[key] || 0) + 1;
      });

      dietList.forEach((diet: string) => {
        const key = diet.toLowerCase();
        dietsSummary[key] = (dietsSummary[key] || 0) + 1;
      });

      if (allergyList.length > 0 || dietList.length > 0) {
        profiles.push({
          id: doc.id,
          studentId,
          fullName,
          classId: student.classId || 'Unassigned',
          allergies: allergyList,
          dietaryRestrictions: dietList,
        });
      }
    });

    return NextResponse.json({
      success: true,
      schoolId,
      headcounts: {
        totalStudentsWithNeeds: profiles.length,
        allergies: allergiesSummary,
        dietaryRestrictions: dietsSummary,
      },
      profiles,
    }, { status: 200 });

  } catch (error: any) {
    console.error('GET /api/mess/dietary-profiles error:', error);
    return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
  }
}
