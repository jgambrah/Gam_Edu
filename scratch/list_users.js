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
  console.log("=== DIRECTORS IN STAFF ===");
  const dSnap = await db.collection('staff').where('role', '==', 'Director').limit(5).get();
  dSnap.forEach(doc => {
    console.log(doc.id, doc.data().email, doc.data().role);
  });

  console.log("=== ADMINISTRATORS IN STAFF ===");
  const aSnap = await db.collection('staff').where('role', '==', 'Administrator').limit(5).get();
  aSnap.forEach(doc => {
    console.log(doc.id, doc.data().email, doc.data().role);
  });

  console.log("=== USERS WITH DIRECTOR/ADMIN ROLE ===");
  const uSnap = await db.collection('users').where('role', 'in', ['Director', 'Administrator']).limit(5).get();
  uSnap.forEach(doc => {
     console.log(doc.id, doc.data().email, doc.data().role);
  });
}

run().catch(console.error);
