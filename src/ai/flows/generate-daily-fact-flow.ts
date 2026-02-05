
'use server';
/**
 * @fileOverview An AI agent for generating a daily science fact.
 */

import { ai } from '@/ai/genkit';
import { z } from 'zod';

const GenerateDailyFactOutputSchema = z.object({
  fact: z.string().describe("A fascinating and concise science fact suitable for a school science club. It should be easily understandable by students."),
});

export type GenerateDailyFactOutput = z.infer<typeof GenerateDailyFactOutputSchema>;

const generateDailyFactPrompt = ai.definePrompt({
  name: 'generateDailyFactPrompt',
  output: { schema: GenerateDailyFactOutputSchema },
  prompt: `Generate a single, fascinating, and concise science fact suitable for a school science club. 
  The fact should be interesting, easily understandable, and verifiable. 
  Do not add any preamble or extra text, just the fact itself.
  
  Example format:
  {
    "fact": "A single bolt of lightning contains enough energy to cook 100,000 pieces of toast."
  }
  `,
});

export async function generateDailyFact(): Promise<GenerateDailyFactOutput> {
  const { output } = await generateDailyFactPrompt(undefined, { model: 'googleai/gemini-3-flash-preview' });
  return output!;
}
