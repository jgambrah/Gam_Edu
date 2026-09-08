"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.executeTermFinancialRollover = executeTermFinancialRollover;
const app_1 = require("firebase-admin/app");
const firestore_1 = require("firebase-admin/firestore");
function getAdminDb() {
    const existingApps = (0, app_1.getApps)();
    const adminApp = existingApps.find(app => app.name === 'admin');
    if (adminApp)
        return (0, firestore_1.getFirestore)(adminApp);
    if (existingApps.length > 0)
        return (0, firestore_1.getFirestore)(existingApps[0]);
    const projectId = process.env.FIREBASE_PROJECT_ID;
    const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
    const privateKeyRaw = process.env.FIREBASE_PRIVATE_KEY;
    if (projectId && clientEmail && privateKeyRaw) {
        const formattedKey = privateKeyRaw.replace(/\\n/g, '\n').replace(/"/g, '');
        const app = (0, app_1.initializeApp)({
            credential: (0, app_1.cert)({
                projectId,
                clientEmail,
                privateKey: formattedKey,
            }),
        }, 'admin');
        return (0, firestore_1.getFirestore)(app);
    }
    const defaultApp = (0, app_1.initializeApp)();
    return (0, firestore_1.getFirestore)(defaultApp);
}
/**
 * executeTermFinancialRollover
 *
 * Idempotent serverless routine to calculate itemized unpaid balances at term end,
 * write opening "Arrears Brought Forward" documents with deterministic IDs,
 * and mark raw term financial records as archived.
 */
async function executeTermFinancialRollover(schoolId, currentTermId, nextTermId) {
    const db = getAdminDb();
    // 1. Fetch active students for this school (in-memory filtering avoids unbuilt index errors)
    const studentsSnap = await db.collection('students')
        .where('schoolId', '==', schoolId)
        .get();
    const studentMap = new Map();
    studentsSnap.forEach(sDoc => {
        const s = sDoc.data();
        if (s.isArchived === true)
            return;
        if (s.enrollmentStatus === 'Active' || !s.enrollmentStatus) {
            studentMap.set(sDoc.id, `${s.firstName || ''} ${s.lastName || ''}`.trim() || 'Student');
        }
    });
    // 2. Fetch current term financial records for this school (in-memory filtering avoids unbuilt index errors)
    const recordsSnap = await db.collection('financialRecords')
        .where('schoolId', '==', schoolId)
        .where('termId', '==', currentTermId)
        .get();
    const studentBalances = {};
    recordsSnap.forEach(doc => {
        var _a, _b, _c, _d;
        const r = doc.data();
        if (r.isArchived === true)
            return;
        const studentId = r.studentId;
        if (!studentId || !studentMap.has(studentId))
            return;
        if (!studentBalances[studentId]) {
            studentBalances[studentId] = {
                tuitionArrears: 0,
                busArrears: 0,
                canteenArrears: 0,
                examArrears: 0,
                otherArrears: 0,
                totalArrears: 0,
            };
        }
        const billed = Number((_b = (_a = r.billedAmount) !== null && _a !== void 0 ? _a : r.amount) !== null && _b !== void 0 ? _b : 0);
        const paid = Number((_c = r.amountPaid) !== null && _c !== void 0 ? _c : 0);
        const waiver = Number((_d = r.waiverAmount) !== null && _d !== void 0 ? _d : 0);
        const balance = billed - paid - waiver;
        if (balance <= 0.01)
            return;
        const category = (r.category || r.type || 'tuition').toLowerCase();
        if (category.includes('bus') || category.includes('transport')) {
            studentBalances[studentId].busArrears += balance;
        }
        else if (category.includes('canteen') || category.includes('feeding') || category.includes('mess')) {
            studentBalances[studentId].canteenArrears += balance;
        }
        else if (category.includes('exam') || category.includes('test')) {
            studentBalances[studentId].examArrears += balance;
        }
        else if (category.includes('tuition') || category.includes('fee')) {
            studentBalances[studentId].tuitionArrears += balance;
        }
        else {
            studentBalances[studentId].otherArrears += balance;
        }
        studentBalances[studentId].totalArrears += balance;
    });
    // 3. Batch write itemized "Arrears Brought Forward" opening balance & archive raw records
    const batch = db.batch();
    let totalArrearsCarried = 0;
    let processedCount = 0;
    for (const [studentId, arrears] of Object.entries(studentBalances)) {
        if (arrears.totalArrears <= 0.01)
            continue;
        // Strict Idempotent Document ID: arrears_${schoolId}_${studentId}_${nextTermId}
        const docId = `arrears_${schoolId}_${studentId}_${nextTermId}`;
        const arrearsRef = db.collection('financialRecords').doc(docId);
        batch.set(arrearsRef, {
            id: docId,
            schoolId,
            studentId,
            studentName: studentMap.get(studentId) || 'Student',
            termId: nextTermId,
            title: 'Arrears Brought Forward',
            category: 'Arrears',
            billedAmount: arrears.totalArrears,
            amountPaid: 0,
            waiverAmount: 0,
            itemizedArrears: {
                tuitionArrears: arrears.tuitionArrears,
                busArrears: arrears.busArrears,
                canteenArrears: arrears.canteenArrears,
                examArrears: arrears.examArrears,
                otherArrears: arrears.otherArrears,
            },
            status: 'Pending',
            isArchived: false,
            createdAt: firestore_1.FieldValue.serverTimestamp(),
        }, { merge: true });
        totalArrearsCarried += arrears.totalArrears;
        processedCount++;
    }
    // 4. Flag raw financial records for ending term as archived (non-destructive)
    recordsSnap.forEach(rDoc => {
        const rData = rDoc.data();
        if (rData.isArchived !== true) {
            batch.update(rDoc.ref, { isArchived: true });
        }
    });
    // 4b. Flag raw academic & attendance records for ending term as archived
    const academicCols = ['assessments', 'attendance', 'behavioral_records', 'reportCards'];
    for (const colName of academicCols) {
        const colSnap = await db.collection(colName)
            .where('schoolId', '==', schoolId)
            .get();
        colSnap.forEach(cDoc => {
            const cData = cDoc.data();
            if (cData.isArchived !== true && (cData.termId === currentTermId || !cData.termId)) {
                batch.update(cDoc.ref, { isArchived: true });
            }
        });
    }
    // 5. Update school settings term pointers
    const schoolRef = db.collection('schoolSettings').doc(schoolId);
    batch.set(schoolRef, {
        currentTermId: nextTermId,
        lastTermRolloverAt: firestore_1.FieldValue.serverTimestamp(),
        termStatus: 'Active',
    }, { merge: true });
    await batch.commit();
    return {
        success: true,
        processedStudents: processedCount,
        totalArrearsCarried,
    };
}
//# sourceMappingURL=financial-rollover.js.map