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
  const doyinId = "4Md6HrL4GAJcQsIaN6qN"; // Doayin Academy
  const sunnyId = "FAjBaejpOcGssqJOnJC6"; // Sunny Side Academy

  console.log("=== CHECKING DOYIN ACADEMY FOR TODAY (2026-07-22) ===");
  const doyinAtt = await db.collection('attendance')
    .where('schoolId', '==', doyinId)
    .get();

  let doyinJuly22 = [];
  let doyinJuly21 = [];
  doyinAtt.docs.forEach(doc => {
    if (doc.id.includes('2026-07-22')) {
      doyinJuly22.push({ id: doc.id, ...doc.data() });
    } else if (doc.id.includes('2026-07-21')) {
      doyinJuly21.push({ id: doc.id, ...doc.data() });
    }
  });

  console.log(`Doayin total records today (2026-07-22): ${doyinJuly22.length}`);
  console.log(`Doayin total records yesterday (2026-07-21): ${doyinJuly21.length}`);
  if (doyinJuly22.length > 0) {
    console.log("Sample July 22 Doayin docs:", doyinJuly22.slice(0, 5));
  }

  console.log("\n=== CHECKING SUNNY SIDE ACADEMY FOR TODAY (2026-07-22) ===");
  const sunnyAtt = await db.collection('attendance')
    .where('schoolId', '==', sunnyId)
    .get();

  let sunnyJuly22 = [];
  sunnyAtt.docs.forEach(doc => {
    if (doc.id.includes('2026-07-22')) {
      sunnyJuly22.push({ id: doc.id, ...doc.data() });
    }
  });

  console.log(`Sunny Side total records today (2026-07-22): ${sunnyJuly22.length}`);
  if (sunnyJuly22.length > 0) {
    console.log("Sample July 22 Sunny Side docs:", sunnyJuly22.slice(0, 5));
  }
}

run().catch(console.error);
