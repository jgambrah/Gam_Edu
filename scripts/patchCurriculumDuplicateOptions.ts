import * as dotenv from 'dotenv';
import * as admin from 'firebase-admin';
import * as fs from 'fs';
import * as path from 'path';

dotenv.config();

const projectId = process.env.FIREBASE_PROJECT_ID || process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || 'gamedu-69888475-f5783';
const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
const privateKey = process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n');
const serviceAccountPath = process.env.GOOGLE_APPLICATION_CREDENTIALS;
const fallbackKeyPath = 'C:\\Users\\LENOVO\\Downloads\\gamedu-69888475-f5783-firebase-adminsdk-fbsvc-f2566f9210.json';

if (!admin.apps.length) {
  if (clientEmail && privateKey) {
    admin.initializeApp({
      credential: admin.credential.cert({
        projectId,
        clientEmail,
        privateKey,
      }),
    });
  } else if (serviceAccountPath && fs.existsSync(serviceAccountPath)) {
    admin.initializeApp({
      credential: admin.credential.cert(serviceAccountPath),
    });
  } else if (fs.existsSync(fallbackKeyPath)) {
    admin.initializeApp({
      credential: admin.credential.cert(fallbackKeyPath),
    });
  } else {
    admin.initializeApp({ projectId });
  }
}

const db = admin.firestore();

const TOPIC_IDS = [
  'topic_numbers_and_numeration',
  'topic_sets_and_venn_diagrams',
  'topic_fractions_decimals_percentages',
  'topic_ratio_proportion_financial',
  'topic_algebraic_expressions',
  'topic_equations_inequalities_graphs',
  'topic_geometry_and_trigonometry',
  'topic_data_handling_probability',
  'topic_data_handling_and_probability'
];

function deduplicateOptions(options: string[], correctAnswer: string): string[] {
  const seen = new Set<string>();
  const result: string[] = [];

  for (let i = 0; i < options.length; i++) {
    const opt = options[i];
    if (!seen.has(opt)) {
      seen.add(opt);
      result.push(opt);
    } else {
      result.push('__DUPLICATE__');
    }
  }

  for (let i = 0; i < result.length; i++) {
    if (result[i] === '__DUPLICATE__') {
      const original = options[i];
      let replacement = '';

      if (original.includes('/')) {
        const parts = original.split('/');
        const num = parseInt(parts[0], 10);
        const den = parseInt(parts[1], 10);
        if (!isNaN(num) && !isNaN(den)) {
          let delta = 1;
          while (!replacement || seen.has(replacement)) {
            const candNum = num + delta;
            if (candNum > 0) {
              replacement = `${candNum}/${den}`;
            }
            delta = delta > 0 ? -delta : -delta + 1;
          }
        }
      }

      if (!replacement && (original.includes('>') || original.includes('<') || original.includes('≥') || original.includes('≤'))) {
        const match = original.match(/(.*?)([><≥≤])\s*(-?\d+)(.*)/);
        if (match) {
          const prefix = match[1];
          const op = match[2];
          const num = parseInt(match[3], 10);
          const suffix = match[4];
          let delta = 1;
          while (!replacement || seen.has(replacement)) {
            replacement = `${prefix}${op} ${num + delta}${suffix}`.trim();
            delta = delta > 0 ? -delta : -delta + 1;
          }
        }
      }

      if (!replacement && original.includes('GH¢')) {
        const match = original.match(/\d+(\.\d+)?/);
        if (match) {
          const val = parseFloat(match[0]);
          let delta = 20;
          while (!replacement || seen.has(replacement)) {
            replacement = original.replace(match[0], `${(val + delta).toFixed(2)}`);
            delta += 20;
          }
        }
      }

      if (!replacement && original.includes('%')) {
        const num = parseInt(original.replace('%', ''), 10);
        if (!isNaN(num)) {
          let delta = 4;
          while (!replacement || seen.has(replacement)) {
            replacement = `${num + delta}%`;
            delta += 2;
          }
        }
      }

      if (!replacement && !isNaN(Number(original)) && original.trim() !== '') {
        const num = Number(original);
        const isInt = Number.isInteger(num);
        let delta = 1;
        while (!replacement || seen.has(replacement)) {
          const cand = isInt ? num + delta : Number((num + delta * 0.5).toFixed(2));
          replacement = `${cand}`;
          delta = delta > 0 ? -delta : -delta + 1;
        }
      }

      if (!replacement && original.endsWith('°')) {
        const num = parseInt(original.replace('°', ''), 10);
        if (!isNaN(num)) {
          let delta = 5;
          while (!replacement || seen.has(replacement)) {
            replacement = `${num + delta}°`;
            delta = delta > 0 ? -delta : -delta + 5;
          }
        }
      }

      if (!replacement || seen.has(replacement)) {
        let suffix = 1;
        replacement = `${original}*`;
        while (seen.has(replacement)) {
          suffix++;
          replacement = `${original}*${suffix}`;
        }
      }

      seen.add(replacement);
      result[i] = replacement;
    }
  }

  if (!result.includes(correctAnswer)) {
    for (let i = 0; i < result.length; i++) {
      if (result[i] !== correctAnswer) {
        result[i] = correctAnswer;
        break;
      }
    }
  }

  return result;
}

function ensureFourDistinctOptions(options: string[], correctAnswer: string): string[] {
  const opts = [...options];
  while (opts.length < 4) {
    const sample = opts[opts.length - 1] || opts[0] || '10';
    let added = '';

    if (sample.includes('GH¢') || sample.includes('GHC')) {
      const match = sample.match(/\d+(\.\d+)?/);
      if (match) {
        const val = parseFloat(match[0]);
        let delta = 25;
        while (!added || opts.includes(added)) {
          added = sample.replace(match[0], `${(val + delta).toFixed(2)}`);
          delta += 25;
        }
      }
    } else if (sample.includes('%')) {
      const val = parseInt(sample.replace('%', ''), 10);
      let delta = 4;
      while (!added || opts.includes(added)) {
        added = `${val + delta}%`;
        delta += 4;
      }
    } else if (sample.includes(':')) {
      const parts = sample.split(':');
      const a = parseInt(parts[0], 10);
      const b = parseInt(parts[1], 10);
      let delta = 1;
      while (!added || opts.includes(added)) {
        added = `${a + delta} : ${b}`;
        delta++;
      }
    } else if (!isNaN(Number(sample)) && sample.trim() !== '') {
      const num = Number(sample);
      let delta = 5;
      while (!added || opts.includes(added)) {
        added = `${num + delta}`;
        delta += 5;
      }
    } else {
      let counter = 1;
      added = `${sample} (alt)`;
      while (opts.includes(added)) {
        counter++;
        added = `${sample} (alt ${counter})`;
      }
    }

    opts.push(added);
  }

  return deduplicateOptions(opts, correctAnswer);
}

async function patchAllTopics() {
  console.log('🔧 Starting Complete 4-Option & Deduplication Patch across all Topics...');
  let totalPatched = 0;

  for (const topicId of TOPIC_IDS) {
    const docRef = db.doc(`global_curriculum/jhs/subjects/math/topics/${topicId}`);
    const snap = await docRef.get();
    if (!snap.exists) continue;

    const data = snap.data() || {};
    const levels = data.levels || {};
    let topicModified = false;

    for (const lvl of ['b7', 'b8', 'b9', 'jhs1', 'jhs2', 'jhs3']) {
      const levelData = levels[lvl];
      if (!levelData || !levelData.practicePool) continue;

      for (const tier of ['low', 'medium', 'hard']) {
        const items = levelData.practicePool[tier] || [];
        for (const item of items) {
          if (!item.options) continue;
          if (item.options.length !== 4 || new Set(item.options).size !== 4 || !item.options.includes(item.correctAnswer)) {
            const fixedOptions = ensureFourDistinctOptions(item.options, item.correctAnswer);
            item.options = fixedOptions;
            topicModified = true;
            totalPatched++;
          }
        }
      }
    }

    if (topicModified) {
      await docRef.update({
        levels: levels,
        updatedAt: admin.firestore.FieldValue.serverTimestamp()
      });
      console.log(`✅ Patched and updated Firestore: ${topicId}`);

      const p1 = path.resolve(process.cwd(), 'scripts', 'payloads', `${topicId}.json`);
      const p2 = path.resolve(process.cwd(), 'scripts', 'payloads', 'topics', `${topicId}.json`);
      for (const p of [p1, p2]) {
        if (fs.existsSync(p)) {
          const raw = JSON.parse(fs.readFileSync(p, 'utf-8'));
          raw.levels = levels;
          fs.writeFileSync(p, JSON.stringify(raw, null, 2), 'utf-8');
          console.log(`  💾 Synced payload: ${p}`);
        }
      }
    } else {
      console.log(`✓ Clean: ${topicId}`);
    }
  }

  console.log(`\n🎉 Total items corrected to 4 distinct options: ${totalPatched}`);
}

patchAllTopics().then(() => process.exit(0)).catch((err) => {
  console.error(err);
  process.exit(1);
});
