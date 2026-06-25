const admin = require('firebase-admin');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config({ path: path.join(__dirname, '..', '.env') });

const projectId = process.env.FIREBASE_PROJECT_ID;
const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
let privateKey = process.env.FIREBASE_PRIVATE_KEY;

if (privateKey) {
  privateKey = privateKey.replace(/\\n/g, '\n');
}

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert({
      projectId,
      clientEmail,
      privateKey,
    })
  });
}

const db = admin.firestore();

async function inspect() {
  try {
    console.log("Connecting to Firestore...");
    const snap = await db.collection('students').limit(5).get();
    snap.forEach(doc => {
      console.log(`Student ID=${doc.id}`);
      console.log(JSON.stringify(doc.data(), null, 2));
      console.log("-----------------------------------------");
    });
  } catch (error) {
    console.error("Error:", error);
  }
}

inspect();
