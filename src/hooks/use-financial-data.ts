'use client';

import { useMemo } from 'react';
import {
  computeFinancialMetrics,
  FinancialMetricsFilterOptions,
  FinancialMetricsResult,
} from '@/lib/financial-analytics';
import { FinancialSummary, calculateCollectionRate } from '@/lib/financials';

export interface UseFinancialDataOptions extends FinancialMetricsFilterOptions {
  campusId?: string;
  academicYear?: string;
  termId?: string;
}

export interface UseFinancialDataResult {
  summary: FinancialSummary;
  metrics: FinancialMetricsResult;
}

/**
 * useFinancialData
 * Centralized custom React hook binding Executive Overview and Financial Audit view
 * to a unified single source of truth (SSOT).
 */
export function useFinancialData(options: UseFinancialDataOptions): UseFinancialDataResult {
  const {
    financialRecords = [],
    payments = [],
    students = [],
    classes = [],
    budgets = [],
    campusId,
    termId,
    academicYear,
    arrearsThreshold = 0,
  } = options;

  return useMemo(() => {
    const metrics = computeFinancialMetrics({
      financialRecords,
      payments,
      students,
      classes,
      budgets,
      campusId,
      termId,
      academicYear,
      arrearsThreshold,
    });

    const summary: FinancialSummary = {
      billedTarget: metrics.totalBilled,
      totalCollected: metrics.totalRevenue,
      collectionRate: metrics.collectionRate,
      streamBreakdown: {
        tuition: metrics.streamStats.tuition,
        canteen: metrics.streamStats.canteen,
        transport: metrics.streamStats.transport,
        auxiliary: metrics.streamStats.boarding + metrics.streamStats.uniformsBooks + metrics.streamStats.other,
      },
      grossReceivables: metrics.grossReceivables,
      advanceCredits: metrics.debtAgingStats.advancePayments,
      netReceivables: metrics.netReceivables,
      aging: {
        current: {
          amount: metrics.debtAgingStats.current,
          count: metrics.debtAgingStats.accountCounts.current,
        },
        days30: {
          amount: metrics.debtAgingStats.age30,
          count: metrics.debtAgingStats.accountCounts.age30,
        },
        days60: {
          amount: metrics.debtAgingStats.age60,
          count: metrics.debtAgingStats.accountCounts.age60,
        },
        days90Plus: {
          amount: metrics.debtAgingStats.age90 + metrics.debtAgingStats.over90,
          count: metrics.debtAgingStats.accountCounts.age90 + metrics.debtAgingStats.accountCounts.over90,
        },
      },
    };

    return { summary, metrics };
  }, [
    financialRecords,
    payments,
    students,
    classes,
    budgets,
    campusId,
    termId,
    academicYear,
    arrearsThreshold,
  ]);
}
