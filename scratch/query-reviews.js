const admin = require('firebase-admin');
const dotenv = require('dotenv');
const path = require('path');

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

async function inspect() {
  try {
    console.log("Connecting to Firestore...");
    
    // 1. Inspect Staff
    const staffSnap = await db.collection('staff').get();
    console.log(`Total staff: ${staffSnap.size}`);
    
    const staffMap = {};
    staffSnap.forEach(doc => {
      const data = doc.data();
      const uid = data.uid || doc.id;
      const name = `${data.firstName || data.name || ''} ${data.lastName || ''}`.trim();
      staffMap[uid] = name;
      console.log(`Staff: ID=${uid}, Name="${name}", Email="${data.email}", Role="${data.role}"`);
    });

    // 2. Query performanceReviews
    const reviewsSnap = await db.collection('performanceReviews').get();
    console.log(`\nTotal performance reviews: ${reviewsSnap.size}`);
    reviewsSnap.forEach(doc => {
      const data = doc.data();
      const staffName = staffMap[data.staffId] || 'Unknown Staff';
      console.log(`Review ID=${doc.id}, Staff="${staffName}" (ID=${data.staffId}), Rating=${data.rating}, Date=${data.reviewDate}`);
    });
    
  } catch (error) {
    console.error("Error:", error);
  }
}

inspect();
