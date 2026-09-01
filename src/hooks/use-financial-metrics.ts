'use client';

import { useMemo } from 'react';
import {
  computeFinancialMetrics,
  FinancialMetricsFilterOptions,
  FinancialMetricsResult,
} from '@/lib/financial-analytics';

/**
 * useFinancialMetrics
 * Unified custom hook for calculating financial metrics, revenue streams,
 * receivables aging, and cash flow telemetry across GAM Edu dashboards.
 */
export function useFinancialMetrics(
  options: FinancialMetricsFilterOptions
): FinancialMetricsResult {
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
    return computeFinancialMetrics({
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
