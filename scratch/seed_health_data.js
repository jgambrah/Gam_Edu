const admin = require('firebase-admin');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config({ path: path.join(__dirname, '../.env') });

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert({
      projectId: process.env.FIREBASE_PROJECT_ID,
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
      privateKey: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n'),
    })
  });
}

const db = admin.firestore();
const schoolId = '4Md6HrL4GAJcQsIaN6qN';

const studentUpdates = [
  {
    id: '06RyHU5JZrfLSVflG56bizDg91h2', // Jude Atibila
    bloodGroup: 'O+',
    chronicIllnesses: 'Asthma',
    allergies: 'Dust, Pollen',
    healthNotes: 'Must carry Albuterol inhaler. Administer 2 puffs during acute wheezing.'
  },
  {
    id: '08GxPatWNfe53GydT58kkmsD2d62', // Pearl Adongo
    bloodGroup: 'A-',
    chronicIllnesses: 'None',
    allergies: 'Peanuts, Shellfish',
    healthNotes: 'Severe allergy to peanuts. Keep Epinephrine Auto-Injector (EpiPen) in desk.'
  },
  {
    id: '0AObcmbl19Tzrp2VWc8mfmqjqAY2', // Tabitha Akolgo
    bloodGroup: 'B+',
    chronicIllnesses: 'ADHD',
    allergies: 'None',
    healthNotes: 'Requires daily dose of Ritalin 10mg at 10:00 AM. Monitor concentration.'
  },
  {
    id: '06yUct0ktVYJpCNA194hcZDI6hr1', // Hamond Ayarebire
    bloodGroup: 'AB+',
    chronicIllnesses: 'Type 1 Diabetes',
    allergies: 'None',
    healthNotes: 'Insulin-dependent. Requires checking blood glucose levels before lunch.'
  }
];

const mockLogs = [
  {
    studentId: '06RyHU5JZrfLSVflG56bizDg91h2',
    schoolId,
    reportedSymptoms: 'Shortness of breath, acute wheezing after PE track session',
    treatmentAdministered: 'Administered 2 puffs of patient-provided Albuterol inhaler. Placed under observation in upright sitting posture.',
    disposition: 'Returned to Dorm',
    treatingStaffName: 'Nurse Evelyn Darko',
    isSevereTriage: true,
    visitDate: new Date(Date.now() - 3 * 3600 * 1000) // 3 hours ago
  },
  {
    studentId: '08GxPatWNfe53GydT58kkmsD2d62',
    schoolId,
    reportedSymptoms: 'Mild skin rash and itching on forearms',
    treatmentAdministered: 'Applied topical Calamine lotion and administered 5ml oral Cetirizine antihistamine.',
    disposition: 'Returned to Dorm',
    treatingStaffName: 'Nurse Evelyn Darko',
    isSevereTriage: false,
    visitDate: new Date(Date.now() - 24 * 3600 * 1000) // 1 day ago
  },
  {
    studentId: '0AObcmbl19Tzrp2VWc8mfmqjqAY2',
    schoolId,
    reportedSymptoms: 'Complained of dull headache and fatigue during morning lesson',
    treatmentAdministered: 'Administered 500mg Paracetamol, recommended 30-minute rest on cot in dark ward.',
    disposition: 'Returned to Dorm',
    treatingStaffName: 'Nurse Evelyn Darko',
    isSevereTriage: false,
    visitDate: new Date(Date.now() - 2 * 24 * 3600 * 1000) // 2 days ago
  },
  {
    studentId: '06yUct0ktVYJpCNA194hcZDI6hr1',
    schoolId,
    reportedSymptoms: 'Lethargy, cold sweat, blood sugar check registered low (3.8 mmol/L)',
    treatmentAdministered: 'Administered fast-acting glucose (orange juice and crackers). Rechecked levels after 15 mins (5.4 mmol/L).',
    disposition: 'Returned to Dorm',
    treatingStaffName: 'Nurse Evelyn Darko',
    isSevereTriage: false,
    visitDate: new Date(Date.now() - 3 * 24 * 3600 * 1000) // 3 days ago
  },
  {
    studentId: '0D49c1T0oGdeLHutJ0ZMw3xuyet1', // Adongo Robert Atampugre
    schoolId,
    reportedSymptoms: 'Minor abrasion and scrape on left knee from soccer pitch fall',
    treatmentAdministered: 'Cleaned wound with saline solution, applied antiseptic ointment, and dressed with sterile gauze bandage.',
    disposition: 'Returned to Dorm',
    treatingStaffName: 'Officer Samuel Mensah',
    isSevereTriage: false,
    visitDate: new Date(Date.now() - 4 * 24 * 3600 * 1000) // 4 days ago
  },
  {
    studentId: '06RyHU5JZrfLSVflG56bizDg91h2',
    schoolId,
    reportedSymptoms: 'Severe chest tightness and persistent dry cough',
    treatmentAdministered: 'Nebulized with Salbutamol for 10 minutes. Referred to hospital as precaution.',
    disposition: 'Transferred to Hospital',
    treatingStaffName: 'Dr. Albert Asare',
    isSevereTriage: true,
    visitDate: new Date(Date.now() - 5 * 24 * 3600 * 1000) // 5 days ago
  },
  {
    studentId: '08GxPatWNfe53GydT58kkmsD2d62',
    schoolId,
    reportedSymptoms: 'Nausea and stomach cramps post lunch meal',
    treatmentAdministered: 'Offered warm peppermint tea, placed in supine posture with heating pad for 45 minutes.',
    disposition: 'Kept for Observation',
    treatingStaffName: 'Nurse Evelyn Darko',
    isSevereTriage: false,
    visitDate: new Date(Date.now() - 6 * 24 * 3600 * 1000) // 6 days ago
  }
];

async function seed() {
  console.log("Seeding student health info...");
  for (const upd of studentUpdates) {
    await db.collection('students').doc(upd.id).set({
      bloodGroup: upd.bloodGroup,
      chronicIllnesses: upd.chronicIllnesses,
      allergies: upd.allergies,
      healthNotes: upd.healthNotes
    }, { merge: true });
    console.log(`Updated student ${upd.id} medical info`);
  }

  console.log("\nSeeding infirmary logs...");
  for (const log of mockLogs) {
    const docRef = await db.collection('infirmary_logs').add({
      ...log,
      createdAt: admin.firestore.FieldValue.serverTimestamp()
    });
    console.log(`Added log doc ${docRef.id} for student ${log.studentId}`);
  }
  console.log("Seeding complete!");
}

seed();
