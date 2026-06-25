const admin = require('firebase-admin');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config({ path: path.join(__dirname, '../.env') });

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert({
      projectId: process.env.FIREBASE_PROJECT_ID,
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
      privateKey: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n'),
    })
  });
}

const db = admin.firestore();

async function run() {
  console.log("Starting database cleanup of pre-seeded health dashboard mock data...");

  // 1. Delete all 14 mock infirmary logs
  const logsSnap = await db.collection('infirmary_logs').get();
  console.log(`Found ${logsSnap.size} documents in 'infirmary_logs'.`);
  
  let deletedLogs = 0;
  for (const doc of logsSnap.docs) {
    const data = doc.data();
    // Verify it is indeed a mock log before deleting
    const isMockStaff = ['Nurse Evelyn Darko', 'Officer Samuel Mensah', 'Dr. Albert Asare'].includes(data.treatingStaffName);
    if (isMockStaff) {
      await db.collection('infirmary_logs').doc(doc.id).delete();
      deletedLogs++;
      console.log(`Deleted mock infirmary log: ${doc.id}`);
    } else {
      console.log(`Skipped non-mock infirmary log: ${doc.id}`);
    }
  }
  console.log(`Successfully deleted ${deletedLogs} mock infirmary logs.`);

  // 2. Clear mock medical fields on the 8 students
  const studentIdsToClear = [
    '00xJgLNTDoNwnS1KJBYIQTnurY53',
    '03uGEFBKIMUx9maSaob92RJpcRo1',
    '06RyHU5JZrfLSVflG56bizDg91h2',
    '06yUct0ktVYJpCNA194hcZDI6hr1',
    '08GxPatWNfe53GydT58kkmsD2d62',
    '0AObcmbl19Tzrp2VWc8mfmqjqAY2',
    '0VhK6bOOd3XozAu546JzYsUGysx2',
    '0mMR3psEsmZCrB63894ha35ISvA2'
  ];

  console.log(`Clearing medical fields for ${studentIdsToClear.length} students...`);
  const FieldValue = admin.firestore.FieldValue;

  for (const studentId of studentIdsToClear) {
    const studentRef = db.collection('students').doc(studentId);
    const doc = await studentRef.get();
    if (doc.exists) {
      await studentRef.update({
        chronicIllnesses: FieldValue.delete(),
        allergies: FieldValue.delete(),
        healthNotes: FieldValue.delete(),
        bloodGroup: FieldValue.delete()
      });
      console.log(`Reset medical fields on student ID: ${studentId}`);
    } else {
      console.log(`Student ID: ${studentId} not found in DB!`);
    }
  }

  console.log("\nCleanup successfully completed!");
}

run().catch(console.error);
