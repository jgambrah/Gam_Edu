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

  const doyinSum = await db.doc(`schoolSettings/${doyinId}/summaries/dashboard`).get();
  const sunnySum = await db.doc(`schoolSettings/${sunnyId}/summaries/dashboard`).get();

  console.log("Doayin summary doc exists:", doyinSum.exists);
  if (doyinSum.exists) console.log("Doayin data:", JSON.stringify(doyinSum.data(), null, 2));

  console.log("\nSunny Side summary doc exists:", sunnySum.exists);
  if (sunnySum.exists) console.log("Sunny Side data:", JSON.stringify(sunnySum.data(), null, 2));
}

run().catch(console.error);
