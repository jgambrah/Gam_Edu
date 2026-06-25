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
const schoolId = 'FAjBaejpOcGssqJOnJC6';

async function run() {
  const snap = await db.collection('students').where('schoolId', '==', schoolId).limit(200).get();
  console.log("Found students:", snap.size);
  
  let fieldsCount = {};
  snap.docs.forEach(doc => {
    const data = doc.data();
    Object.keys(data).forEach(key => {
      fieldsCount[key] = (fieldsCount[key] || 0) + 1;
    });
    // Check if any fields relate to vaccine, immunization, medical, health
    for (const key of Object.keys(data)) {
      const lower = key.toLowerCase();
      if (lower.includes('vacc') || lower.includes('immun') || lower.includes('med') || lower.includes('health') || lower.includes('status')) {
        console.log(`Sample Student ID ${doc.id} has field: "${key}" =`, data[key]);
      }
    }
  });

  console.log("\nAll fields and their document counts:", fieldsCount);
}

run();
