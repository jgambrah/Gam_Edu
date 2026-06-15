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
