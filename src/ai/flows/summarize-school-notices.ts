'use server';

/**
 * @fileOverview Summarizes school notices for parents, focusing on events and deadlines.
 *
 * - summarizeSchoolNotices - A function to summarize school announcements tailored for parents.
 * - SummarizeSchoolNoticesInput - The input type for the summarizeSchoolNotices function.
 * - SummarizeSchoolNoticesOutput - The return type for the summarizeSchoolNotices function.
 */

import { getAi } from '@/ai/genkit';
import { z } from 'genkit';

const SummarizeSchoolNoticesInputSchema = z.object({
  announcements: z
    .string()
    .describe('The full text of school-wide announcements.'),
});
export type SummarizeSchoolNoticesInput = z.infer<
  typeof SummarizeSchoolNoticesInputSchema
>;

const SummarizeSchoolNoticesOutputSchema = z.object({
  summary: z
    .string()
    .describe(
      'A concise summary of the school announcements, focused on events and deadlines relevant to parents.'
    ),
});
export type SummarizeSchoolNoticesOutput = z.infer<
  typeof SummarizeSchoolNoticesOutputSchema
>;

export async function summarizeSchoolNotices(
  input: SummarizeSchoolNoticesInput
): Promise<SummarizeSchoolNoticesOutput> {
  const ai = getAi();
  const prompt = ai.definePrompt({
    name: 'summarizeSchoolNoticesPrompt',
    input: {schema: SummarizeSchoolNoticesInputSchema},
    output: {schema: SummarizeSchoolNoticesOutputSchema},
    prompt: `You are an AI assistant tasked with summarizing school announcements for parents. Focus on extracting key information regarding upcoming events, important deadlines, and any actions required from parents. Exclude any information not directly relevant to parents. Keep the summary concise and easy to understand.

School Announcements: {{{announcements}}}`,
  });

  const { output } = await prompt(input);
  return output!;
}
