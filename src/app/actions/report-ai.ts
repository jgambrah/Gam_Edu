
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
 * @param term - The current academic term (e.g., 'First Term', 'Third Term').
 */
export async function generateReportCommentAction(
  schoolId: string,
  studentName: string,
  average: number,
  role: 'Teacher' | 'Headmaster',
  term: string
) {
  if (!schoolId) return { success: false, error: "School ID missing" };

  // 1. Check Credits (Cost: 1 credit per comment)
  const creditRes = await checkAndSpendCredits(schoolId, 1);
  if (!creditRes.success) return { success: false, error: "Not enough AI credits." };

  try {
    let prompt = '';
    
    if (role === 'Teacher') {
        const tone = average >= 75 ? "proud and encouraging" : 
                     average >= 50 ? "supportive but urging more focus" : 
                     "constructive, focusing on the need for daily effort and participation";

        prompt = `
          You are a dedicated Class Teacher writing a final end-of-term report card comment for your student, ${studentName}, for the ${term}.
          Their overall academic average this term is ${average}%.
          
          TASK: Write a 2-sentence remark. 
          FOCUS: Comment on their daily classroom behavior, participation, and personal effort. 
          TONE: ${tone}, warm, and personal.
          
          Do NOT include placeholders like [School Name] or [Teacher Name]. Just output the comment text directly.
        `;
    } else if (role === 'Headmaster') {
        const tone = average >= 75 ? "congratulatory and commending their excellence" : 
                     average >= 50 ? "acknowledging satisfactory performance and urging them to strive for higher goals" : 
                     "formal, expressing concern over their academic standing and requesting a meeting with parents";

        // Only mention promotion if it is the Third Term
        const promotionContext = term.toLowerCase().includes("third") 
            ? (average >= 50 ? "You may mention that they are promoted to the next class." : "You may state they need to repeat the class due to poor performance.")
            : "Do NOT mention anything about promotion or moving to the next class, as this is not the end of the academic year.";

        prompt = `
          You are the authoritative Headmaster of a school writing a final end-of-term report card remark for a student named ${studentName} for the ${term}.
          Their overall academic average this term is ${average}%.
          
          TASK: Write a 1-to-2 sentence remark. 
          FOCUS: Comment on their overall academic standing and alignment with the school's standards of excellence. 
          ${promotionContext}
          TONE: ${tone}, professional, formal, and authoritative.
          
          Do NOT include placeholders like [School Name] or [Headmaster Name]. Just output the comment text directly.
        `;
    }

    const response = await ai.generate({
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
