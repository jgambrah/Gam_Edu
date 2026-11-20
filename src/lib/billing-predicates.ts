/**
 * Pure, directive-free billing eligibility predicates shared between client components,
 * client billing helpers (`src/lib/billing.ts`), and server-side billing (`src/lib/billing-server.ts`).
 *
 * IMPORTANT: Never add `'use client'` or Firebase SDK imports to this module so Next.js
 * server actions and route handlers can call these helpers directly at runtime.
 */

/** Single source of truth for whether a student should receive a daily Canteen invoice. */
export function shouldBillDailyCanteen(
  student: { usesCanteen?: boolean; canteenBillingMode?: string } | null | undefined,
): boolean {
  if (!student) return false;
  if (student.usesCanteen === false) return false;
  if (student.canteenBillingMode === 'Termly' || student.canteenBillingMode === 'None') return false;
  return student.canteenBillingMode === 'Daily' || !student.canteenBillingMode;
}

/** Single source of truth for whether a student should receive a daily Transport invoice. */
export function isDailyTransportSubscriber(
  student: { usesBusService?: boolean; transportBillingModel?: string } | null | undefined,
): boolean {
  if (!student) return false;
  return student.usesBusService === true && student.transportBillingModel === 'Daily';
}
