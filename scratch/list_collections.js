const admin = require('firebase-admin');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config({ path: path.join(__dirname, '../.env') });

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

async function run() {
  const collections = ['admissionApplications', 'students'];
  for (const name of collections) {
    try {
      const snap = await db.collection(name).get();
      console.log(`Collection '${name}': count = ${snap.size}`);
      if (snap.size > 0) {
        console.log(`Sample doc from ${name}:`, snap.docs[0].id, JSON.stringify(snap.docs[0].data(), null, 2));
      }
    } catch (e) {
      console.error(`Error on ${name}:`, e.message);
    }
  }
}

run();
