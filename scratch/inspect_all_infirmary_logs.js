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
  const snap = await db.collection('infirmary_logs').get();
  console.log("Total logs:", snap.size);
  snap.docs.forEach(doc => {
    const data = doc.data();
    console.log(`Doc: ${doc.id}, Student: ${data.studentId}, School: ${data.schoolId}, Symptoms: ${data.reportedSymptoms}, Staff: ${data.treatingStaffName}`);
  });
}

run();
