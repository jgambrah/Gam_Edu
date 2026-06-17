'use server';

import { ai } from '@/ai/genkit';
import { checkAndSpendCredits } from './credits';

/**
 * Server action to generate pedagogical insights based on student scores.
 * 
 * @param schoolId - The ID of the school for credit deduction.
 * @param className - The name of the class being analyzed.
 * @param subjectName - The name of the subject.
 * @param scoresData - Array of student names and their respective scores.
 * @param maxScore - The maximum possible score for the assessment.
 */
export async function generateClassInsightsAction(
  schoolId: string,
  className: string,
  subjectName: string,
  scoresData: { studentName: string; score: number | '' }[],
  maxScore: number
) {
  if (!schoolId) return { success: false, error: "School ID missing" };

  // 1. Check Credits (Cost: 5 credits per analysis)
  const creditRes = await checkAndSpendCredits(schoolId, 5);
  if (!creditRes.success) return { success: false, error: "Not enough AI credits to run analysis." };

  try {
    // 2. Prepare Data
    const validScores = scoresData.filter(s => typeof s.score === 'number');
    if (validScores.length === 0) return { success: false, error: "No valid scores to analyze." };

    const prompt = `
      You are an expert educational consultant. Analyze the following recent assessment scores for "${className}" in "${subjectName}" (Scored out of ${maxScore}).
      
      Scores:
      ${JSON.stringify(validScores)}
      
      Please provide a brief, 3-part report:
      1. Class Overview: A short summary of the general performance.
      2. Areas of Concern: Identify students who might need extra help (do not be overly harsh).
      3. Actionable Strategy: Suggest one specific, creative classroom activity or teaching method to help improve understanding of this subject based on these results.
      
      Format with clear headings and bullet points. Keep it encouraging and practical.
    `;

    // 3. Call AI using Genkit 1.x syntax
    const response = await ai.generate({
      model: 'googleai/gemini-3-flash-preview',
      prompt: prompt,
      config: { temperature: 0.4 }
    });

    const text = response.text;
    
    if (!text) {
        throw new Error("AI Service returned an empty response.");
    }

    return { success: true, text: text.trim() };
  } catch (e: any) {
    console.error("AI Insights Error:", e);
    return { success: false, error: `AI Error: ${e.message || "Could not generate insights."}` };
  }
}

/**
 * Server action to generate operational budget and variance analysis reports.
 */
export async function generateBudgetInsightsAction(
  schoolId: string,
  budgetName: string,
  fiscalYear: string,
  term: string,
  budgetItemsData: { accountCode: string; accountName: string; accountType: 'Revenue' | 'Expense'; budgetedAmount: number; actual: number; variance: number; percent: number }[]
) {
  if (!schoolId) return { success: false, error: "School ID missing" };

  // 1. Check Credits (Cost: 5 credits per analysis)
  const creditRes = await checkAndSpendCredits(schoolId, 5);
  if (!creditRes.success) return { success: false, error: "Not enough AI credits to run analysis." };

  try {
    const prompt = `
      You are an expert school financial consultant. Analyze the following budget performance and variance analysis data for "${budgetName}" (${term}, Fiscal Year ${fiscalYear}).
      
      Variance Data:
      ${JSON.stringify(budgetItemsData)}
      
      Please provide a brief, professional financial analysis report containing:
      1. General Performance Summary: Overall evaluation of revenues and expenses.
      2. Significant Variances (Revenue & Expense): Highlight the key areas where the school is significantly under/over budget (favorable or unfavorable).
      3. Actionable Financial Advice: Suggest 2-3 specific recommendations for adjusting spending, maximizing collection of fees, or optimizing resources for the next period.
      
      Format with clear headings, bold text, and bullet points. Keep it professional, constructive, and practical.
    `;

    const response = await ai.generate({
      model: 'googleai/gemini-3-flash-preview',
      prompt: prompt,
      config: { temperature: 0.4 }
    });

    const text = response.text;
    
    if (!text) {
        throw new Error("AI Service returned an empty response.");
    }

    return { success: true, text: text.trim() };
  } catch (e: any) {
    console.error("AI Budget Insights Error:", e);
    return { success: false, error: `AI Error: ${e.message || "Could not generate insights."}` };
  }
}

/**
 * Server action to generate an AI staff appraisal draft based on metrics.
 */
export async function generateStaffAppraisalAction(
  schoolId: string,
  staffName: string,
  metrics: { teaching: number; punctuality: number; engagement: number; professionalism: number; }
) {
  if (!schoolId) return { success: false, error: "School ID missing" };

  const creditRes = await checkAndSpendCredits(schoolId, 5);
  if (!creditRes.success) return { success: false, error: "Not enough AI credits to run analysis." };

  try {
    const prompt = `
      You are an expert HR consultant specializing in school staff evaluations. 
      Draft a professional performance appraisal review for the staff member "${staffName}".
      
      Performance Scores (scored 1 to 5, where 5 is outstanding):
      - Teaching Quality / Core Job Execution: ${metrics.teaching}/5
      - Punctuality & Attendance: ${metrics.punctuality}/5
      - Student & Team Engagement: ${metrics.engagement}/5
      - Professionalism & Behavior: ${metrics.professionalism}/5
      
      Based on these metrics, write a concise appraisal draft consisting of:
      1. Strengths: Highlight 2 specific positive traits or key performance points aligned with these scores.
      2. Areas for Improvement: Identify 1-2 growth opportunities that could help this employee progress.
      3. Actionable Goals: Suggest 1-2 practical, professional development goals for the upcoming semester.
      
      Provide the output as a clean, structured JSON object with key fields:
      - strengths: string
      - improvements: string
      - goals: string
      
      Output ONLY the raw JSON object, no markdown code block wrapper, no surrounding text.
    `;

    const response = await ai.generate({
      model: 'googleai/gemini-3-flash-preview',
      prompt: prompt,
      config: { 
        temperature: 0.5,
        responseMimeType: 'application/json'
      }
    });

    const text = response.text;
    if (!text) {
        throw new Error("AI Service returned empty.");
    }

    const data = JSON.parse(text.trim());
    return { success: true, data };
  } catch (e: any) {
    console.error("AI Staff Appraisal Error:", e);
    return { success: false, error: e.message || "Failed to generate AI appraisal draft." };
  }
}

/**
 * Server action to generate an AI Executive Briefing / Health Audit for the Director.
 */
export async function generateSchoolExecutiveBriefingAction(
  schoolId: string,
  schoolName: string,
  stats: {
    totalStudents: number;
    attendanceRateToday: number;
    totalStaff: number;
    financials: {
      totalOutstanding: number;
      totalRevenue: number;
      collectionRate: number;
      revenueByType: { name: string; value: number }[];
    };
    classSizes: { name: string; students: number }[];
    announcementsCount: number;
  }
) {
  if (!schoolId) return { success: false, error: "School ID missing" };

  // Cost: 5 credits per executive briefing analysis
  const creditRes = await checkAndSpendCredits(schoolId, 5);
  if (!creditRes.success) return { success: false, error: "Not enough AI credits to run the executive briefing." };

  try {
    const prompt = `
      You are an elite educational executive advisor and school auditor. Analyze the following live health metrics for "${schoolName}".
      
      Metrics Dashboard Data:
      ${JSON.stringify(stats, null, 2)}
      
      Please write a high-impact executive school briefing for the Executive Director:
      1. EXECUTIVE SUMMARY: Provide a concise (2-3 sentences) health check of the institution's operations, academic balance, and financial stability.
      2. RISK & CAUTIONS: Identify 2-3 specific risks based on these numbers (e.g., high outstanding student debt, low collection rate, class size imbalance, low attendance rate, or low communication metrics).
      3. ACTIONABLE PATHWAYS: Provide 3 strategic, high-value steps for the Director to optimize revenue collection, balance academic workloads, and improve general operations.
      
      Format with clear markdown titles (bold H3/H4 tags), clean spacing, and bullet points. Make it look like a premium McKinsey or Silicon Valley consulting brief. Do not mention "Credits" or technical AI features.
    `;

    const response = await ai.generate({
      model: 'googleai/gemini-3-flash-preview',
      prompt: prompt,
      config: { temperature: 0.4 }
    });

    const text = response.text;
    if (!text) {
      throw new Error("AI Service returned an empty response.");
    }

    return { success: true, text: text.trim() };
  } catch (e: any) {
    console.error("AI School Executive Briefing Error:", e);
    return { success: false, error: e.message || "Failed to generate AI executive briefing." };
  }
}


