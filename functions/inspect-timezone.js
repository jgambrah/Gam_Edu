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
  const now = new Date();

  // UTC Midnight
  const utcToday = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate(), 0, 0, 0));
  
  // Local Midnight
  const localToday = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 0, 0, 0);

  console.log("utcToday ISO:", utcToday.toISOString(), "Timestamp seconds:", Math.floor(utcToday.getTime() / 1000));
  console.log("localToday ISO:", localToday.toISOString(), "Timestamp seconds:", Math.floor(localToday.getTime() / 1000));

  const qUTC = await db.collection('attendance')
    .where('schoolId', '==', schoolId)
    .where('date', '==', utcToday)
    .get();

  const qLocal = await db.collection('attendance')
    .where('schoolId', '==', schoolId)
    .where('date', '==', localToday)
    .get();

  console.log(`qUTC (Date.UTC) returned: ${qUTC.size} docs`);
  console.log(`qLocal (new Date) returned: ${qLocal.size} docs`);
}

run().catch(console.error);
