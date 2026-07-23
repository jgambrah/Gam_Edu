const admin = require('firebase-admin');
const dotenv = require('dotenv');

dotenv.config({ path: "../.env" });

const projectId = process.env.FIREBASE_PROJECT_ID;
const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
const privateKey = process.env.FIREBASE_PRIVATE_KEY ? process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n') : undefined;

if (!projectId || !clientEmail || !privateKey) {
  console.error("Missing firebase configuration in .env");
  process.exit(1);
}

admin.initializeApp({
  credential: admin.credential.cert({
    projectId,
    clientEmail,
    privateKey,
  }),
});

const db = admin.firestore();

async function run() {
  const studentId = "o60ugROHtSbXkG0KIq14YaFI2Hg2";
  const studentDoc = await db.doc(`students/${studentId}`).get();

  if (studentDoc.exists) {
    const data = studentDoc.data();
    console.log(`Student Name: ${data.firstName || ''} ${data.lastName || ''}`.trim());
    console.log(`Student ID / Reg No: ${data.studentId || data.indexNumber || 'N/A'}`);
    console.log(`Class: ${data.className || data.classId || 'N/A'}`);
  } else {
    console.log("Student doc not found with ID:", studentId);
  }
}

run().catch(console.error);
