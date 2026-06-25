const admin = require('firebase-admin');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config({ path: path.join(__dirname, '../.env') });

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert({
      projectId: process.env.FIREBASE_PROJECT_ID,
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
      privateKey: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n'),
    })
  });
}

const db = admin.firestore();

async function run() {
  const staffSnap = await db.collection('staff').where('email', '==', 'jamesgambrah@gmail.com').get();
  staffSnap.docs.forEach(doc => {
    const d = doc.data();
    console.log("Staff doc ID:", doc.id, "email:", d.email, "role:", d.role, "schoolId:", d.schoolId);
  });
}

run();
