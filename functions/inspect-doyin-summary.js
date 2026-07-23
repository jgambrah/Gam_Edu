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
  const schoolId = "4Md6HrL4GAJcQsIaN6qN"; // Doayin Academy 
  console.log(`Fetching dashboard summary doc for Doayin Academy (${schoolId})...`);

  const summaryDoc = await db.doc(`schoolSettings/${schoolId}/summaries/dashboard`).get();
  if (summaryDoc.exists) {
    console.log("Summary doc data:", JSON.stringify(summaryDoc.data(), null, 2));
  } else {
    console.log("No summary doc found at schoolSettings/4Md6HrL4GAJcQsIaN6qN/summaries/dashboard");
  }

  // Count actual attendance records for today (2026-07-21)
  const attSnap = await db.collection('attendance')
    .where('schoolId', '==', schoolId)
    .get();

  let todayPresent = 0;
  let todayAbsent = 0;
  let todayTotal = 0;

  const targetStart = new Date(2026, 6, 21, 0, 0, 0);
  const targetEnd = new Date(2026, 6, 21, 23, 59, 59);

  attSnap.docs.forEach(doc => {
    const data = doc.data();
    let dateObj = null;
    if (data.date && typeof data.date.toDate === 'function') {
      dateObj = data.date.toDate();
    } else if (data.date) {
      dateObj = new Date(data.date);
    }
    
    const dateStr = dateObj ? dateObj.toISOString().split('T')[0] : (typeof data.date === 'string' ? data.date : '');
    const isJuly21 = doc.id.includes('2026-07-21') || dateStr === '2026-07-21' || (dateObj && dateObj >= targetStart && dateObj <= targetEnd);

    if (isJuly21) {
      todayTotal++;
      if (data.status === 'Present' || data.status === 'Late') {
        todayPresent++;
      } else {
        todayAbsent++;
      }
    }
  });

  console.log(`\nActual attendance count in Firestore for 2026-07-21:`);
  console.log(`- Total marked today: ${todayTotal}`);
  console.log(`- Present / Late today: ${todayPresent}`);
  console.log(`- Absent / Excused today: ${todayAbsent}`);
}

run().catch(console.error);
