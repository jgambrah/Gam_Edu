
'use server';

import { ai } from '@/ai/genkit';
import { z } from 'zod';
import { checkAndSpendCredits } from '@/app/actions/credits';

// Input: Array of anonymous student stats
const AnalysisInputSchema = z.object({
  schoolId: z.string(),
  classData: z.array(z.object({
    studentName: z.string(), // We send names so the AI can identify them in the report
    attendanceRate: z.number(),
    averageGrade: z.number(),
    missedAssessments: z.number(),
  }))
});

// Output: Structured Report
const AnalysisOutputSchema = z.object({
  atRiskStudents: z.array(z.object({
    studentName: z.string(),
    riskLevel: z.enum(['High', 'Medium']),
    reason: z.string(),
    intervention: z.string(),
  })),
  classTrends: z.string().describe("Summary of the correlation between attendance and grades"),
  teachingStrategy: z.string().describe("Specific advice for the teacher to improve results"),
});

export async function generateLearningInsights(input: { classData: any[], schoolId: string }) {
  try {
    // Note: The credit check is now done on the client-side *before* calling this.
    // However, keeping a server-side check is a good security practice.
    const creditResult = await checkAndSpendCredits(input.schoolId, 10);
    if (!creditResult.success) {
      return { success: false, error: creditResult.error };
    }

    const prompt = `
      Act as an Expert Educational Data Scientist.
      Analyze the following performance data for a class of students in Ghana.
      
      DATA PROVIDED:
      ${JSON.stringify(input.classData)}

      GOALS:
      1. Identify students who are "At-Risk". 
         - Look for Low Grades (<50%).
         - Look for Low Attendance (<80%).
         - Look for "Silent Strugglers" (High Attendance but Low Grades).
         - Look for "Disengaged" (High Grades but Low Attendance).
      2. Analyze the Class Trend. Is attendance correlating with grades?
      3. Suggest a Teaching Strategy to fix the specific weaknesses found.

      Return the result in strict JSON format.
    `;

    const { output } = await ai.generate({
      prompt: prompt,
      output: { schema: AnalysisOutputSchema },
    });

    const data = output;
    if (!data) throw new Error("No insight generated");

    return { success: true, data };
  } catch (error: any) {
    console.error("Analytics Error:", error);
    return { success: false, error: error.message };
  }
}
