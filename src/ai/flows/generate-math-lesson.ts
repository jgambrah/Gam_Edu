'use server';

import { ai } from '@/ai/genkit';
import { z } from 'zod';
import { checkAndSpendCredits } from '@/app/actions/credits';

const MathLessonSchema = z.object({
  title: z.string().describe("A catchy title for the math lesson"),
  explanation: z.string().describe("A clear, grade-appropriate explanation of the concept (approx 100 words)."),
  example: z.string().describe("A real-world or numerical example to help understand the concept (e.g. 'If you have 3 apples and get 2 more...')."),
  keyTerms: z.array(z.string()).describe("3 key mathematical terms or formulas used in this lesson."),
  quizQuestion: z.string().describe("A simple question to check understanding."),
  quizAnswer: z.string().describe("The answer to the check question."),
});

export type GeneratedMathLesson = z.infer<typeof MathLessonSchema>;

export async function generateMathLessonAction(input: { topic: string, grade: string, schoolId: string }): Promise<{ success: boolean; data?: GeneratedMathLesson, error?: string }> {
  try {
    const creditResult = await checkAndSpendCredits(input.schoolId, 3);
    if (!creditResult.success) {
      return { success: false, error: "Not enough AI credits to generate this lesson." };
    }

    const prompt = `
      You are an expert math tutor. Create a micro-lesson for a student in ${input.grade}.
      Topic: "${input.topic}".
      
      1. Explain the concept simply but accurately.
      2. Provide a clear, practical example.
      3. Highlight 3 key terms or formulas.
      4. Provide 1 self-check question with an answer.
      
      Output strictly JSON.
    `;

    const { output } = await ai.generate({
      model: 'googleai/gemini-2.5-flash',
      prompt: prompt,
      output: { schema: MathLessonSchema },
    });

    const data = output;
    if (!data) throw new Error("No data returned from AI.");
    
    return { success: true, data };
  } catch (error: any) {
    console.error("AI Math Lesson Generation Error:", error);
    return { success: false, error: error.message };
  }
}
