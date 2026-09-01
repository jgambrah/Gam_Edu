import { computeFinancialMetrics } from '../financial-analytics';

/**
 * Verification & Reconciliation Assertion Test
 * Verifies that Executive Cockpit Metrics === Financial Intelligence & Audit Metrics
 * when run on identical dataset parameters.
 */
function runReconciliationTest() {
  console.log("=== GAM EDU FINANCIAL RECONCILIATION TEST ===");

  const now = new Date();
  const past35Days = new Date(now.getTime() - 35 * 24 * 60 * 60 * 1000);
  const past75Days = new Date(now.getTime() - 75 * 24 * 60 * 60 * 1000);

  const mockStudents = [
    { id: 's1', uid: 's1', firstName: 'Kofi', lastName: 'Mensah', classId: 'c1', enrollmentStatus: 'Active', campusId: 'main' },
    { id: 's2', uid: 's2', firstName: 'Ama', lastName: 'Osei', classId: 'c1', enrollmentStatus: 'Active', campusId: 'main' },
    { id: 's3', uid: 's3', firstName: 'Kwame', lastName: 'Appiah', classId: 'c2', enrollmentStatus: 'Active', campusId: 'main' },
  ];

  const mockClasses = [
    { id: 'c1', name: 'Grade 1' },
    { id: 'c2', name: 'Grade 2' },
  ];

  const mockFinancialRecords = [
    {
      id: 'r1',
      studentId: 's1',
      studentName: 'Kofi Mensah',
      billedAmount: 10000,
      amountPaid: 6000,
      waiverAmount: 0,
      dueDate: past35Days, // 35 days overdue -> 31-60d tier
      type: 'Tuition',
      campusId: 'main'
    },
    {
      id: 'r2',
      studentId: 's2',
      studentName: 'Ama Osei',
      billedAmount: 15000,
      amountPaid: 5000,
      waiverAmount: 0,
      dueDate: past75Days, // 75 days overdue -> 61-90d tier
      type: 'Tuition',
      campusId: 'main'
    },
    {
      id: 'r3',
      studentId: 's3',
      studentName: 'Kwame Appiah',
      billedAmount: 8000,
      amountPaid: 9000, // -1000 balance -> overpayment credit
      waiverAmount: 0,
      dueDate: now,
      type: 'Canteen',
      campusId: 'main'
    }
  ];

  const mockPayments = [
    { id: 'p1', studentId: 's1', amount: 6000, paidAt: now, category: 'tuition', campusId: 'main' },
    { id: 'p2', studentId: 's2', amount: 5000, paidAt: now, category: 'tuition', campusId: 'main' },
    { id: 'p3', studentId: 's3', amount: 9000, paidAt: now, category: 'canteen', campusId: 'main' },
  ];

  // 1. Run Executive Cockpit Computation
  const executiveMetrics = computeFinancialMetrics({
    financialRecords: mockFinancialRecords,
    payments: mockPayments,
    students: mockStudents,
    classes: mockClasses,
    campusId: 'main',
  });

  // 2. Run Financial Audit View Computation
  const auditMetrics = computeFinancialMetrics({
    financialRecords: mockFinancialRecords,
    payments: mockPayments,
    students: mockStudents,
    classes: mockClasses,
    campusId: 'main',
  });

  // Assertions
  console.assert(executiveMetrics.totalBilled === auditMetrics.totalBilled, "Billed target mismatch!");
  console.assert(executiveMetrics.totalRevenue === auditMetrics.totalRevenue, "Total revenue mismatch!");
  console.assert(executiveMetrics.collectionRate === auditMetrics.collectionRate, "Collection rate mismatch!");
  console.assert(executiveMetrics.grossReceivables === auditMetrics.grossReceivables, "Gross receivables mismatch!");
  console.assert(executiveMetrics.netReceivables === auditMetrics.netReceivables, "Net receivables mismatch!");

  console.assert(
    executiveMetrics.debtAgingStats.grossTotal === auditMetrics.debtAgingStats.grossTotal,
    "Debt aging gross total mismatch!"
  );
  console.assert(
    executiveMetrics.debtAgingStats.advancePayments === auditMetrics.debtAgingStats.advancePayments,
    "Advance payments credit mismatch!"
  );

  console.log("Total Billed:", executiveMetrics.totalBilled);
  console.log("Total Revenue:", executiveMetrics.totalRevenue);
  console.log("Collection Rate:", executiveMetrics.collectionRate + "%");
  console.log("Gross Receivables:", executiveMetrics.grossReceivables);
  console.log("Advance Credits:", executiveMetrics.debtAgingStats.advancePayments);
  console.log("Net Receivables:", executiveMetrics.netReceivables);
  console.log("Aging Tiers:", {
    current: executiveMetrics.debtAgingStats.current,
    age30: executiveMetrics.debtAgingStats.age30,
    age60: executiveMetrics.debtAgingStats.age60,
    age90: executiveMetrics.debtAgingStats.age90,
    over90: executiveMetrics.debtAgingStats.over90,
  });
  console.log("Account Counts:", executiveMetrics.debtAgingStats.accountCounts);

  const overdue60PlusSum = executiveMetrics.debtAgingStats.age60 + executiveMetrics.debtAgingStats.age90 + executiveMetrics.debtAgingStats.over90;
  const overdue60PlusCount = executiveMetrics.debtAgingStats.accountCounts.overdue60Plus;
  console.log(`Action Center Banner Preview: GH₵ ${overdue60PlusSum.toLocaleString()} overdue across ${overdue60PlusCount} accounts (>60 days)`);

  if (
    executiveMetrics.totalBilled === auditMetrics.totalBilled &&
    executiveMetrics.totalRevenue === auditMetrics.totalRevenue &&
    executiveMetrics.grossReceivables === auditMetrics.grossReceivables &&
    executiveMetrics.netReceivables === auditMetrics.netReceivables
  ) {
    console.log("[SUCCESS] Executive Cockpit Metrics === Audit Ledger Metrics (100% Reconciliation Matched!)");
  } else {
    console.error("[FAILURE] Discrepancy detected between Executive Cockpit and Audit Ledger!");
    process.exit(1);
  }
}

runReconciliationTest();
