
'use server';

import { ai } from '@/ai/genkit';
import { z } from 'zod';

// 1. Define the Schema for a Single Question
const SingleQuestionSchema = z.object({
  question: z.string().describe("The science question text"),
  options: z.array(z.string()).length(4).describe("4 possible answers"),
  correctAnswer: z.string().describe("The correct answer (must match one of the options exactly)"),
  topic: z.string().describe("The specific sub-topic"),
  difficulty: z.enum(['Beginner', 'Intermediate', 'Advanced']),
});

// 2. Define the Output Schema (A list of questions)
const OutputSchema = z.object({
  questions: z.array(SingleQuestionSchema),
});


// 3. The Action
export async function generateScienceQuestionAction(input: { 
  topic: string; 
  difficulty: string; 
  count: number; // <--- New Input
}) {
  try {
    const prompt = `
      Generate ${input.count} unique ${input.difficulty} level multiple-choice science questions about "${input.topic}".
      Target audience: Junior High School students.
      Ensure the correct answer is included in the options.
    `;

    const { output } = await ai.generate({
      model: 'googleai/gemini-2.5-flash',
      prompt: prompt,
      output: { schema: OutputSchema },
    });

    if (!output || !output.questions) {
        throw new Error("AI returned invalid data structure");
    }
    
    return { success: true, data: output.questions }; // Return the array directly
  } catch (error: any) {
    console.error("AI Generation Error:", error);
    return { success: false, error: error.message };
  }
}
