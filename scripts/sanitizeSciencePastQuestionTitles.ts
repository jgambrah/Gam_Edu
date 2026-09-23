import * as admin from 'firebase-admin';

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.applicationDefault(),
  });
}

const db = admin.firestore();

const legalDisclaimer = 
  "This scientific educational resource is an independent, clean-room practice model developed for instructional and diagnostic evaluation. " +
  "It is systematically calibrated to the competencies, scientific inquiry skills, and practical blueprints of the WAEC/NaCCA JHS Integrated Science curriculum, " +
  "but does not reproduce proprietary examination papers verbatim.";

export async function sanitizeScienceTitles() {
  console.log("Sanitizing Integrated Science documents to eliminate copyright and misleading title risks...");

  const colRef = db.collection("global_curriculum/jhs/subjects/science/past_questions");
  const snapshot = await colRef.get();

  if (snapshot.empty) {
    console.log("No Integrated Science past question records found in path.");
    return;
  }

  const batch = db.batch();
  let updatedCount = 0;

  snapshot.forEach((doc) => {
    const data = doc.data();
    const docId = doc.id;
    
    // Extract year or benchmark label
    const yearMatch = docId.match(/\d{4}/);
    const year = yearMatch ? parseInt(yearMatch[0], 10) : (data.year || data.benchmarkYear || 2024);

    const isCCP = docId.toLowerCase().includes("ccp") || (data.title && data.title.includes("CCP"));
    const benchmarkLabel = isCCP ? "NaCCA CCP Benchmark" : `${year} Benchmark`;

    const compliantTitle = isCCP 
      ? "Junior Integrated Science • Comprehensive CCP Preparatory Exam"
      : `BECE-Aligned Integrated Science Model Exam (${year} Benchmark)`;

    const paper1Title = isCCP
      ? "Paper 1: Objective CBT Model (NaCCA CCP Framework)"
      : `Paper 1: Objective CBT Model (${year} Benchmark)`;

    const paper2Title = `Junior Integrated Science • Paper 2 Theory Suite (${year} Benchmark)`;

    const updatePayload: Record<string, any> = {
      title: compliantTitle,
      benchmarkYear: year,
      subjectId: "science",
      examType: "curriculum_benchmark",
      isPastQuestion: false,
      "metadata.isOfficialPastPaper": false,
      "metadata.isCurriculumCalibrated": true,
      "metadata.pedagogicalModel": "Clean-Room Isomorphic Adaptation",
      "metadata.copyrightNotice": legalDisclaimer,
      "metadata.disclaimer": legalDisclaimer,
      "metadata.updatedAt": admin.firestore.FieldValue.serverTimestamp(),
      "paper1.title": paper1Title,
      "paper1.subtitle": `Objective CBT Model • ${benchmarkLabel}`,
      "paper1.badge": "Curriculum-Aligned Model",
      "paper2.title": paper2Title,
      "paper2.subtitle": `Practical & Structured Theory • ${year} Benchmark`,
      "paper2.badge": "Structured Theory Model"
    };

    if (data.metadata?.isOfficial) {
      updatePayload["metadata.isOfficial"] = admin.firestore.FieldValue.delete();
    }

    batch.update(doc.ref, updatePayload);
    updatedCount++;
    console.log(`Sanitized Science record: ${docId} -> "${compliantTitle}"`);
  });

  await batch.commit();
  console.log(`\nSuccessfully sanitized ${updatedCount} Integrated Science documents in Firestore.`);
}

if (require.main === module) {
  sanitizeScienceTitles()
    .then(() => process.exit(0))
    .catch((err) => {
      console.error("Sanitization script encountered an error:", err);
      process.exit(1);
    });
}
