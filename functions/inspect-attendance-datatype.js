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
  
  // startOfDay for July 21st 2026 UTC
  const todayStart = new Date(Date.UTC(2026, 6, 21, 0, 0, 0));

  console.log("Testing equality date query on date = 2026-07-21T00:00:00.000Z...");
  const qEq = await db.collection('attendance')
    .where('schoolId', '==', schoolId)
    .where('date', '==', todayStart)
    .get();

  console.log(`Equality query returned ${qEq.size} docs.`);
  
  let presentCount = 0;
  qEq.docs.forEach(doc => {
    const st = doc.data().status;
    if (st === 'Present' || st === 'Late') presentCount++;
  });
  console.log(`Present/Late count from equality query: ${presentCount}`);
}

run().catch(console.error);
