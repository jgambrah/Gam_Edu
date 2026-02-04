
'use server';

import { getAi } from '@/ai/genkit';
import { z } from 'zod';
import { checkAndSpendCredits } from '@/app/actions/credits';

const ElaLessonSchema = z.object({
  title: z.string().describe("A catchy title for the ELA lesson"),
  explanation: z.string().describe("A clear, grade-appropriate explanation of the concept (approx 100 words)."),
  example: z.string().describe("A clear sentence or short paragraph demonstrating the concept (e.g. 'The cat, which was fluffy, sat on the mat.' for appositives)."),
  keyTerms: z.array(z.string()).describe("3 key literary or grammatical terms used in this lesson."),
  quizQuestion: z.string().describe("A simple question to check understanding."),
  quizAnswer: z.string().describe("The answer to the check question."),
});

export type GeneratedElaLesson = z.infer<typeof ElaLessonSchema>;

export async function generateElaLessonAction(input: { topic: string, grade: string, schoolId: string }): Promise<{ success: boolean; data?: GeneratedElaLesson, error?: string }> {
  const ai = getAi();
  try {
    const creditResult = await checkAndSpendCredits(input.schoolId, 3);
    if (!creditResult.success) {
      return { success: false, error: "Not enough AI credits to generate this lesson." };
    }

    const prompt = `
      You are an expert English Language Arts (ELA) tutor. Create a micro-lesson for a student in ${input.grade}.
      Topic: "${input.topic}".
      
      1. Explain the grammatical or literary concept simply but accurately.
      2. Provide a clear, practical example sentence or two.
      3. Highlight 3 key terms.
      4. Provide 1 self-check question with an answer.
      
      Output strictly JSON.
    `;

    const { output } = await ai.generate({
      model: 'googleai/gemini-3-flash-preview',
      prompt: prompt,
      output: { schema: ElaLessonSchema },
    });

    const data = output;
    if (!data) throw new Error("No data returned from AI.");
    
    return { success: true, data };
  } catch (error: any) {
    console.error("AI ELA Lesson Generation Error:", error);
    return { success: false, error: error.message };
  }
}
