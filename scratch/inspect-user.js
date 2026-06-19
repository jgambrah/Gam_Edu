const admin = require('firebase-admin');
require('dotenv').config();

const privateKey = process.env.FIREBASE_PRIVATE_KEY 
  ? process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n')
  : undefined;

if (!privateKey) {
  console.error("No private key found in environment");
  process.exit(1);
}

admin.initializeApp({
  credential: admin.credential.cert({
    projectId: process.env.FIREBASE_PROJECT_ID,
    clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
    privateKey: privateKey
  })
});

const db = admin.firestore();
const uid = 'JSku5ptqcHfpncKzEChtVBT4Yhz2';

async function run() {
  console.log(`Inspecting user document for UID: ${uid}`);
  
  const staffRef = db.collection('staff').doc(uid);
  const staffSnap = await staffRef.get();
  if (staffSnap.exists) {
    console.log("Found in 'staff' collection:", staffSnap.data());
  } else {
    console.log("NOT found in 'staff' collection");
  }

  const parentRef = db.collection('parents').doc(uid);
  const parentSnap = await parentRef.get();
  if (parentSnap.exists) {
    console.log("Found in 'parents' collection:", parentSnap.data());
  } else {
    console.log("NOT found in 'parents' collection");
  }

  const userRef = db.collection('users').doc(uid);
  const userSnap = await userRef.get();
  if (userSnap.exists) {
    console.log("Found in 'users' collection:", userSnap.data());
  } else {
    console.log("NOT found in 'users' collection");
  }

  process.exit(0);
}

run().catch(err => {
  console.error(err);
  process.exit(1);
});
