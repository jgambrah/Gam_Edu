const admin = require('firebase-admin');
const dotenv = require('dotenv');

dotenv.config({ path: "../.env" });

const projectId = process.env.FIREBASE_PROJECT_ID;
const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
const privateKey = process.env.FIREBASE_PRIVATE_KEY ? process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n') : undefined;

if (!projectId || !clientEmail || !privateKey) {
  console.error("Missing firebase configuration in .env");
  process.exit(1);
}

admin.initializeApp({
  credential: admin.credential.cert({
    projectId,
    clientEmail,
    privateKey,
  }),
});

const db = admin.firestore();

async function run() {
  const sunnyId = "FAjBaejpOcGssqJOnJC6"; // Sunny Side Academy

  console.log("Querying non-paid records for Sunny Side...");
  const unpaidSnap = await db.collection('financialRecords')
    .where('schoolId', '==', sunnyId)
    .where('status', 'in', ['Unpaid', 'Partial', 'Overdue'])
    .get();

  console.log(`Found ${unpaidSnap.size} unpaid/partial/overdue records (out of 16,201 total).`);

  let totalDebt = 0;
  let tuitionDebt = 0;
  let canteenDebt = 0;
  let transportDebt = 0;

  unpaidSnap.docs.forEach(doc => {
    const r = doc.data();
    const balance = (Number(r.billedAmount) || 0) - (Number(r.amountPaid) || 0) - (Number(r.waiverAmount) || 0);
    if (balance > 0) {
      totalDebt += balance;
      const type = (r.type || 'Other').toLowerCase();
      if (type.includes('tuition')) tuitionDebt += balance;
      else if (type.includes('canteen')) canteenDebt += balance;
      else if (type.includes('transport')) transportDebt += balance;
    }
  });

  console.log(`Calculated Total Outstanding from unpaid query: GH₵ ${totalDebt}`);
  console.log(`Tuition Debt: GH₵ ${tuitionDebt}`);
  console.log(`Canteen Debt: GH₵ ${canteenDebt}`);
  console.log(`Transport Debt: GH₵ ${transportDebt}`);
}

run().catch(console.error);
