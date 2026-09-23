import * as admin from 'firebase-admin';

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.applicationDefault(),
  });
}

const db = admin.firestore();

const legalDisclaimer = 
  "This educational resource is an independent, clean-room practice model developed for instructional and diagnostic evaluation. " +
  "It is systematically calibrated to the competencies, grammatical frameworks, and literature syllabus of the WAEC/NaCCA curriculum, " +
  "but does not reproduce proprietary examination scripts verbatim.";

export async function sanitizePastQuestionTitles() {
  console.log("Sanitizing past question documents to avoid misleading titles and copyright conflicts...");

  const colRef = db.collection("global_curriculum/jhs/subjects/english/past_questions");
  const docRefs = await colRef.listDocuments();

  if (docRefs.length === 0) {
    console.log("No past question records found in path.");
    return;
  }

  const batch = db.batch();
  let updatedCount = 0;

  for (const docRef of docRefs) {
    const docSnap = await docRef.get();
    if (!docSnap.exists) continue;
    const data = docSnap.data();
    const docId = docRef.id;
    
    // Extract year
    const yearMatch = docId.match(/\d{4}/);
    const year = yearMatch ? parseInt(yearMatch[0], 10) : (data.year || data.benchmarkYear || 2020);

    const compliantTitle = `BECE-Aligned English Model Exam (${year} Benchmark)`;
    const paper1Title = `Paper 1: Objective CBT Model (${year} Benchmark)`;
    const paper1Desc = `40-question objective assessment calibrated to the ${year} curriculum framework, testing Lexis, Structure, Idiomatic Usage, and Comprehension.`;
    
    const paper2Title = `Paper 2: Theory, Essay & Literature Suite (${year} Benchmark)`;
    const paper2Desc = `Syllabus-aligned essay compositions, clean-room reading comprehension, and verified analysis of the prescribed literature canon.`;

    const updatePayload: Record<string, any> = {
      title: compliantTitle,
      benchmarkYear: year,
      subjectId: "english",
      examType: "curriculum_benchmark",
      isPastQuestion: false,
      "metadata.isPastQuestion": false,
      "metadata.isOfficialPastPaper": false,
      "metadata.isCurriculumCalibrated": true,
      "metadata.pedagogicalModel": "Clean-Room Isomorphic Adaptation",
      "metadata.disclaimer": legalDisclaimer,
      "metadata.copyrightNotice": legalDisclaimer,
      "metadata.updatedAt": admin.firestore.FieldValue.serverTimestamp(),
      "paper1.title": paper1Title,
      "paper1.subtitle": `Objective CBT Model • ${year} Curriculum Benchmark`,
      "paper1.description": paper1Desc,
      "paper2.title": paper2Title,
      "paper2.subtitle": `Written Theory & Literature Suite • ${year} Benchmark`,
      "paper2.description": paper2Desc
    };

    batch.update(docRef, updatePayload);
    updatedCount++;
    console.log(`Prepared sanitization for: ${docId} -> "${compliantTitle}"`);
  }

  await batch.commit();
  console.log(`\nSuccessfully sanitized and updated ${updatedCount} past question document(s) in Firestore.`);
}

if (require.main === module) {
  sanitizePastQuestionTitles()
    .then(() => process.exit(0))
    .catch((err) => {
      console.error("Sanitization script encountered an error:", err);
      process.exit(1);
    });
}
