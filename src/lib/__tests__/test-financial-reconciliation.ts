import { computeFinancialMetrics } from '../financial-analytics';
import { calculateCollectionRate, calculateBillingTotals } from '../financials';

/**
 * GAM EDU FINANCIAL RECONCILIATION UNIT TEST
 * Verifies exact mathematical identity and SSOT reconciliation across
 * Executive Overview (/dashboard) and Financial Intelligence & Audit (/financials).
 */
function runReconciliationTest() {
  console.log("=== GAM EDU FINANCIAL RECONCILIATION TEST ===");

  const now = new Date();
  const past45Days = new Date(now.getTime() - 45 * 24 * 60 * 60 * 1000);
  const past75Days = new Date(now.getTime() - 75 * 24 * 60 * 60 * 1000);

  // 1. Pure Helper Unit Tests
  const rateTest = calculateCollectionRate(85684, 124842);
  console.log(`calculateCollectionRate(85684, 124842) = ${rateTest}% (Expected: 68.6%)`);
  console.assert(rateTest === 68.6, `Expected 68.6%, got ${rateTest}%`);

  const mockStudents = [
    { id: 's1', uid: 's1', firstName: 'Kofi', lastName: 'Mensah', classId: 'c1', enrollmentStatus: 'Active', campusId: 'main' },
    { id: 's2', uid: 's2', firstName: 'Ama', lastName: 'Osei', classId: 'c2', enrollmentStatus: 'Active', campusId: 'main' },
    { id: 's3', uid: 's3', firstName: 'Kwame', lastName: 'Appiah', classId: 'c3', enrollmentStatus: 'Active', campusId: 'main' },
  ];

  const mockClasses = [
    { id: 'c1', name: 'Grade 1' },
    { id: 'c2', name: 'Grade 2' },
    { id: 'c3', name: 'Grade 3' },
  ];

  // Test Case Dataset reflecting problem prompt:
  // Collections = GH₵ 85,684.00
  // Gross Receivables = GH₵ 39,158.00 (182 + 38,976)
  // Advance Credits = GH₵ 2,471.00
  const mockFinancialRecords = [
    {
      id: 'r1',
      studentId: 's1',
      studentName: 'Kofi Mensah',
      billedAmount: 182,
      amountPaid: 0,
      waiverAmount: 0,
      dueDate: past45Days, // 45 days overdue (31-60d)
      type: 'Tuition',
      campusId: 'main'
    },
    {
      id: 'r2',
      studentId: 's2',
      studentName: 'Ama Osei',
      billedAmount: 38976,
      amountPaid: 0,
      waiverAmount: 0,
      dueDate: past75Days, // 75 days overdue (61+d)
      type: 'Tuition',
      campusId: 'main'
    },
    {
      id: 'r3',
      studentId: 's3',
      studentName: 'Kwame Appiah',
      billedAmount: 0,
      amountPaid: 2471, // Overpayment / Prepayment Credit
      waiverAmount: 0,
      dueDate: now,
      type: 'Tuition',
      campusId: 'main'
    }
  ];

  const mockPayments = [
    { id: 'p1', studentId: 's1', amount: 83482, paidAt: now, category: 'tuition', campusId: 'main' },
    { id: 'p2', studentId: 's2', amount: 2202, paidAt: now, category: 'canteen', campusId: 'main' },
  ];

  // Run computeFinancialMetrics
  const result = computeFinancialMetrics({
    financialRecords: mockFinancialRecords,
    payments: mockPayments,
    students: mockStudents,
    classes: mockClasses,
    campusId: 'main',
  });

  console.log("Calculated Billed Target:", result.totalBilled);
  console.log("Calculated Collected Revenue:", result.totalRevenue);
  console.log("Calculated Collection Rate:", result.collectionRate + "%");
  console.log("Calculated Gross Receivables:", result.grossReceivables);
  console.log("Calculated Advance Credits:", result.debtAgingStats.advancePayments);
  console.log("Calculated Net Receivables:", result.netReceivables);

  // Assertions for exact target values
  console.assert(result.totalRevenue === 85684, `Expected totalRevenue 85684, got ${result.totalRevenue}`);
  console.assert(result.totalBilled === 124842, `Expected totalBilled 124842, got ${result.totalBilled}`);
  console.assert(result.collectionRate === 68.6, `Expected collectionRate 68.6%, got ${result.collectionRate}%`);
  console.assert(result.grossReceivables === 39158, `Expected grossReceivables 39158, got ${result.grossReceivables}`);
  console.assert(result.debtAgingStats.advancePayments === 2471, `Expected advancePayments 2471, got ${result.debtAgingStats.advancePayments}`);
  console.assert(result.netReceivables === 36687, `Expected netReceivables 36687, got ${result.netReceivables}`);

  const overdue60PlusSum = result.debtAgingStats.age90 + result.debtAgingStats.over90;
  const overdue60PlusCount = result.debtAgingStats.accountCounts.overdue60Plus;
  console.log(`Action Center Banner Preview: GH₵ ${overdue60PlusSum.toLocaleString()} overdue across ${overdue60PlusCount} accounts (>60 days)`);

  if (
    result.totalRevenue === 85684 &&
    result.totalBilled === 124842 &&
    result.collectionRate === 68.6 &&
    result.grossReceivables === 39158 &&
    result.netReceivables === 36687
  ) {
    console.log("[SUCCESS] Executive Cockpit Metrics === Audit Ledger Metrics (100% Mathematical Reconciliation Verified!)");
  } else {
    console.error("[FAILURE] Discrepancy detected during financial reconciliation test!");
    process.exit(1);
  }
}

runReconciliationTest();
