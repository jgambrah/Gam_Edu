
'use server';

import { ai } from '@/ai/genkit';
import { checkAndSpendCredits } from './credits';

/**
 * Server action to generate a professional report card comment using AI.
 * 
 * @param schoolId - The ID of the school for credit deduction.
 * @param studentName - The name of the student.
 * @param average - The student's overall academic average percentage.
 * @param role - The role of the person for whom the comment is being written.
 */
export async function generateReportCommentAction(
  schoolId: string,
  studentName: string,
  average: number,
  role: 'Teacher' | 'Headmaster'
) {
  if (!schoolId) return { success: false, error: "School ID missing" };

  // 1. Check Credits (Cost: 1 credit per comment)
  const creditRes = await checkAndSpendCredits(schoolId, 1);
  if (!creditRes.success) return { success: false, error: "Not enough AI credits." };

  try {
    const tone = average >= 75 ? "praising and encouraging" : 
                 average >= 50 ? "positive but noting room for improvement" : 
                 "constructive, focusing on the need for more effort and support";

    const prompt = `
      You are a ${role} writing a final end-of-term report card comment for a student named ${studentName}.
      Their overall academic average this term is ${average}%.
      
      Task: Write a professional, ${tone}, 2-sentence remark. 
      Do NOT include placeholders like [School Name] or [Teacher Name]. 
      Just output the comment text directly.
    `;

    const response = await ai.generate({
      // Using gemini-3-flash-preview as it's the consistent stable model in this project
      model: 'googleai/gemini-3-flash-preview', 
      prompt: prompt,
      config: { temperature: 0.7 }
    });

    const text = response.text;
    
    if (!text) {
        throw new Error("AI Service returned an empty response.");
    }

    return { success: true, text: text.trim() };
  } catch (e: any) {
    console.error("AI Comment Error:", e);
    return { success: false, error: `AI Error: ${e.message || "Could not generate comment."}` };
  }
}
