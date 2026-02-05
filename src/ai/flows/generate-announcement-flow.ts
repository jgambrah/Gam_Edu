'use server';
/**
 * @fileOverview An AI agent for generating school announcements.
 */

import { ai } from '@/ai/genkit';
import { z } from 'zod';

const GenerateAnnouncementInputSchema = z.object({
  keyPoints: z.string().describe('The key points or notes for the announcement.'),
});

export type GenerateAnnouncementInput = z.infer<typeof GenerateAnnouncementInputSchema>;

const GenerateAnnouncementOutputSchema = z.object({
    title: z.string().describe("A suitable, concise title for the announcement."),
    content: z.string().describe("The full, well-written content of the announcement, formatted for clarity."),
});

export type GenerateAnnouncementOutput = z.infer<typeof GenerateAnnouncementOutputSchema>;

const generateAnnouncementPrompt = ai.definePrompt({
  name: 'generateAnnouncementPrompt',
  input: { schema: GenerateAnnouncementInputSchema },
  output: { schema: GenerateAnnouncementOutputSchema },
  prompt: `You are a professional school administrator. Your task is to write a clear, professional, and friendly announcement for the school community based on the provided key points.

Key Points:
{{{keyPoints}}}

Instructions:
1.  Create a concise, informative title.
2.  Write the full announcement content.
3.  Ensure the tone is appropriate for a school setting (parents, students, and staff).
4.  Format the announcement with paragraphs for readability.
5.  Do not add any preamble like "Here is the announcement". Just provide the title and content.`,
});

export async function generateAnnouncement(input: GenerateAnnouncementInput): Promise<GenerateAnnouncementOutput> {
  const { output } = await generateAnnouncementPrompt(input, { model: 'googleai/gemini-3-flash-preview' });
  return output!;
}
