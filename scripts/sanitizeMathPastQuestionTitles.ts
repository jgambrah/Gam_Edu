import * as admin from 'firebase-admin';

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.applicationDefault(),
  });
}

const db = admin.firestore();

const legalDisclaimer = 
  "This mathematical educational resource is an independent, clean-room practice model developed for instructional and diagnostic evaluation. " +
  "It is systematically calibrated to the competencies, mathematical theorems, and structured problem-solving blueprint of the WAEC/NaCCA JHS curriculum, " +
  "but does not reproduce proprietary examination papers verbatim.";

export async function sanitizeMathTitles() {
  console.log("Sanitizing Mathematics past question documents...");

  const colRef = db.collection("global_curriculum/jhs/subjects/mathematics/past_questions");
  const snapshot = await colRef.get();

  if (snapshot.empty) {
    console.log("No mathematics past question records found.");
    return;
  }

  const batch = db.batch();
  let count = 0;

  snapshot.forEach((doc) => {
    const data = doc.data();
    const docId = doc.id;
    const yearMatch = docId.match(/\d{4}/);
    const year = yearMatch ? parseInt(yearMatch[0], 10) : (data.year || data.benchmarkYear || 2012);

    const compliantTitle = `BECE-Aligned Mathematics Model Exam (${year} Benchmark)`;

    const updatePayload: Record<string, any> = {
      title: compliantTitle,
      benchmarkYear: year,
      subjectId: "mathematics",
      examType: "curriculum_benchmark",
      "metadata.isOfficialPastPaper": false,
      "metadata.isCurriculumCalibrated": true,
      "metadata.pedagogicalModel": "Clean-Room Isomorphic Adaptation",
      "metadata.copyrightNotice": legalDisclaimer,
      "metadata.updatedAt": admin.firestore.FieldValue.serverTimestamp(),
      "paper1.title": `Paper 1: Objective CBT Model (${year} Benchmark)`,
      "paper1.subtitle": `Objective Assessment • ${year} Curriculum Benchmark`,
      "paper1.badge": `Curriculum-Aligned Model`,
      "paper2.title": `Paper 2: Structured Theory Suite (${year} Benchmark)`,
      "paper2.subtitle": `Structured Problem-Solving • ${year} Benchmark`,
      "paper2.badge": `Structured Theory Model`
    };

    batch.update(doc.ref, updatePayload);
    count++;
    console.log(`Updated Math record: ${docId} -> "${compliantTitle}"`);
  });

  await batch.commit();
  console.log(`\nSuccessfully sanitized and aligned ${count} Mathematics documents.`);
}

if (require.main === module) {
  sanitizeMathTitles()
    .then(() => process.exit(0))
    .catch((err) => {
      console.error("Error sanitizing Mathematics titles:", err);
      process.exit(1);
    });
}
