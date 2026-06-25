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
  const schoolSnap = await db.collection('schools').limit(1).get();
  if (schoolSnap.size > 0) {
    const school = schoolSnap.docs[0];
    console.log("School ID:", school.id, "Name:", school.data().name);
    
    // Get some students from this school
    const studentSnap = await db.collection('students')
      .where('schoolId', '==', school.id)
      .limit(5)
      .get();
    console.log(`Found ${studentSnap.size} students:`);
    studentSnap.docs.forEach(doc => {
      const d = doc.data();
      console.log(`ID: ${doc.id}, Name: ${d.firstName} ${d.lastName}, Gender: ${d.gender}, classId: ${d.classId}`);
    });
  } else {
    console.log("No schools found.");
  }
}

run();
