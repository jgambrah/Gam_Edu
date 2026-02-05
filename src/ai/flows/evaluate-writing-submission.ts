
'use server';

import { ai } from '@/ai/genkit';
import { z } from 'zod';
import { checkAndSpendCredits } from '@/app/actions/credits';

// Define Input
interface WritingInput {
  prompt: string;
  studentText: string;
  type: string; // e.g., 'Creative Writing', 'Essay'
  schoolId: string;
}

// Define Output Schema (Structured Feedback)
const WritingFeedbackSchema = z.object({
  score: z.number().describe("Score out of 100 based on grammar, relevance, and creativity"),
  summary: z.string().describe("A brief, encouraging summary of the writing"),
  strengths: z.array(z.string()).describe("List of 2-3 things the student did well"),
  improvements: z.array(z.string()).describe("List of 2-3 specific things to improve (grammar, flow, vocab)"),
  exampleRewrite: z.string().describe("Rewrite one sentence from their text to show how to make it stronger"),
});

export async function evaluateWritingAction(input: WritingInput) {
  try {
    const creditResult = await checkAndSpendCredits(input.schoolId, 5);
    if (!creditResult.success) {
      return { success: false, error: "Not enough AI credits to grade submission." };
    }

    const prompt = `
      You are an expert English Teacher. Evaluate the following student writing submission.

      ASSIGNMENT TYPE: ${input.type}
      PROMPT: "${input.prompt}"
      
      STUDENT SUBMISSION:
      "${input.studentText}"

      GRADING CRITERIA:
      1. Relevance: Did they answer the prompt?
      2. Grammar & Spelling: Are there errors?
      3. Structure: Is it organized well?
      4. Creativity/Voice: Is it engaging?

      Provide a fair score (0-100) and constructive feedback suitable for a Junior High student.
    `;

    const { output } = await ai.generate({
      model: 'googleai/gemini-3-flash-preview',
      prompt: prompt,
      output: { schema: WritingFeedbackSchema },
    });

    const data = output;
    if (!data) throw new Error("No evaluation returned");

    return { success: true, data };

  } catch (error: any) {
    console.error("Writing AI Error:", error);
    return { success: false, error: error.message };
  }
}
