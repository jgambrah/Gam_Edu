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
  console.log(`Fetching all attendance records for Doayin Academy (${schoolId})...`);

  const attSnap = await db.collection('attendance')
    .where('schoolId', '==', schoolId)
    .get();

  console.log(`Total attendance records found: ${attSnap.size}`);

  let recordsFor21st = [];
  attSnap.docs.forEach(doc => {
    const data = doc.data();
    let dateObj = null;
    if (data.date && typeof data.date.toDate === 'function') {
      dateObj = data.date.toDate();
    } else if (data.date) {
      dateObj = new Date(data.date);
    }
    
    const dateStr = dateObj ? dateObj.toISOString().split('T')[0] : (typeof data.date === 'string' ? data.date : '');
    const isJuly21 = doc.id.includes('2026-07-21') || dateStr === '2026-07-21' || (dateObj && dateObj.getFullYear() === 2026 && dateObj.getMonth() === 6 && dateObj.getDate() === 21);

    if (isJuly21) {
      recordsFor21st.push({ id: doc.id, ...data });
    }
  });

  console.log(`\nFound ${recordsFor21st.length} attendance records for July 21, 2026:`);
  recordsFor21st.forEach(r => {
    console.log(`- ID: ${r.id} | ClassID: ${r.classId} | StudentID: ${r.studentId} (${r.studentName}) | Status: ${r.status}`);
  });

  if (recordsFor21st.length > 0) {
    console.log(`\nDeleting ${recordsFor21st.length} attendance records for July 21, 2026...`);
    const batch = db.batch();
    recordsFor21st.forEach(r => {
      batch.delete(db.collection('attendance').doc(r.id));
    });
    await batch.commit();
    console.log("\n✅ SUCCESSFULLY DELETED ALL ATTENDANCE RECORDS FOR JULY 21, 2026 FOR DOAYIN ACADEMY!");
  } else {
    console.log("\nNo attendance records found for 2026-07-21.");
  }
}

run().catch(console.error);
