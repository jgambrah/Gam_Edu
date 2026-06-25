const admin = require('firebase-admin');
const dotenv = require('dotenv');
const path = require('path');

// Load environment variables
dotenv.config({ path: path.join(__dirname, '..', '.env') });

const projectId = process.env.FIREBASE_PROJECT_ID;
const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
let privateKey = process.env.FIREBASE_PRIVATE_KEY;

if (privateKey) {
  privateKey = privateKey.replace(/\\n/g, '\n');
}

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert({
      projectId,
      clientEmail,
      privateKey,
    })
  });
}

const db = admin.firestore();

function startOfDay(date) {
  const d = new Date(date);
  d.setHours(0, 0, 0, 0);
  return d;
}

async function analyze() {
  try {
    console.log("Fetching students and financial records from Firestore...");
    const studentsSnap = await db.collection('students').get();
    const financialRecordsSnap = await db.collection('financialRecords').get();

    const students = [];
    studentsSnap.forEach(doc => {
      students.push({ uid: doc.id, ...doc.data() });
    });

    const financialRecords = [];
    financialRecordsSnap.forEach(doc => {
      financialRecords.push({ id: doc.id, ...doc.data() });
    });

    console.log(`\nLoaded ${students.length} students total.`);
    console.log(`Loaded ${financialRecords.length} financial records total.`);

    // Determine schoolIds
    const schoolIds = new Set();
    financialRecords.forEach(r => {
      if (r.schoolId) schoolIds.add(r.schoolId);
    });
    console.log("School IDs present in financial records:", Array.from(schoolIds));

    // Let's use the first schoolId or all if there is only one
    const targetSchoolId = Array.from(schoolIds)[0];
    console.log(`Targeting School ID: ${targetSchoolId}`);

    const schoolStudents = students.filter(s => s.schoolId === targetSchoolId);
    const activeStudents = schoolStudents.filter(s => s.enrollmentStatus === 'Active' || !s.enrollmentStatus);
    const activeStudentIds = new Set(activeStudents.map(s => s.uid));

    const schoolFinancialRecords = financialRecords.filter(r => r.schoolId === targetSchoolId);

    console.log(`Students in target school: ${schoolStudents.length}`);
    console.log(`Active Students in target school: ${activeStudents.length}`);
    console.log(`Financial Records in target school: ${schoolFinancialRecords.length}`);

    // --- REPLICATE FINANCIALS CALCULATION ---
    const activeRecords = schoolFinancialRecords.filter(r => 
      activeStudentIds.has(r.studentId) && 
      r.status !== 'Pending Reversal'
    );

    let totalBilled = 0;
    let totalPaid = 0;
    let totalWaivers = 0;

    activeRecords.forEach(r => {
      const billed = Number(r.billedAmount) || 0;
      const paid = Number(r.amountPaid) || 0;
      const waiver = Number(r.waiverAmount) || 0;
      totalBilled += billed;
      totalPaid += paid;
      totalWaivers += waiver;
    });

    const financialsTotalOutstanding = totalBilled - totalPaid - totalWaivers;
    console.log("\n=== FINANCIALS SUMMARY ===");
    console.log(`Total Billed: GHC ${totalBilled}`);
    console.log(`Total Paid: GHC ${totalPaid}`);
    console.log(`Total Waivers: GHC ${totalWaivers}`);
    console.log(`Outstanding Receivables: GHC ${financialsTotalOutstanding}`);

    // --- REPLICATE DEBT AGING CALCULATION ---
    const today = startOfDay(new Date());
    let current = 0;
    let age30 = 0;
    let age60 = 0;
    let age90 = 0;

    const recordsWithNegativeBalance = [];
    const recordsWithPositiveBalance = [];

    schoolFinancialRecords.forEach(r => {
      if (!activeStudentIds.has(r.studentId) || r.status === 'Pending Reversal') return;
      
      const billed = Number(r.billedAmount) || 0;
      const paid = Number(r.amountPaid) || 0;
      const waiver = Number(r.waiverAmount) || 0;
      const balance = billed - paid - waiver;

      if (balance <= 0.01) {
        if (balance < 0) {
          recordsWithNegativeBalance.push({ r, balance });
        }
        return;
      }

      recordsWithPositiveBalance.push({ r, balance });

      const dueDateVal = r.dueDate?.toDate ? r.dueDate.toDate() : new Date(r.dueDate);
      const diffTime = today.getTime() - startOfDay(dueDateVal).getTime();
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

      if (diffDays <= 0) {
        current += balance;
      } else if (diffDays <= 30) {
        age30 += balance;
      } else if (diffDays <= 60) {
        age60 += balance;
      } else {
        age90 += balance;
      }
    });

    const agingSum = current + age30 + age60 + age90;
    console.log("\n=== AGING SUMMARY ===");
    console.log(`Current Dues: GHC ${current}`);
    console.log(`1-30 Days: GHC ${age30}`);
    console.log(`31-60 Days: GHC ${age60}`);
    console.log(`61+ Days: GHC ${age90}`);
    console.log(`Sum of Aging Categories: GHC ${agingSum}`);
    console.log(`Discrepancy (Aging Sum - Outstanding Receivables): GHC ${agingSum - financialsTotalOutstanding}`);

    console.log(`\n=== NEGATIVE BALANCES (OVERPAYMENTS/WAIVERS) ===`);
    console.log(`Total records with negative balance: ${recordsWithNegativeBalance.length}`);
    let sumNegative = 0;
    recordsWithNegativeBalance.forEach(item => {
      sumNegative += item.balance;
      // Let's only print first 10 negative balances to avoid spam
    });
    console.log(`Sum of negative balances: GHC ${sumNegative}`);

    console.log(`\n=== ALL ACTIVE RECORDS AND OUTSTANDING BALANCES ===`);
    let manualSumBalance = 0;
    activeRecords.forEach(r => {
      const billed = Number(r.billedAmount) || 0;
      const paid = Number(r.amountPaid) || 0;
      const waiver = Number(r.waiverAmount) || 0;
      const balance = billed - paid - waiver;
      manualSumBalance += balance;
    });
    console.log(`Sum of all record balances (including negative): GHC ${manualSumBalance}`);

    const positiveSum = recordsWithPositiveBalance.reduce((acc, curr) => acc + curr.balance, 0);
    console.log(`Sum of positive balances: GHC ${positiveSum}`);

  } catch (error) {
    console.error(error);
  }
}

analyze();
