'use server';

import crypto from 'crypto';
import { getFirestore } from 'firebase-admin/firestore';
import { initializeApp, getApps, cert } from 'firebase-admin/app';
import { format, startOfDay } from 'date-fns';
import { notifyParents } from './notifications';
import { sendSchoolWhatsApp } from './whatsapp';
import { billMultipleStudentsServer } from '@/lib/billing-server';

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
 * Generates a new secure API key for the school's biometric integration.
 * Stores it in the school's settings.
 */
export async function generateBiometricApiKey(schoolId: string) {
  if (!schoolId) {
    return { success: false, error: 'Missing school ID' };
  }

  try {
    const db = getFirestore(getAdminApp());
    const apiKey = `sec_bio_${crypto.randomBytes(24).toString('hex')}`;

    await db.collection('schoolSettings').doc(schoolId).set({
      biometricApiKey: apiKey,
      enableBiometricIntegration: true,
      updatedAt: new Date(),
    }, { merge: true });

    return { success: true, apiKey };
  } catch (error: any) {
    console.error('Error generating biometric API key:', error);
    return { success: false, error: error.message };
  }
}

/**
 * Revokes the school's biometric integration API key.
 */
export async function revokeBiometricApiKey(schoolId: string) {
  if (!schoolId) {
    return { success: false, error: 'Missing school ID' };
  }

  try {
    const db = getFirestore(getAdminApp());

    await db.collection('schoolSettings').doc(schoolId).set({
      biometricApiKey: null,
      enableBiometricIntegration: false,
      updatedAt: new Date(),
    }, { merge: true });

    return { success: true };
  } catch (error: any) {
    console.error('Error revoking biometric API key:', error);
    return { success: false, error: error.message };
  }
}

/**
 * Maps a biometric/RFID Card ID to a specific student.
 */
export async function updateStudentBiometricId(schoolId: string, studentId: string, biometricId: string) {
  if (!schoolId || !studentId) {
    return { success: false, error: 'Missing student or school parameter' };
  }

  try {
    const db = getFirestore(getAdminApp());

    // Clean up biometric ID whitespace
    const cleanBiometricId = biometricId.trim();

    // Check if this biometric ID is already used by another active student in the same school
    if (cleanBiometricId) {
      const existingQuery = await db.collection('students')
        .where('schoolId', '==', schoolId)
        .where('biometricId', '==', cleanBiometricId)
        .where('enrollmentStatus', '==', 'Active')
        .get();

      if (!existingQuery.empty) {
        const otherStudent = existingQuery.docs[0].data();
        if (existingQuery.docs[0].id !== studentId) {
          return {
            success: false,
            error: `This Card/Biometric ID is already assigned to student ${otherStudent.firstName} ${otherStudent.lastName}.`
          };
        }
      }
    }

    await db.collection('students').doc(studentId).update({
      biometricId: cleanBiometricId || null,
      updatedAt: new Date(),
    });

    return { success: true };
  } catch (error: any) {
    console.error('Error updating student biometric ID:', error);
    return { success: false, error: error.message };
  }
}

/**
 * Helper to process an array of biometric scans on the server.
 * This is shared by both the CSV import server action and the REST API.
 */
export async function processBiometricScans(
  db: FirebaseFirestore.Firestore,
  schoolId: string,
  targetDate: Date,
  logs: { biometricId: string; timestamp: number }[]
) {
  const dateStr = format(targetDate, 'yyyy-MM-dd');
  const normalizedDateStart = startOfDay(targetDate);

  // Fetch school settings to calculate Late vs Present
  const settingsDoc = await db.collection('schoolSettings').doc(schoolId).get();
  const settings = settingsDoc.data();
  const schoolStartTimeStr = settings?.schoolStartTime || "08:00"; // default 8 AM

  const [startHour, startMinute] = schoolStartTimeStr.split(':').map(Number);
  const schoolStartTimeToday = new Date(targetDate);
  schoolStartTimeToday.setHours(startHour, startMinute, 0, 0);

  const studentsToBill: any[] = [];
  const processedRecords: string[] = [];
  const studentsToNotify: string[] = [];
  const whatsappTasks: Promise<any>[] = [];

  const batch = db.batch();

  // Deduplicate incoming logs by biometricId to prevent multiple records for the same student on the same day
  const uniqueLogs = new Map<string, number>();
  logs.forEach(log => {
    const cleanId = log.biometricId.trim();
    if (!cleanId) return;
    // Keep the earliest timestamp for arrival
    if (!uniqueLogs.has(cleanId) || log.timestamp < uniqueLogs.get(cleanId)!) {
      uniqueLogs.set(cleanId, log.timestamp);
    }
  });

  // Process each scan
  for (const [biometricId, scanTimestamp] of uniqueLogs.entries()) {
    // 1. Find the student
    const studentSnap = await db.collection('students')
      .where('schoolId', '==', schoolId)
      .where('biometricId', '==', biometricId)
      .where('enrollmentStatus', '==', 'Active')
      .limit(1)
      .get();

    if (studentSnap.empty) continue;

    const studentDoc = studentSnap.docs[0];
    const studentData = studentDoc.data();
    studentData.uid = studentDoc.id; // ensure uid is set for billing helpers

    const studentName = `${studentData.firstName || ''} ${studentData.lastName || ''}`.trim();
    const classId = studentData.classId;

    if (!classId) continue;

    // 2. Determine attendance status (Present or Late)
    const scanTime = new Date(scanTimestamp);
    let status: 'Present' | 'Late' = 'Present';

    // 5 minutes grace period
    if (scanTime.getTime() > schoolStartTimeToday.getTime() + (5 * 60 * 1000)) {
      status = 'Late';
    }

    // 3. Formulate attendance document with deterministic ID
    const deterministicId = `att-${schoolId}-${classId}-${studentData.uid}-${dateStr}`;
    const attendanceRef = db.collection('attendance').doc(deterministicId);

    batch.set(attendanceRef, {
      studentId: studentData.uid,
      studentName: studentName,
      classId: classId,
      status: status,
      notes: `Biometric scan recorded at ${format(scanTime, 'pp')}`,
      date: normalizedDateStart,
      schoolId: schoolId,
      updatedAt: new Date(),
      updatedBy: 'biometric-system'
    }, { merge: true });

    studentsToBill.push(studentData);
    processedRecords.push(`${studentName} (${status})`);
    studentsToNotify.push(studentData.uid);

    // Queue WhatsApp alerts for late arrivals (if WhatsApp is enabled for school)
    if (status === 'Late' && settings?.enableWhatsApp) {
      const parentQuery = await db.collection('parents')
        .where('schoolId', '==', schoolId)
        .where('studentIds', 'array-contains', studentData.uid)
        .limit(1)
        .get();

      if (!parentQuery.empty) {
        const parent = parentQuery.docs[0].data();
        if (parent.phone) {
          const timeStr = format(scanTime, 'h:mm a');
          const message = `⚠️ *GAM Edu Alert*\n\nDear Parent, please be informed that your ward, *${studentName}*, arrived *LATE* to school via biometric check-in today at ${timeStr}.`;
          whatsappTasks.push(sendSchoolWhatsApp(schoolId, parent.phone, message));
        }
      }
    }
  }

  // Commit attendance records
  if (processedRecords.length > 0) {
    await batch.commit();

    // Trigger billing in a separate operation
    const billingResult = await billMultipleStudentsServer(db, studentsToBill, targetDate, schoolId);

    // Trigger parent push notifications (non-blocking)
    notifyParents(
      studentsToNotify,
      "Daily Attendance Recorded 📅",
      "Your child's attendance has been logged via biometric scan. Tap to view logs.",
      "/dashboard/my-attendance"
    ).catch(err => console.error("FCM notifications failed for biometric checkin:", err));

    // Wait for queued WhatsApp messages to send
    if (whatsappTasks.length > 0) {
      await Promise.allSettled(whatsappTasks);
    }

    return {
      success: true,
      processedCount: processedRecords.length,
      details: processedRecords,
      billing: billingResult
    };
  }

  return { success: true, processedCount: 0, details: [], billing: { successful: 0, failed: 0, totalBilled: 0, errors: [] } };
}

/**
 * Server action to process uploaded CSV logs.
 */
export async function importBiometricCsvAction(
  schoolId: string,
  targetDateVal: string, // ISO string or yyyy-MM-dd
  records: { biometricId: string; timestamp: number }[]
) {
  if (!schoolId || !targetDateVal || !records || records.length === 0) {
    return { success: false, error: 'Missing required validation data.' };
  }

  try {
    const db = getFirestore(getAdminApp());
    const targetDate = new Date(targetDateVal);

    const result = await processBiometricScans(db, schoolId, targetDate, records);
    return result;

  } catch (error: any) {
    console.error('Error importing biometric CSV:', error);
    return { success: false, error: error.message };
  }
}
