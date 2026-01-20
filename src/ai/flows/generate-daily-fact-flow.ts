
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

export async function generateDailyFact(): Promise<GenerateDailyFactOutput> {
  return generateDailyFactFlow();
}

const prompt = ai.definePrompt({
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

const generateDailyFactFlow = ai.defineFlow(
  {
    name: 'generateDailyFactFlow',
    outputSchema: GenerateDailyFactOutputSchema,
  },
  async () => {
    const { output } = await prompt(undefined, { model: 'googleai/gemini-pro' });
    return output!;
  }
);
