import * as admin from 'firebase-admin';
import * as fs from 'fs';
import * as path from 'path';
import { fileURLToPath } from 'url';
import { createRequire } from 'module';

const require = createRequire(import.meta.url);

async function getFirestoreDb(): Promise<admin.firestore.Firestore> {
  if (process.env.GOOGLE_APPLICATION_CREDENTIALS) {
    const adminInst = (admin as any)?.apps ? admin : ((admin as any)?.default || require('firebase-admin'));
    if (!adminInst?.apps?.length) {
      adminInst.initializeApp({
        credential: adminInst.credential.applicationDefault(),
        projectId: 'gamedu-69888475-f5783'
      });
    }
    return adminInst.firestore();
  }

  // Use Firebase CLI OAuth credentials when running locally
  const { OAuth2Client } = require('google-auth-library');
  const { Firestore } = require('@google-cloud/firestore');
  const auth = require('C:\\Users\\DELL\\AppData\\Local\\npm-cache\\_npx\\7750544ccf494d8b\\node_modules\\firebase-tools\\lib\\auth');
  const account = auth.getGlobalDefaultAccount();
  const tokenObj = await auth.getAccessToken(account.tokens.refresh_token, []);
  const oauthClient = new OAuth2Client();
  oauthClient.setCredentials({ access_token: tokenObj.access_token, refresh_token: account.tokens.refresh_token });
  return new Firestore({ projectId: 'gamedu-69888475-f5783', authClient: oauthClient }) as any;
}

async function runUpdate() {
  const jsonPath = 'C:\\Users\\DELL\\Documents\\GitHub\\Gam_Edu\\scripts\\beaconOfLightPayload.json';
  const rawData = fs.readFileSync(jsonPath, 'utf8');
  const payload = JSON.parse(rawData);

  console.log("Updating Strand 1: Oral Language Curriculum Card to 'The Beacon of Light'...");

  const db = await getFirestoreDb();

  // 1. Update the canonical topic document across topical, topics, and topical_units
  const topicCollections = ['topical', 'topics', 'topical_units'];
  const topicDocId = "beacon_of_light_anthology_literary_devices";

  for (const col of topicCollections) {
    const targetDoc = db.doc(`global_curriculum/jhs/subjects/english/${col}/${topicDocId}`);
    await targetDoc.set({
      ...payload,
      metadata: {
        ...(payload.metadata || {}),
        updatedAt: new Date().toISOString()
      }
    }, { merge: true });
    console.log("   ✅ Updated Topic Path: " + targetDoc.path);
  }

  // Also check if cockcrow documents exist and update/alias them if appropriate
  const cockcrowAliases = ['the_cockcrow_anthology_literary_devices', 'cockcrow_anthology_literary_devices'];
  for (const col of topicCollections) {
    for (const alias of cockcrowAliases) {
      const aliasDoc = db.doc(`global_curriculum/jhs/subjects/english/${col}/${alias}`);
      const snap = await aliasDoc.get();
      if (snap.exists) {
        await aliasDoc.set({
          status: 'retired',
          retiredText: 'The Cockcrow',
          supersededBy: topicDocId,
          prescribedText: 'The Beacon of Light',
          updatedAt: new Date().toISOString()
        }, { merge: true });
        console.log("   ℹ️ Marked retired alias: " + aliasDoc.path);
      }
    }
  }

  // 2. Update the parent subject manifest/overview card index
  const englishOverviewDoc = db.doc(
    "global_curriculum/jhs/subjects/english"
  );

  await englishOverviewDoc.set({
    topics: {
      strand_1_oral_language: {
        beacon_of_light: {
          id: "beacon_of_light_anthology_literary_devices",
          badge: "STRAND 1: ORAL LANGUAGE",
          title: "The Beacon of Light Anthology & Literary Devices",
          description: "Master The Beacon of Light Anthology & Literary Devices with tiered concept notes, worked examples, and graded practice pools.",
          levels: ["B7 (JHS 1)", "B8 (JHS 2)", "B9 (JHS 3)"],
          footer: "Basic 7 – Basic 9 • Concept Notes & Worked Examples",
          cta: "Launch Practice Lab",
          path: `global_curriculum/jhs/subjects/english/topical/${topicDocId}`,
          retiredText: "The Cockcrow",
          prescribedText: "The Beacon of Light",
          status: "active"
        }
      }
    }
  }, { merge: true });

  console.log("SUCCESS: Replaced 'The Cockcrow' with 'The Beacon of Light'.");
  console.log("   Parent Overview Path: " + englishOverviewDoc.path);
}

runUpdate()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error("Failed to update curriculum card to The Beacon of Light:", err);
    process.exit(1);
  });
