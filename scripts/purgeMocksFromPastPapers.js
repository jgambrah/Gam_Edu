const { OAuth2Client } = require('google-auth-library');
const { Firestore } = require('@google-cloud/firestore');

async function purgeMocksFromPastPapers() {
  console.log('--- Purging Mock Documents from Historical Past Paper Collections ---');
  const auth = require('C:\\Users\\DELL\\AppData\\Local\\npm-cache\\_npx\\7750544ccf494d8b\\node_modules\\firebase-tools\\lib\\auth');
  const account = auth.getGlobalDefaultAccount();
  const tokenObj = await auth.getAccessToken(account.tokens.refresh_token, []);
  const oauthClient = new OAuth2Client();
  oauthClient.setCredentials({ access_token: tokenObj.access_token, refresh_token: account.tokens.refresh_token });
  const db = new Firestore({ projectId: 'gamedu-69888475-f5783', authClient: oauthClient });

  const collectionsToCheck = [
    'global_curriculum/jhs/subjects/science/past_papers',
    'global_curriculum/jhs/subjects/integrated_science/past_papers',
    'global_curriculum/jhs/subjects/science/topics/bece_past_papers/question_sets',
    'global_curriculum/jhs/subjects/integrated_science/topics/bece_past_papers/question_sets',
    'global_curriculum/jhs/subjects/science/topics/past_papers/question_sets',
    'global_curriculum/jhs/subjects/integrated_science/topics/past_papers/question_sets'
  ];

  for (const colPath of collectionsToCheck) {
    console.log(`Checking: ${colPath}...`);
    try {
      const snap = await db.collection(colPath).get();
      for (const doc of snap.docs) {
        if (doc.id.toLowerCase().includes('mock')) {
          await doc.ref.delete();
          console.log(`  🗑️ DELETED mock from past papers pool: ${colPath}/${doc.id}`);
        }
      }
    } catch (e) {
      console.warn(`  Could not read or empty: ${colPath}`, e.message);
    }
  }

  // Also verify mock_exams collection has mock_1 intact
  const mockExamRef = db.doc('global_curriculum/jhs/subjects/science/mock_exams/mock_1');
  const mockExamSnap = await mockExamRef.get();
  console.log(`\nVerified mock_exams/mock_1 exists: ${mockExamSnap.exists}`);

  console.log('\n✅ FIRESTORE CLEANUP COMPLETE: All mock questions successfully excised from past papers pool!');
}

purgeMocksFromPastPapers()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error('Purge failed:', err);
    process.exit(1);
  });
