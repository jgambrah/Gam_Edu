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
  const schoolId = "4Md6HrL4GAJcQsIaN6qN"; // Doayin Academy 
  const schoolDoc = await db.doc(`schools/${schoolId}`).get();

  if (schoolDoc.exists) {
    const data = schoolDoc.data();
    console.log("School Name:", data.name || data.schoolName);
    console.log("termStartDate:", data.termStartDate);
    console.log("termEndDate:", data.termEndDate);
  } else {
    console.log("School document not found!");
  }
}

run().catch(console.error);
