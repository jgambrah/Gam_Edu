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

export async function generateWritingChallenge(input: GenerateWritingChallengeInput): Promise<GenerateWritingChallengeOutput> {
  const { output } = await generateWritingChallengePrompt(input, { model: 'googleai/gemini-3-flash-preview' });
  return output!;
}
