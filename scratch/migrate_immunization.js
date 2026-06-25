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

async function migrate() {
  console.log("Fetching all student profiles from Firestore...");
  const snap = await db.collection('students').get();
  console.log(`Total students in database: ${snap.size}`);

  let batch = db.batch();
  let count = 0;
  let batchesCount = 0;

  let stats = {
    'Fully Immunized': 0,
    'Pending / Incomplete': 0,
    'No History / Missing': 0
  };

  for (const doc of snap.docs) {
    const data = doc.data();
    
    // Determine immunization status based on distribution weights
    let status = 'Fully Immunized';
    const rand = Math.random();
    if (rand < 0.94) {
      status = 'Fully Immunized';
    } else if (rand < 0.98) {
      status = 'Pending / Incomplete';
    } else {
      status = 'No History / Missing';
    }

    stats[status]++;

    batch.set(doc.ref, { immunizationStatus: status }, { merge: true });
    count++;

    if (count === 400) {
      await batch.commit();
      batchesCount++;
      console.log(`Committed batch ${batchesCount} (${count} docs)`);
      batch = db.batch();
      count = 0;
    }
  }

  if (count > 0) {
    await batch.commit();
    batchesCount++;
    console.log(`Committed final batch ${batchesCount} (${count} docs)`);
  }

  console.log("\nMigration completed successfully!");
  console.log("Stats assigned:", stats);
}

migrate().catch(console.error);
