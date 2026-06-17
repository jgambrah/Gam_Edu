import { getFirestore } from 'firebase-admin/firestore';
import { initializeApp, getApps, cert } from 'firebase-admin/app';
import * as dotenv from 'dotenv';
import * as path from 'path';

// Load environment variables
dotenv.config({ path: path.join(__dirname, '../.env') });

function getAdminApp() {
  const existingApp = getApps().find(app => app.name === 'admin');
  if (existingApp) return existingApp;

  const projectId = process.env.FIREBASE_PROJECT_ID;
  const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
  const privateKey = process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n').replace(/"/g, '');

  if (!projectId || !clientEmail || !privateKey) {
    throw new Error("Missing Firebase credentials in .env");
  }

  return initializeApp({
    credential: cert({ projectId, clientEmail, privateKey })
  }, 'admin');
}

async function run() {
  const app = getAdminApp();
  const db = getFirestore(app);

  console.log("Checking Firestore databases...");

  // 1. Get schools
  const schoolsSnap = await db.collection('schools').get();
  console.log(`\nFound ${schoolsSnap.size} schools:`);
  schoolsSnap.forEach(doc => {
    console.log(`- School ID: ${doc.id}, Name: ${doc.data().name}`);
  });

  if (schoolsSnap.empty) {
    console.log("No schools in database.");
    return;
  }

  // 2. Get global payroll settings
  const settingsSnap = await db.collection('payrollSettings').doc('global').get();
  console.log(`\nGlobal Payroll Settings (payrollSettings/global):`);
  if (settingsSnap.exists) {
    console.log(JSON.stringify(settingsSnap.data(), null, 2));
  } else {
    console.log("Not found.");
  }

  // 3. Get staff list
  const staffSnap = await db.collection('staff').get();
  console.log(`\nFound ${staffSnap.size} staff members in total:`);
  
  for (const doc of staffSnap.docs) {
    const s = doc.data();
    const payrollSnap = await db.collection(`staff/${doc.id}/payroll`).get();
    console.log(`- Staff ID: ${doc.id}, Name: ${s.firstName} ${s.lastName}, School ID: ${s.schoolId}, Role: ${s.role}`);
    console.log(`  Payroll configs count: ${payrollSnap.size}`);
    payrollSnap.forEach(pDoc => {
      console.log(`    Config [${pDoc.id}]:`, JSON.stringify(pDoc.data(), null, 2));
    });
  }

  // 4. Get payroll records
  const recordsSnap = await db.collection('payrollRecords').get();
  console.log(`\nFound ${recordsSnap.size} payrollRecords in total:`);
  recordsSnap.forEach(doc => {
    const r = doc.data();
    console.log(`- Record ID: ${doc.id}, Period: ${r.period}, Staff: ${r.staffName}, School ID: ${r.schoolId}`);
  });
}

run().catch(console.error);
