
'use server';

import { ai } from '@/ai/genkit';
import { z } from 'zod';

// --- 1. TEACHER TOOL: Generate Live Poll ---
const PollSchema = z.object({
  question: z.string(),
  options: z.array(z.string()).length(4),
  correctOption: z.string(),
});

export async function generateLivePollAction(topic: string) {
  try {
    const prompt = `
      Create a quick, engaging multiple-choice poll question to check student understanding on the topic: "${topic}".
      Target audience: Junior High Students.
      Output strictly JSON.
    `;

    const { output } = await ai.generate({
      prompt: prompt,
      output: { schema: PollSchema },
    });

    if (!output) throw new Error("No data returned");
    return { success: true, data: output };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

// --- 2. STUDENT TOOL: Private Explainer ---
const ExplanationSchema = z.object({
  definition: z.string(),
  analogy: z.string(),
});

export async function explainConceptAction(concept: string) {
  try {
    const prompt = `
      A student is confused about the term "${concept}" during a live lecture.
      1. Define it simply (1 sentence).
      2. Give a relatable real-world analogy.
      Output strictly JSON.
    `;

    const { output } = await ai.generate({
      prompt: prompt,
      output: { schema: ExplanationSchema },
    });

    if (!output) throw new Error("No data returned");
    return { success: true, data: output };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}
