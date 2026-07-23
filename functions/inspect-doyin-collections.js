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
  const doyinId = "4Md6HrL4GAJcQsIaN6qN"; // Doayin Academy 
  console.log(`Querying today's (2026-07-22) collections for Doayin Academy (${doyinId})...\n`);

  // Target date range for July 22, 2026 UTC and local
  const startJuly22 = new Date(Date.UTC(2026, 6, 22, 0, 0, 0));
  const endJuly22 = new Date(Date.UTC(2026, 6, 22, 23, 59, 59, 999));

  // Query payments collectionGroup
  const paymentsSnap = await db.collectionGroup('payments')
    .where('schoolId', '==', doyinId)
    .get();

  let todayTotal = 0;
  let todayPaymentsList = [];

  paymentsSnap.docs.forEach(doc => {
    const p = doc.data();
    const amount = Number(p.amount) || 0;
    if (amount <= 0) return;

    const dateVal = p.paidAt || p.createdAt || p.date;
    if (!dateVal) return;

    let d = null;
    if (dateVal.toDate && typeof dateVal.toDate === 'function') {
      d = dateVal.toDate();
    } else {
      d = new Date(dateVal);
    }

    if (isNaN(d.getTime())) return;

    // Check if timestamp falls within July 22nd 2026
    const isJuly22 = doc.id.includes('2026-07-22') || (d >= startJuly22 && d <= endJuly22);
    if (isJuly22) {
      todayTotal += amount;
      todayPaymentsList.push({
        id: doc.id,
        amount,
        paymentMethod: p.paymentMethod || p.method || 'Cash',
        studentName: p.studentName || p.studentId || 'N/A',
        receiptNumber: p.receiptNumber || 'N/A',
        paidAt: d.toISOString()
      });
    }
  });

  console.log(`=== DOYIN ACADEMY COLLECTIONS SUMMARY FOR TODAY (2026-07-22) ===`);
  console.log(`- Total Payments Received Today: ${todayPaymentsList.length}`);
  console.log(`- Total Cash / Funds Collected Today: GH₵ ${todayTotal.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`);
  
  if (todayPaymentsList.length > 0) {
    console.log(`\nDetailed Breakdown of Today's Transactions:`);
    todayPaymentsList.forEach((item, index) => {
      console.log(`${index + 1}. Student: ${item.studentName} | Amount: GH₵ ${item.amount} | Method: ${item.paymentMethod} | Receipt: ${item.receiptNumber} | Time: ${item.paidAt}`);
    });
  } else {
    console.log(`\nNo payment transactions found in Firestore for today (July 22, 2026).`);
  }
}

run().catch(console.error);
