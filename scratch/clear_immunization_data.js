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
  console.log("Fetching all student profiles from Firestore to clear immunizationStatus...");
  const snap = await db.collection('students').get();
  console.log(`Total students in database: ${snap.size}`);

  let batch = db.batch();
  let count = 0;
  let batchesCount = 0;
  let clearedCount = 0;

  const FieldValue = admin.firestore.FieldValue;

  for (const doc of snap.docs) {
    const data = doc.data();
    
    // Check if immunizationStatus is present
    if (data.immunizationStatus !== undefined) {
      batch.update(doc.ref, { immunizationStatus: FieldValue.delete() });
      count++;
      clearedCount++;

      if (count === 400) {
        await batch.commit();
        batchesCount++;
        console.log(`Committed batch ${batchesCount} (${count} docs cleared)`);
        batch = db.batch();
        count = 0;
      }
    }
  }

  if (count > 0) {
    await batch.commit();
    batchesCount++;
    console.log(`Committed final batch ${batchesCount} (${count} docs cleared)`);
  }

  console.log(`\nSuccessfully cleared 'immunizationStatus' field from ${clearedCount} student profiles!`);
}

run().catch(console.error);
