const admin = require('firebase-admin');
const dotenv = require('dotenv');
const path = require('path');

// Load environment variables
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

async function inspectNegative() {
  try {
    const snap = await db.collection('financialRecords')
      .where('schoolId', '==', 'oHr3BrGdK2eS5MQ5zmZU')
      .get();

    const records = [];
    snap.forEach(doc => {
      records.push({ id: doc.id, ...doc.data() });
    });

    console.log(`Loaded ${records.length} records.`);

    const negatives = [];
    records.forEach(r => {
      const billed = Number(r.billedAmount) || 0;
      const paid = Number(r.amountPaid) || 0;
      const waiver = Number(r.waiverAmount) || 0;
      const balance = billed - paid - waiver;
      if (balance < 0) {
        negatives.push({ r, balance });
      }
    });

    console.log(`Found ${negatives.length} negative balance records.`);
    console.log("\nSample negative records (first 10):");
    negatives.slice(0, 10).forEach(item => {
      console.log(`- ID: ${item.r.id}`);
      console.log(`  Student: ${item.r.studentName} (${item.r.studentId})`);
      console.log(`  Type: ${item.r.type || 'N/A'}`);
      console.log(`  Billed: GHC ${item.r.billedAmount}`);
      console.log(`  Paid: GHC ${item.r.amountPaid}`);
      console.log(`  Waiver: GHC ${item.r.waiverAmount}`);
      console.log(`  Balance: GHC ${item.balance}`);
      console.log(`  Status: ${item.r.status}`);
      console.log(`  Date: ${item.r.date || item.r.createdAt}`);
    });

  } catch (err) {
    console.error(err);
  }
}

inspectNegative();
