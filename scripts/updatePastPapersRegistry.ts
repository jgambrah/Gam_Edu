import * as admin from 'firebase-admin';
import * as fs from 'fs';

if (!admin.apps.length) {
  const serviceAccountPath = 'C:\\Users\\LENOVO\\Downloads\\gamedu-69888475-f5783-firebase-adminsdk-fbsvc-f2566f9210.json';
  if (fs.existsSync(serviceAccountPath)) {
    admin.initializeApp({
      credential: admin.credential.cert(serviceAccountPath),
    });
  } else {
    admin.initializeApp({
      credential: admin.credential.applicationDefault(),
    });
  }
}

const db = admin.firestore();

async function updateRegistry() {
  console.log('Updating past papers registry index...');
  const registryDocRef = db.doc('global_curriculum/jhs/subjects/math/past_papers/index');
  const existingSnap = await registryDocRef.get();
  const existingData = existingSnap.exists ? existingSnap.data() : {};

  const availableYears = existingData?.availableYears || [
    1990, 1991, 1992, 1993, 1994, 1995, 1996, 1997, 1998, 1999,
    2000, 2001, 2002, 2003, 2004, 2005, 2006, 2007, 2008, 2009,
    2010, 2011, 2012
  ];

  if (!availableYears.includes(2026)) {
    availableYears.push(2026);
    availableYears.sort((a: number, b: number) => a - b);
  }

  const paperRegistryEntry = {
    year: 2026,
    paperId: 'paper_2026',
    yearDocId: 'year_2026',
    title: '2026 WAEC BECE Mathematics Examination',
    paper1Count: 40,
    paper2Count: 6,
    active: true,
    addedAt: admin.firestore.FieldValue.serverTimestamp()
  };

  const papers = existingData?.papers || {};
  papers['2026'] = paperRegistryEntry;

  const payload = {
    subject: 'math',
    subjectName: 'Mathematics',
    level: 'jhs',
    availableYears,
    papers,
    updatedAt: admin.firestore.FieldValue.serverTimestamp()
  };

  await registryDocRef.set(payload, { merge: true });
  console.log('✅ Past papers registry index updated with year 2026.');

  // Also mirror to registry doc if queried by registry
  await db.doc('global_curriculum/jhs/subjects/math/past_papers/registry').set(payload, { merge: true });
  console.log('✅ Mirrored to past_papers/registry.');
}

updateRegistry()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error('Failed to update registry:', err);
    process.exit(1);
  });
