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

async function inspect() {
  const name = 'infirmary_logs';
  try {
    const snap = await db.collection(name).get();
    console.log(`\n=================== Collection: ${name} (Total: ${snap.size}) ===================`);
    if (snap.size > 0) {
      snap.docs.slice(0, 3).forEach(doc => {
        console.log(`Document ID: ${doc.id}`);
        console.log(JSON.stringify(doc.data(), null, 2));
      });
    } else {
      console.log('No documents found in this collection.');
    }
  } catch (e) {
    console.error(`Error querying ${name}:`, e.message);
  }
}

inspect();
