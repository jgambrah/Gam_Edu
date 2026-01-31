'use client';

import { checkAndSpendCredits } from '@/app/actions/credits';

class SaasService {
  private currentSession: { schoolId: string | null; credits: number } = {
    schoolId: null,
    credits: 0,
  };

  /**
   * Initializes the service with data received from the parent application.
   * @param schoolId The ID of the school.
   * @param credits The current AI credit balance.
   */
  initialize(schoolId: string, credits: number) {
    this.currentSession.schoolId = schoolId;
    this.currentSession.credits = credits;
    console.log(`SAAS Service Initialized for Live Classroom: School ${schoolId}, Credits ${credits}`);
  }

  /**
   * Returns the current session information.
   */
  getSession() {
    return this.currentSession;
  }

  /**
   * Deducts credits by calling the server action.
   * @param cost The number of credits to deduct.
   * @param feature A description of the feature used.
   * @returns A boolean indicating if the deduction was successful.
   */
  async deductCredits(cost: number, feature: string): Promise<boolean> {
    if (!this.currentSession.schoolId) {
      console.error("Deduct Credits Failed: No School ID in session.");
      return false;
    }
    const result = await checkAndSpendCredits(this.currentSession.schoolId, cost);
    if (result.success) {
      // Keep the local credit count in sync
      this.currentSession.credits -= cost;
    }
    return result.success;
  }
}

// Export a singleton instance of the service
export const saasService = new SaasService();
