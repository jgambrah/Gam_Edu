'use server';
/**
 * @fileOverview An AI agent for generating writing challenges.
 */

import { ai } from '@/ai/genkit';
import { z } from 'zod';

const GenerateWritingChallengeInputSchema = z.object({
  topic: z.string().describe('The topic or theme for the writing challenge.'),
  challengeType: z.enum(['Creative Writing', 'Summarization', 'Essay']).describe('The type of writing challenge.'),
});

export type GenerateWritingChallengeInput = z.infer<typeof GenerateWritingChallengeInputSchema>;

const GenerateWritingChallengeOutputSchema = z.object({
    title: z.string().describe("A suitable title for the writing challenge."),
    prompt: z.string().describe("The detailed writing prompt for the student."),
    challengeType: z.enum(['Creative Writing', 'Summarization', 'Essay']),
});

export type GenerateWritingChallengeOutput = z.infer<typeof GenerateWritingChallengeOutputSchema>;

const generateWritingChallengePrompt = ai.definePrompt({
  name: 'generateWritingChallengePrompt',
  input: { schema: GenerateWritingChallengeInputSchema },
  output: { schema: GenerateWritingChallengeOutputSchema },
  prompt: `You are an expert English teacher creating an engaging writing challenge for your students.

Topic: {{{topic}}}
Challenge Type: {{{challengeType}}}

Based on the above, generate a suitable title and a detailed, creative prompt for the students to respond to. Ensure the prompt is clear and appropriate for the challenge type.`,
});

import { checkAndSpendCredits } from '@/app/actions/credits';

export async function generateWritingChallenge(
  input: GenerateWritingChallengeInput & { schoolId: string }
): Promise<{ success: boolean; data?: GenerateWritingChallengeOutput; error?: string }> {
  try {
    const creditResult = await checkAndSpendCredits(input.schoolId, 5);
    if (!creditResult.success) {
      return { success: false, error: creditResult.error || "Not enough AI credits to generate writing challenge." };
    }
    const { schoolId, ...promptInput } = input;
    const { output } = await generateWritingChallengePrompt(promptInput, { model: 'googleai/gemini-3-flash-preview' });
    return { success: true, data: output! };
  } catch (error: any) {
    console.error("Writing challenge generation error:", error);
    return { success: false, error: error.message || "Failed to generate writing challenge." };
  }
}
