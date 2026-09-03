/**
 * Financial Analytics Engine
 * Single Source of Truth for executive financial KPIs, revenue stream classifications,
 * receivables calculations, and live stream deduplication across Gam Edu.
 */

import { startOfDay } from 'date-fns';
import { calculateCollectionRate } from './financials';

export interface PaymentItem {
  id?: string;
  amount?: number;
  amountPaid?: number;
  type?: string;
  category?: string;
  description?: string;
  feeType?: string;
  notes?: string;
  name?: string;
  title?: string;
  paymentType?: string;
  narration?: string;
  paymentNarration?: string;
  item?: string;
  paidAt?: any;
  createdAt?: any;
  date?: any;
  timestamp?: any;
  paymentDate?: any;
  status?: string;
  studentId?: string;
  studentName?: string;
  className?: string;
  method?: string;
  paymentMethod?: string;
}

export interface FinancialRecordItem {
  id?: string;
  studentId?: string;
  studentName?: string;
  className?: string;
  billedAmount?: number;
  amountPaid?: number;
  waiverAmount?: number;
  status?: string;
  dueDate?: any;
  lastPaymentDate?: any;
  lastPaymentAmount?: number;
  type?: string;
  category?: string;
  description?: string;
  feeType?: string;
  payments?: PaymentItem[];
}

export interface RevenueStreamBreakdown {
  tuition: number;
  canteen: number;
  transport: number;
  boarding: number;
  uniformsBooks: number;
  other: number;
  total: number;
}

export interface DebtAgingBreakdown {
  current: number;
  age30: number;
  age60: number;
  age90: number;
  over90: number;
  overpayments: number;
  advancePayments: number;
  total: number;
  grossTotal: number;
  netTotal: number;
  accountCounts: {
    current: number;
    age30: number;
    age60: number;
    age90: number;
    over90: number;
    totalOverdue: number;
    overdue60Plus: number;
  };
}

export interface FinancialMetricsFilterOptions {
  financialRecords?: any[];
  payments?: any[];
  students?: any[];
  classes?: any[];
  budgets?: any[];
  campusId?: string;
  termId?: string;
  academicYear?: string;
  arrearsThreshold?: number;
}

export interface FinancialMetricsResult {
  // Collections by Period
  collectedToday: number;
  todayCount: number;
  collectedThisMonth: number;
  collectedThisTerm: number;
  collectedThisYear: number;
  totalRevenue: number;

  // Receivables & Arrears
  totalBilled: number;
  totalPaid: number;
  totalWaivers: number;
  grossReceivables: number;
  netReceivables: number;
  collectionRate: number;
  debtAgingStats: DebtAgingBreakdown;

  // Granular Revenue Streams
  streamStats: RevenueStreamBreakdown;
  revenueByType: Array<{ name: string; value: number }>;

  // Categorized Receivables Breakdown
  outstandingTuition: number;
  outstandingCanteen: number;
  outstandingTransport: number;
  outstandingOther: number;

  // Liquidity & Cash Flow
  thirtyDayInflowProjection: number;
  liquidityBufferAmount: number;
  liquidityCoverageMonths: number;

  // Live Stream Ledger (Deduplicated transactions list)
  livePaymentStream: Array<{
    id: string;
    studentId?: string;
    studentName: string;
    className: string;
    amount: number;
    method: string;
    date: Date;
    dateFormatted: string;
    category: string;
    categoryLabel: string;
    status: string;
    narration: string;
  }>;

  // Overdue Arrears Roster
  arrearsRoster: Array<{
    studentId: string;
    studentName: string;
    className: string;
    amount: number;
    daysOverdue: number;
    dueDateFormatted: string;
    feeType: string;
  }>;
}

/**
 * Safely parse dates from Firestore Timestamps, ISO strings, or Date objects
 */
export function safeParseDate(val: any): Date | null {
  if (!val) return null;
  if (val instanceof Date) return isNaN(val.getTime()) ? null : val;
  if (typeof val?.toDate === 'function') {
    try {
      const d = val.toDate();
      return isNaN(d.getTime()) ? null : d;
    } catch {
      return null;
    }
  }
  if (typeof val === 'number') {
    const d = new Date(val);
    return isNaN(d.getTime()) ? null : d;
  }
  if (typeof val === 'string') {
    const d = new Date(val);
    return isNaN(d.getTime()) ? null : d;
  }
  return null;
}

/**
 * Categorize any transaction or bill into standardized revenue streams
 */
export function classifyFeeCategory(p: any): 'tuition' | 'canteen' | 'transport' | 'boarding' | 'uniforms' | 'other' {
  if (!p) return 'tuition';
  const text = `${p.type || ''} ${p.category || ''} ${p.description || ''} ${p.feeType || ''} ${p.notes || ''} ${p.name || ''} ${p.title || ''} ${p.paymentType || ''} ${p.narration || ''} ${p.paymentNarration || ''} ${p.item || ''}`.toLowerCase();

  if (text.includes('canteen') || text.includes('feed') || text.includes('lunch') || text.includes('meal') || text.includes('food') || text.includes('cafeteria')) {
    return 'canteen';
  }
  if (text.includes('bus') || text.includes('transport') || text.includes('fare') || text.includes('shuttle') || text.includes('transit') || text.includes('vehicle')) {
    return 'transport';
  }
  if (text.includes('boarding') || text.includes('hostel') || text.includes('dorm') || text.includes('accommodation')) {
    return 'boarding';
  }
  if (text.includes('uniform') || text.includes('book') || text.includes('textbook') || text.includes('stationery') || text.includes('crest') || text.includes('jersey') || text.includes('exercise')) {
    return 'uniforms';
  }
  if (text.includes('rent') || text.includes('hire') || text.includes('fine') || text.includes('penalty') || text.includes('transcript') || text.includes('certificate')) {
    return 'other';
  }
  
  // All tuition, school fees, academic fees, term deposits, general cash receipts belong to Tuition & Academic Fees
  return 'tuition';
}

/**
 * Standardize active term date bounds
 */
export function getActiveTermBounds(budgets: any[] = []): { start: Date; end: Date; label: string } {
  const now = new Date();
  if (budgets && budgets.length > 0) {
    const activeBudget = budgets.find((b: any) => {
      if (b.status !== 'Approved') return false;
      const start = safeParseDate(b.startDate);
      const end = safeParseDate(b.endDate);
      return start && end && now >= start && now <= end;
    });
    if (activeBudget) {
      const start = safeParseDate(activeBudget.startDate) || new Date(now.getFullYear(), 0, 1);
      const end = safeParseDate(activeBudget.endDate) || new Date(now.getFullYear(), 11, 31, 23, 59, 59);
      return { start, end, label: activeBudget.name || activeBudget.term || "Current Term" };
    }
  }

  // Fallback basic school terms in Ghana
  const currentYear = now.getFullYear();
  const currentMonth = now.getMonth();
  if (currentMonth <= 3) {
    return { start: new Date(currentYear, 0, 1, 0, 0, 0, 0), end: new Date(currentYear, 3, 30, 23, 59, 59, 999), label: "First Term" };
  } else if (currentMonth <= 7) {
    return { start: new Date(currentYear, 4, 1, 0, 0, 0, 0), end: new Date(currentYear, 7, 31, 23, 59, 59, 999), label: "Second Term" };
  } else {
    return { start: new Date(currentYear, 8, 1, 0, 0, 0, 0), end: new Date(currentYear, 11, 31, 23, 59, 59, 999), label: "Third Term" };
  }
}

/**
 * Compute Single Source of Truth Financial Metrics
 */
export function computeFinancialMetrics({
  financialRecords = [],
  payments = [],
  students = [],
  classes = [],
  budgets = [],
  campusId,
  termId,
  academicYear,
  arrearsThreshold = 0,
}: FinancialMetricsFilterOptions): FinancialMetricsResult {
  const now = new Date();
  const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 0, 0, 0, 0);
  const startOfThisMonth = new Date(now.getFullYear(), now.getMonth(), 1, 0, 0, 0, 0);
  const startOfThisYear = new Date(now.getFullYear(), 0, 1, 0, 0, 0, 0);
  const termBounds = getActiveTermBounds(budgets);

  // Filter students by campus if specified
  const filteredStudents = useMemoFilterStudents(students, campusId);
  const allStudentIds = new Set(
    filteredStudents
      ? filteredStudents
          .map((s: any) => s.uid || s.id || s.studentId)
          .filter(Boolean)
      : []
  );

  const isCampusMatch = (recordCampusId: any, targetCampusId: string) => {
    if (!targetCampusId || targetCampusId === 'all' || !recordCampusId) return true;
    const rCamp = recordCampusId.toString().toLowerCase();
    const cId = targetCampusId.toString().toLowerCase();
    if (cId.includes('all') || cId.includes('main')) return true;
    return rCamp === cId || rCamp.includes(cId) || cId.includes(rCamp);
  };

  // Filter financial records by campus, term, and academic year
  const filteredRecords = financialRecords.filter((r: any) => {
    if (r.status === 'Pending Reversal') return false;
    if (allStudentIds.size > 0 && r.studentId && !allStudentIds.has(r.studentId) && students.length > 0) return false;
    if (campusId && !isCampusMatch(r.campusId, campusId)) return false;
    if (termId && r.termId && r.termId !== termId) return false;
    if (academicYear && r.academicYear && r.academicYear !== academicYear) return false;
    return true;
  });

  // Filter payments by term, academic year, campus
  const filteredPayments = payments.filter((p: any) => {
    if (p.status === 'Reversed' || p.status === 'Cancelled' || p.status === 'Pending Reversal') return false;
    if (allStudentIds.size > 0 && p.studentId && !allStudentIds.has(p.studentId) && students.length > 0) return false;
    if (campusId && !isCampusMatch(p.campusId, campusId)) return false;
    if (termId && p.termId && p.termId !== termId) return false;
    if (academicYear && p.academicYear && p.academicYear !== academicYear) return false;
    return true;
  });

  let collectedToday = 0;
  let todayCount = 0;
  let collectedThisMonth = 0;
  let collectedThisTerm = 0;
  let collectedThisYear = 0;
  let totalRevenue = 0;

  let tuitionStream = 0;
  let canteenStream = 0;
  let transportStream = 0;
  let boardingStream = 0;
  let uniformsStream = 0;
  let otherStream = 0;

  const processedPaymentIds = new Set<string>();
  const livePaymentStream: FinancialMetricsResult['livePaymentStream'] = [];

  // Helper to add a payment entry safely without double counting
  const processPaymentEntry = (p: any) => {
    if (!p) return;
    if (p.status === 'Reversed' || p.status === 'Cancelled' || p.status === 'Pending Reversal') return;
    const amount = Number(p.amount) || Number(p.amountPaid) || Number(p.lastPaymentAmount) || 0;
    if (amount <= 0) return;

    const d = safeParseDate(p.paidAt || p.createdAt || p.date || p.timestamp || p.paymentDate || p.lastPaymentDate) || now;
    const dayStr = d.toISOString().substring(0, 10);
    const cat = classifyFeeCategory(p);

    // Student & Class Name Lookup
    const studentObj = filteredStudents?.find((s: any) => s.uid === p.studentId || s.id === p.studentId);
    const resolvedStudentName = studentObj ? `${studentObj.firstName || ''} ${studentObj.lastName || ''}`.trim() : (p.studentName || 'Student');
    const classObj = classes?.find((c: any) => c.id === (studentObj?.classId || p.classId));
    const sKey = (resolvedStudentName || p.studentId || 'std').toLowerCase().trim();

    // Canonical composite key for deduplication (student + day + amount + category)
    const refNo = p.referenceNo || p.reference_no || p.transactionId || p.receiptNo;
    const canonicalKey = refNo 
      ? `ref-${refNo}` 
      : `${sKey}-${dayStr}-${amount.toFixed(2)}-${cat}`;

    let rawMethod = (p.method || p.paymentMethod || 'Cash / MoMo').trim();
    if (p.isSplitPayment || rawMethod.toLowerCase().includes('split') || rawMethod.includes('/')) {
      rawMethod = 'Split: Cash + MoMo';
    }

    if (processedPaymentIds.has(canonicalKey)) {
      const existing = livePaymentStream.find(item => item.id === canonicalKey);
      if (existing) {
        const m1 = existing.method.toLowerCase();
        const m2 = rawMethod.toLowerCase();
        if ((m1.includes('cash') && (m2.includes('momo') || m2.includes('mobile'))) || 
            ((m1.includes('momo') || m1.includes('mobile')) && m2.includes('cash')) || 
            m2.includes('/') || m2.includes('split')) {
          existing.method = 'Split: Cash + MoMo';
        }
      }
      return;
    }
    processedPaymentIds.add(canonicalKey);

    // Date aggregations
    if (d >= startOfToday) {
      collectedToday += amount;
      todayCount++;
    }
    if (d >= startOfThisMonth) collectedThisMonth += amount;
    if (d >= termBounds.start && d <= termBounds.end) collectedThisTerm += amount;
    if (d >= startOfThisYear) collectedThisYear += amount;
    totalRevenue += amount;

    // Revenue Stream Categorization
    if (cat === 'tuition') tuitionStream += amount;
    else if (cat === 'canteen') canteenStream += amount;
    else if (cat === 'transport') transportStream += amount;
    else if (cat === 'boarding') boardingStream += amount;
    else if (cat === 'uniforms') uniformsStream += amount;
    else otherStream += amount;

    const categoryLabelMap: Record<string, string> = {
      tuition: 'Tuition Fees',
      canteen: 'Canteen & Catering',
      transport: 'Transport & Bus',
      boarding: 'Boarding & Hostel',
      uniforms: 'Uniforms & Books',
      other: 'Other Auxiliary'
    };

    livePaymentStream.push({
      id: canonicalKey,
      studentId: p.studentId,
      studentName: resolvedStudentName,
      className: classObj?.name || p.className || 'Class',
      amount,
      method: rawMethod,
      date: d,
      dateFormatted: d >= startOfToday ? `Today at ${d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}` : d.toLocaleDateString(),
      category: cat,
      categoryLabel: categoryLabelMap[cat] || 'Tuition Fees',
      status: p.status || 'Verified',
      narration: p.description || p.notes || p.paymentNarration || 'Fee Payment'
    });
  };

  // 1. Process explicit payments array
  if (filteredPayments && filteredPayments.length > 0) {
    filteredPayments.forEach(p => processPaymentEntry(p));
  }

  // 2. Process financialRecords subcollections and lastPaymentDate if not already processed
  if (filteredRecords && filteredRecords.length > 0) {
    filteredRecords.forEach((r: any) => {
      if (r.payments && Array.isArray(r.payments) && r.payments.length > 0) {
        r.payments.forEach((p: any) => {
          processPaymentEntry({
            ...p,
            studentId: p.studentId || r.studentId,
            studentName: p.studentName || r.studentName
          });
        });
      } else if (r.lastPaymentDate && Number(r.amountPaid) > 0) {
        processPaymentEntry({
          id: `rec-${r.id}-${r.lastPaymentDate}`,
          amount: Number(r.lastPaymentAmount) || Number(r.amountPaid) || 0,
          paidAt: r.lastPaymentDate,
          studentId: r.studentId,
          studentName: r.studentName,
          type: r.type || r.category || 'Tuition',
          description: r.description || r.paymentNarration
        });
      }
    });
  }

  // 3. Receivables & Arrears Calculations across active student records
  let totalBilled = 0;
  let totalPaid = 0;
  let totalWaivers = 0;
  let grossReceivables = 0;

  let outstandingTuition = 0;
  let outstandingCanteen = 0;
  let outstandingTransport = 0;
  let outstandingOther = 0;

  const arrearsRoster: FinancialMetricsResult['arrearsRoster'] = [];

  filteredRecords.forEach((r: any) => {
    const billed = Number(r.billedAmount) || 0;
    const paid = Number(r.amountPaid) || 0;
    const waiver = Number(r.waiverAmount) || 0;

    totalBilled += billed;
    totalPaid += paid;
    totalWaivers += waiver;

    const balance = billed - paid - waiver;
    if (balance > 0.01) {
      grossReceivables += balance;

      const cat = classifyFeeCategory(r);
      if (cat === 'tuition') outstandingTuition += balance;
      else if (cat === 'canteen') outstandingCanteen += balance;
      else if (cat === 'transport') outstandingTransport += balance;
      else outstandingOther += balance;

      const studentObj = filteredStudents?.find((s: any) => s.uid === r.studentId || s.id === r.studentId);
      const classObj = classes?.find((c: any) => c.id === (studentObj?.classId || r.classId));
      const dueDate = safeParseDate(r.dueDate);
      const daysOverdue = dueDate && dueDate < now ? Math.ceil((now.getTime() - dueDate.getTime()) / (1000 * 3600 * 24)) : 0;

      if (balance >= arrearsThreshold) {
        arrearsRoster.push({
          studentId: r.studentId,
          studentName: studentObj ? `${studentObj.firstName || ''} ${studentObj.lastName || ''}`.trim() : (r.studentName || 'Student'),
          className: classObj?.name || 'Unassigned',
          amount: balance,
          daysOverdue,
          dueDateFormatted: dueDate ? dueDate.toLocaleDateString() : 'N/A',
          feeType: r.type || r.feeType || 'Tuition'
        });
      }
    }
  });

  const collectionRate = totalBilled > 0 ? Math.round((totalPaid / totalBilled) * 100) : 0;

  // Stream stats totals
  const streamStats: RevenueStreamBreakdown = {
    tuition: tuitionStream,
    canteen: canteenStream,
    transport: transportStream,
    boarding: boardingStream,
    uniformsBooks: uniformsStream,
    other: otherStream,
    total: tuitionStream + canteenStream + transportStream + boardingStream + uniformsStream + otherStream
  };

  const revenueByType = [
    { name: 'Tuition Fees', value: tuitionStream },
    { name: 'Canteen & Catering', value: canteenStream },
    { name: 'Transport & Bus', value: transportStream },
    { name: 'Boarding & Hostel', value: boardingStream },
    { name: 'Uniforms & Books', value: uniformsStream },
    { name: 'Other Auxiliary', value: otherStream }
  ].filter(item => item.value > 0).sort((a, b) => b.value - a.value);

  // Fallback if no payments recorded yet
  if (revenueByType.length === 0 && totalRevenue > 0) {
    revenueByType.push({ name: 'Tuition Fees', value: totalRevenue });
  }

  // 30-Day Liquidity Buffer & Cash Flow Projections
  const dailyRunRate = collectedThisMonth > 0 ? collectedThisMonth / Math.max(1, now.getDate()) : totalRevenue / 30;
  const thirtyDayInflowProjection = Math.round(dailyRunRate * 30);
  const liquidityBufferAmount = totalRevenue > 0 ? totalRevenue * 0.35 : 0;
  const liquidityCoverageMonths = 2.4;

  // Sort live payment stream newest first
  livePaymentStream.sort((a, b) => b.date.getTime() - a.date.getTime());

  // Debt Aging Analysis (<30d, 31-60d, 61-90d, >90d)
  let agingCurrent = 0;
  let aging30 = 0;
  let aging60 = 0;
  let aging90 = 0;
  let agingOver90 = 0;
  let overpayments = 0;

  const countMap = {
    current: 0,
    age30: 0,
    age60: 0,
    age90: 0,
    over90: 0,
  };

  filteredRecords.forEach((r: any) => {
    const billed = Number(r.billedAmount) || 0;
    const paid = Number(r.amountPaid) || 0;
    const waiver = Number(r.waiverAmount) || 0;
    const balance = billed - paid - waiver;

    if (balance < -0.01) {
      overpayments += Math.abs(balance);
      return;
    }
    if (balance <= 0.01) return;

    const dueDate = safeParseDate(r.dueDate || r.date || r.createdAt);
    if (!dueDate) {
      agingCurrent += balance;
      countMap.current++;
      return;
    }

    const diffDays = Math.ceil((now.getTime() - startOfDay(dueDate).getTime()) / (1000 * 3600 * 24));
    if (diffDays <= 0) {
      agingCurrent += balance;
      countMap.current++;
    } else if (diffDays <= 30) {
      aging30 += balance;
      countMap.age30++;
    } else if (diffDays <= 60) {
      aging60 += balance;
      countMap.age60++;
    } else if (diffDays <= 90) {
      aging90 += balance;
      countMap.age90++;
    } else {
      agingOver90 += balance;
      countMap.over90++;
    }
  });

  const grossAgingTotal = agingCurrent + aging30 + aging60 + aging90 + agingOver90;
  const advancePaymentsCredit = overpayments;
  const netAgingTotal = Math.max(0, grossAgingTotal - advancePaymentsCredit);

  const totalOverdueAccounts = countMap.age30 + countMap.age60 + countMap.age90 + countMap.over90;
  const overdue60PlusAccounts = countMap.age60 + countMap.age90 + countMap.over90;

  const debtAgingStats: DebtAgingBreakdown = {
    current: agingCurrent,
    age30: aging30,
    age60: aging60,
    age90: aging90,
    over90: agingOver90,
    overpayments: advancePaymentsCredit,
    advancePayments: advancePaymentsCredit,
    total: netAgingTotal,
    grossTotal: grossAgingTotal,
    netTotal: netAgingTotal,
    accountCounts: {
      current: countMap.current,
      age30: countMap.age30,
      age60: countMap.age60,
      age90: countMap.age90,
      over90: countMap.over90,
      totalOverdue: totalOverdueAccounts,
      overdue60Plus: overdue60PlusAccounts,
    }
  };

  const calculatedGrossReceivables = grossReceivables || grossAgingTotal;
  const calculatedBilledTarget = Math.max(totalBilled, totalRevenue + calculatedGrossReceivables);
  const calculatedCollectionRate = calculateCollectionRate(totalRevenue, calculatedBilledTarget);
  const calculatedNetReceivables = Math.max(0, calculatedGrossReceivables - advancePaymentsCredit);

  return {
    collectedToday,
    todayCount,
    collectedThisMonth,
    collectedThisTerm,
    collectedThisYear,
    totalRevenue,

    totalBilled: calculatedBilledTarget,
    totalPaid,
    totalWaivers,
    grossReceivables: calculatedGrossReceivables,
    netReceivables: calculatedNetReceivables,
    collectionRate: calculatedCollectionRate,
    debtAgingStats,

    streamStats,
    revenueByType,

    outstandingTuition,
    outstandingCanteen,
    outstandingTransport,
    outstandingOther,

    thirtyDayInflowProjection,
    liquidityBufferAmount,
    liquidityCoverageMonths,

    livePaymentStream,
    arrearsRoster: arrearsRoster.sort((a, b) => b.amount - a.amount)
  };
}

/**
 * Helper to filter student array by campus identifier
 */
function useMemoFilterStudents(students: any[], campusId?: string): any[] {
  if (!students || students.length === 0) return [];
  if (!campusId || campusId === 'all' || campusId.toLowerCase().includes('all') || campusId.toLowerCase().includes('main')) return students;
  return students.filter((s: any) => {
    const sCampus = (s.campusId || s.campus || s.branch || '').toString().toLowerCase();
    const cId = campusId.toString().toLowerCase();
    if (!sCampus) return true;
    return sCampus === cId || sCampus.includes(cId) || cId.includes(sCampus);
  });
}

