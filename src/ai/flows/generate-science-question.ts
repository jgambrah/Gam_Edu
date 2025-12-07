
'use server';

import { generate } from '@genkit-ai/ai';
import { gemini15Flash } from '@genkit-ai/google-genai';
import { z } from 'zod';

// 1. Define Schema for ONE question
const SingleQuestionSchema = z.object({
  question: z.string().describe("The science question text"),
  options: z.array(z.string()).length(4).describe("4 possible answers"),
  correctAnswer: z.string().describe("The correct answer (must match one option exactly)"),
  topic: z.string().describe("The specific sub-topic"),
  difficulty: z.enum(['Beginner', 'Intermediate', 'Advanced']),
});

// 2. Define Output Schema (Array of questions)
const OutputSchema = z.object({
  questions: z.array(SingleQuestionSchema),
});

// 3. The Action
export async function generateScienceQuestionAction(input: { 
  topic: string; 
  difficulty: string; 
  grade: string; 
  count: number; 
}) {
  try {
    const prompt = `
      Generate ${input.count} unique ${input.difficulty} level multiple-choice science questions about "${input.topic}".
      Target Audience: Students in ${input.grade}.
      Ensure the language is appropriate for this grade level.
      Ensure the correct answer is included in the options.
      Output strictly JSON.
    `;

    const response = await generate({
      model: gemini15Flash,
      prompt: prompt,
      output: { schema: OutputSchema },
    });

    const data = response.output();
    
    if (!data || !data.questions) {
        throw new Error("AI returned invalid data structure");
    }
    
    return { success: true, data: data.questions }; 
  } catch (error: any) {
    console.error("AI Generation Error:", error);
    return { success: false, error: error.message };
  }
}
