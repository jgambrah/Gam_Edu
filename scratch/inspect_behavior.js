const admin = require('firebase-admin');
const serviceAccount = require('./serviceAccountKey.json');

if (admin.apps.length === 0) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
  });
}

const db = admin.firestore();

async function inspect() {
  const snapshot = await db.collection('behavioral_records').limit(10).get();
  console.log('Total records in collection behavioral_records:', snapshot.size);
  snapshot.forEach(doc => {
    console.log('Doc ID:', doc.id, JSON.stringify(doc.data(), null, 2));
  });
}

inspect().catch(console.error);
