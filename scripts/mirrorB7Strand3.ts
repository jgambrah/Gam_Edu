import { createRequire } from 'module';
const req = typeof require !== 'undefined' ? require : createRequire(import.meta.url);

async function mirrorB7() {
  const { OAuth2Client } = req('google-auth-library');
  const { Firestore } = req('@google-cloud/firestore');
  const auth = req('C:\\Users\\DELL\\AppData\\Local\\npm-cache\\_npx\\7750544ccf494d8b\\node_modules\\firebase-tools\\lib\\auth');

  const account = auth.getGlobalDefaultAccount();
  const tokenObj = await auth.getAccessToken(account.tokens.refresh_token, []);
  const oauthClient = new OAuth2Client();
  oauthClient.setCredentials({ access_token: tokenObj.access_token, refresh_token: account.tokens.refresh_token });
  const db = new Firestore({ projectId: 'gamedu-69888475-f5783', authClient: oauthClient });

  const sourceTopic = 'grammar_lexis_prepositions_and_phrasal_verbs';
  const targetTopic = 'parts_of_speech_phrasal_verbs_prepositions';
  const labs = ['B7_foundation', 'B7_intermediate', 'B7_advanced'];
  const parents = [
    'global_curriculum/jhs/subjects/english/topical',
    'global_curriculum/jhs/subjects/english/topics',
    'global_curriculum/jhs/subjects/english/topical_units'
  ];

  for (const lab of labs) {
    const srcDocRef = db.doc(`global_curriculum/jhs/subjects/english/topical/${sourceTopic}/practice_labs/${lab}`);
    const snap = await srcDocRef.get();
    if (snap.exists) {
      const data = snap.data();
      console.log(`Source ${lab} has ${data?.questions?.length} questions.`);
      for (const parent of parents) {
        const destDocRef = db.doc(`${parent}/${targetTopic}/practice_labs/${lab}`);
        await destDocRef.set(data, { merge: true });
        console.log(`✅ Mirrored ${lab} to ${destDocRef.path}`);
      }
    }
  }

  // Also mirror main doc levels
  const mainSrcRef = db.doc(`global_curriculum/jhs/subjects/english/topical/${sourceTopic}`);
  const mainSnap = await mainSrcRef.get();
  if (mainSnap.exists) {
    const mainData = mainSnap.data() || {};
    for (const parent of parents) {
      const destMainRef = db.doc(`${parent}/${targetTopic}`);
      const cur = await destMainRef.get();
      const curData = cur.exists ? cur.data() || {} : {};
      await destMainRef.set({
        ...mainData,
        ...curData,
        levels: {
          ...(mainData.levels || {}),
          ...(curData.levels || {})
        },
        updatedAt: new Date().toISOString()
      }, { merge: true });
      console.log(`✅ Mirrored main doc levels to ${destMainRef.path}`);
    }
  }

  console.log("\n🎉 Mirroring complete!");
}

mirrorB7().then(() => process.exit(0)).catch(e => { console.error(e); process.exit(1); });
