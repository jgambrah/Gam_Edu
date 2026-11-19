/**
 * Rebuilds `academicSummary/{schoolId}__{termId}`, `classAverages/{schoolId}__{termId}__{classId}`,
 * and `classSeriesProfiles/{schoolId}__{termId}__{classId}` (plus re-freezes any hybrid legacy
 * `term_report_cards` from live `report-cards`) across all existing marks.
 *
 * Run ONCE after deploying functions:
 *   cd functions && npm run build
 *   node rebuild-academic-summary.js                  # every school
 *   node rebuild-academic-summary.js --school <id>    # one school
 */
const admin = require('firebase-admin');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config({ path: path.resolve(__dirname, '../.env') });
dotenv.config({ path: path.resolve(__dirname, '../.env.local') });

const projectId = process.env.FIREBASE_PROJECT_ID || process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID;
const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
const privateKey = process.env.FIREBASE_PRIVATE_KEY
  ? process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n').replace(/"/g, '')
  : undefined;

if (projectId && clientEmail && privateKey) {
  admin.initializeApp({ credential: admin.credential.cert({ projectId, clientEmail, privateKey }) });
} else {
  admin.initializeApp({ projectId: projectId || 'gamedu-69888475-f5783' });
}

const { markPart, contribution, classContribution, computeCaProfilesForClassSubject } = require('./lib/academic-summary');
const { termStampOfRecord } = require('./lib/term-utils');
const db = admin.firestore();
const args = process.argv.slice(2);
const schoolArg = args.includes('--school') ? args[args.indexOf('--school') + 1] : null;

const safeKey = (v) => String(v || '').replace(/[.\/\[\]#$*`~]/g, '_').slice(0, 120);

function addInto(acc, obj) {
  Object.entries(obj).forEach(([k, v]) => {
    if (v && typeof v === 'object' && !Array.isArray(v)) {
      acc[k] = acc[k] || {};
      addInto(acc[k], v);
    } else if (typeof v === 'number') {
      acc[k] = (acc[k] || 0) + v;
    } else {
      acc[k] = v;
    }
  });
}

async function deleteDocsInChunks(docRefs) {
  for (let i = 0; i < docRefs.length; i += 400) {
    const b = db.batch();
    docRefs.slice(i, i + 400).forEach(r => b.delete(r));
    await b.commit();
  }
}

(async () => {
  const settingsSnap = await db.collection('schoolSettings').get();
  const schoolsSnap = await db.collection('schools').get();
  const allSchoolIds = Array.from(new Set([
    ...settingsSnap.docs.map(d => d.id),
    ...schoolsSnap.docs.map(d => d.id),
  ]));
  const ids = schoolArg ? [schoolArg] : allSchoolIds;

  for (const schoolId of ids) {
    const [snap, existingSummaries, existingClassAvgs, existingProfiles, archivedCardsSnap] = await Promise.all([
      db.collection('assessments').where('schoolId', '==', schoolId).get(),
      db.collection('academicSummary').where('schoolId', '==', schoolId).get(),
      db.collection('classAverages').where('schoolId', '==', schoolId).get(),
      db.collection('classSeriesProfiles').where('schoolId', '==', schoolId).get(),
      db.collection('report-cards').where('schoolId', '==', schoolId).where('isArchived', '==', true).get(),
    ]);

    // 1. Wipe old polluted summary / classAverages / classSeriesProfiles docs for this school first
    await deleteDocsInChunks([
      ...existingSummaries.docs.map(d => d.ref),
      ...existingClassAvgs.docs.map(d => d.ref),
      ...existingProfiles.docs.map(d => d.ref),
    ]);

    const byTerm = {};
    const byClassTerm = {};
    const rawByClassTermSub = {};

    snap.forEach(d => {
      const data = d.data();
      const st = termStampOfRecord(data);
      const termId = st?.termId || 'unknown';
      const safeClassId = safeKey(data.classId);
      const safeSubId = safeKey(data.subjectId || data.subjectName || 'general');

      if (termId !== 'unknown' && safeClassId && safeSubId) {
        const ctsKey = `${termId}__${safeClassId}`;
        rawByClassTermSub[ctsKey] = rawByClassTermSub[ctsKey] || { termId, classId: safeClassId, hasLegacyUnstamped: false, subjects: {} };
        if (!data.termId) {
          rawByClassTermSub[ctsKey].hasLegacyUnstamped = true;
        }
        rawByClassTermSub[ctsKey].subjects[safeSubId] = rawByClassTermSub[ctsKey].subjects[safeSubId] || {
          subjectName: String(data.subjectName || ''),
          docs: [],
        };
        rawByClassTermSub[ctsKey].subjects[safeSubId].docs.push(data);
      }

      const m = markPart(data);
      if (!m) return;
      byTerm[m.termId] = byTerm[m.termId] || {};
      addInto(byTerm[m.termId], contribution(m, 1, n => n));

      if (m.classId && m.subjectId) {
        const ctKey = `${m.termId}__${m.classId}`;
        byClassTerm[ctKey] = byClassTerm[ctKey] || {};
        addInto(byClassTerm[ctKey], classContribution(m, 1, n => n));
      }
    });

    // 2. Write fresh academicSummary docs
    for (const [termId, data] of Object.entries(byTerm)) {
      await db.collection('academicSummary').doc(`${schoolId}__${termId}`).set({
        ...data,
        schoolId,
        termId,
        rebuiltAt: admin.firestore.FieldValue.serverTimestamp(),
      });
    }

    // 3. Write fresh classAverages & classSeriesProfiles docs (with exact per-subject CA profiles)
    const allClassTermKeys = new Set([...Object.keys(byClassTerm), ...Object.keys(rawByClassTermSub)]);
    for (const ctKey of allClassTermKeys) {
      const avgBase = byClassTerm[ctKey] || {};
      const profEntry = rawByClassTermSub[ctKey];
      const [termId, classId] = ctKey.split('__');
      const profilesMap = {};

      if (profEntry) {
        Object.entries(profEntry.subjects).forEach(([subId, info]) => {
          const profs = computeCaProfilesForClassSubject(info.docs);
          profilesMap[`end_of_term__${subId}`] = profs.end_of_term;
          profilesMap[`mid_term__${subId}`] = profs.mid_term;
          if (info.subjectName) {
            const safeSubName = safeKey(info.subjectName.toLowerCase().trim());
            profilesMap[`end_of_term__name__${safeSubName}`] = profs.end_of_term;
            profilesMap[`mid_term__name__${safeSubName}`] = profs.mid_term;
          }
        });
      }

      if (Object.keys(avgBase).length > 0 || Object.keys(profilesMap).length > 0) {
        await db.collection('classAverages').doc(`${schoolId}__${ctKey}`).set({
          ...avgBase,
          schoolId,
          termId,
          classId,
          caProfiles: profilesMap,
          lastMarkWriteAt: admin.firestore.FieldValue.serverTimestamp(),
          markVersion: 1,
          rebuiltAt: admin.firestore.FieldValue.serverTimestamp(),
        });
      }
      if (Object.keys(profilesMap).length > 0) {
        await db.collection('classSeriesProfiles').doc(`${schoolId}__${ctKey}`).set({
          schoolId,
          termId,
          classId,
          profiles: profilesMap,
          ...(profEntry?.hasLegacyUnstamped ? { hasLegacyUnstamped: true } : {}),
          hasDirtyProfiles: false,
          rebuiltAt: admin.firestore.FieldValue.serverTimestamp(),
        });
      }
    }

    // 4. Re-freeze any archived report-cards cleanly by series (repairs any pre-C1 hybrid frozen transcripts)
    let refrozen = 0;
    if (!archivedCardsSnap.empty) {
      const cardOps = [];
      archivedCardsSnap.forEach(d => {
        const r = d.data();
        const tId = r.closedInTermId || r.termId || termStampOfRecord(r)?.termId;
        if (!r.studentId || !tId) return;
        const suffixMatch = String(d.id || '').match(/__(mid_term|mock_[a-z0-9_]+)$/i);
        const seriesKey = (typeof r.reportSeries === 'string' && r.reportSeries.trim())
          ? r.reportSeries.trim()
          : (suffixMatch ? suffixMatch[1].toLowerCase() : 'end_of_term');
        const frozenId = seriesKey === 'end_of_term'
          ? `term_report_card_${schoolId}_${r.studentId}_${tId}`
          : `term_report_card_${schoolId}_${r.studentId}_${tId}__${seriesKey}`;
        cardOps.push({
          ref: db.collection('term_report_cards').doc(frozenId),
          data: {
            ...r,
            id: frozenId,
            reportSeries: seriesKey,
            sourceReportCardId: d.id,
            schoolId,
            termId: tId,
            isLocked: true,
            isArchived: true,
            rebuiltAt: admin.firestore.FieldValue.serverTimestamp(),
          },
        });
      });
      for (let i = 0; i < cardOps.length; i += 400) {
        const b = db.batch();
        cardOps.slice(i, i + 400).forEach(op => b.set(op.ref, op.data));
        await b.commit();
      }
      refrozen = cardOps.length;
    }

    console.log(`${schoolId}: ${snap.size} marks -> ${Object.keys(byTerm).length} term summaries, ${allClassTermKeys.size} class averages/profiles, ${refrozen} frozen cards synced.`);
  }
  process.exit(0);
})().catch(e => {
  console.error(e);
  process.exit(1);
});
