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
  const snap = await db.collection('students').get();
  console.log("Total students in DB:", snap.size);
  let count = 0;
  snap.docs.forEach(doc => {
    const data = doc.data();
    if (data.chronicIllnesses || data.allergies || data.healthNotes || data.bloodGroup) {
      count++;
      console.log(`Student ID: ${doc.id}`);
      console.log(`  Name: ${data.firstName} ${data.lastName}`);
      console.log(`  SchoolId: ${data.schoolId}`);
      console.log(`  chronicIllnesses: ${data.chronicIllnesses}`);
      console.log(`  allergies: ${data.allergies}`);
      console.log(`  healthNotes: ${data.healthNotes}`);
      console.log(`  bloodGroup: ${data.bloodGroup}`);
    }
  });
  console.log("Found students with health info:", count);
}

run();
