
'use server';

import { ai } from '@/ai/genkit';
import { z } from 'zod';
import { checkAndSpendCredits } from '@/app/actions/credits';

const LessonSchema = z.object({
  title: z.string().describe("A catchy title for the lesson"),
  explanation: z.string().describe("A clear, grade-appropriate explanation of the concept (approx 100 words)."),
  analogy: z.string().describe("A real-world analogy to help understand the concept (e.g. 'The heart is like a pump')."),
  keyTerms: z.array(z.string()).describe("3 key scientific terms used in this lesson."),
  quizQuestion: z.string().describe("A simple question to check understanding."),
  quizAnswer: z.string().describe("The answer to the check question."),
});

export type GeneratedLesson = z.infer<typeof LessonSchema>;

export async function generateScienceLessonAction(input: { topic: string, grade: string, schoolId: string }): Promise<{ success: boolean; data?: GeneratedLesson, error?: string }> {
  try {
    const creditResult = await checkAndSpendCredits(input.schoolId, 3);
    if (!creditResult.success) {
      return { success: false, error: "Not enough AI credits to generate this lesson." };
    }

    const prompt = `
      You are an expert science tutor. Create a micro-lesson for a student in ${input.grade}.
      Topic: "${input.topic}".
      
      1. Explain it simply but accurately.
      2. Use a creative analogy.
      3. Highlight 3 key terms.
      4. Provide 1 self-check question.
      
      Output strictly JSON.
    `;

    const { output } = await ai.generate({
      model: 'googleai/gemini-2.5-flash',
      prompt: prompt,
      output: { schema: LessonSchema },
    });

    const data = output;
    if (!data) throw new Error("No data returned from AI.");
    
    return { success: true, data };
  } catch (error: any) {
    console.error("AI Lesson Generation Error:", error);
    return { success: false, error: error.message };
  }
}
