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
  const sunnyId = "FAjBaejpOcGssqJOnJC6"; // Sunny Side Academy
  const doyinId = "4Md6HrL4GAJcQsIaN6qN"; // Doayin Academy

  const sunnySnap = await db.collection('financialRecords')
    .where('schoolId', '==', sunnyId)
    .get();

  const doyinSnap = await db.collection('financialRecords')
    .where('schoolId', '==', doyinId)
    .get();

  console.log(`Sunny Side total financial records: ${sunnySnap.size}`);
  console.log(`Doayin total financial records: ${doyinSnap.size}`);
}

run().catch(console.error);
