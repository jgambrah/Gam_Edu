const admin = require('firebase-admin');
const fs = require('fs');
const path = require('path');
const dotenv = require('dotenv');

// Load environment variables from GAM Edu/.env
const envPath = path.resolve(__dirname, '../.env');
console.log('Loading env from:', envPath);
const envConfig = dotenv.parse(fs.readFileSync(envPath));

const serviceAccount = {
  projectId: envConfig.FIREBASE_PROJECT_ID,
  clientEmail: envConfig.FIREBASE_CLIENT_EMAIL,
  privateKey: envConfig.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n'),
};

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

const db = admin.firestore();

async function run() {
  const action = process.argv[2] || 'list';
  const targetId = process.argv[3];
  const newDomain = process.argv[4];
  const newSlug = process.argv[5];

  try {
    if (action === 'list') {
      console.log('--- Registered Schools & Domains ---');
      const snapshot = await db.collection('schools').get();
      if (snapshot.empty) {
        console.log('No schools found in the collection.');
        return;
      }
      snapshot.forEach(doc => {
        const data = doc.data();
        console.log(`ID: ${doc.id}`);
        console.log(`  Name: ${data.name || 'Unnamed'}`);
        console.log(`  Slug: ${data.slug || 'Not Set'}`);
        console.log(`  Custom Domain: ${data.customDomain || 'None'}`);
        console.log('------------------------------------');
      });
    } else if (action === 'update' && targetId) {
      if (!newDomain || !newSlug) {
        console.error('Usage: node manage-domains.js update [schoolId] [domain] [slug]');
        return;
      }
      console.log(`Updating school ${targetId}...`);
      const ref = db.collection('schools').doc(targetId);
      const doc = await ref.get();
      if (!doc.exists) {
        console.error(`School with ID ${targetId} not found.`);
        return;
      }
      await ref.update({
        customDomain: newDomain,
        slug: newSlug
      });
      console.log(`Successfully updated school ${targetId}!`);
      console.log(`  New Custom Domain: ${newDomain}`);
      console.log(`  New Slug: ${newSlug}`);
    }
  } catch (error) {
    console.error('Error running script:', error);
  }
}

run();
