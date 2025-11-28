'use server';

import { ai } from '@/ai/genkit';
import { z } from 'zod';

// Define the structure we want the AI to return
const QuestionSchema = z.object({
  question: z.string().describe("The science question text"),
  options: z.array(z.string()).length(4).describe("4 possible answers"),
  correctAnswer: z.string().describe("The correct answer (must match one of the options exactly)"),
  topic: z.string().describe("The specific sub-topic (e.g. Photosynthesis)"),
  difficulty: z.enum(['Beginner', 'Intermediate', 'Advanced']),
});

export async function generateScienceQuestionAction(input: { topic: string, difficulty: string }) {
  try {
    const prompt = `
      Generate a ${input.difficulty} level science question about "${input.topic}".
      Target audience: Junior High School students.
      Return strictly JSON format.
    `;

    const { output } = await ai.generate({
      prompt: prompt,
      model: 'googleai/gemini-1.5-flash',
      output: { schema: QuestionSchema },
    });
    
    if (!output) throw new Error("No data returned from AI model");
    
    return { success: true, data: output };
  } catch (error: any) {
    console.error("AI Generation Error:", error);
    return { success: false, error: error.message };
  }
}
