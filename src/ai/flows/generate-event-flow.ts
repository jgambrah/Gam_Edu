'use server';
/**
 * @fileOverview An AI agent for generating school calendar events from key points.
 */

import { getAi } from '@/ai/genkit';
import { z } from 'zod';

const GenerateEventInputSchema = z.object({
  keyPoints: z.string().describe('The key points or a short phrase describing the event.'),
});

export type GenerateEventInput = z.infer<typeof GenerateEventInputSchema>;

const GenerateEventOutputSchema = z.object({
    title: z.string().describe("A suitable, concise title for the calendar event."),
    description: z.string().describe("A brief, one or two-sentence description of the event."),
});

export type GenerateEventOutput = z.infer<typeof GenerateEventOutputSchema>;

export async function generateEvent(input: GenerateEventInput): Promise<GenerateEventOutput> {
  const ai = getAi();
  const prompt = ai.definePrompt({
    name: 'generateEventPrompt',
    input: { schema: GenerateEventInputSchema },
    output: { schema: GenerateEventOutputSchema },
    prompt: `You are a school administrator. Based on the following key points, create a calendar event with a clear title and a short description.

Key Points:
{{{keyPoints}}}

Instructions:
1.  Create a concise, clear title for the event.
2.  Write a brief, one-to-two-sentence description providing more context if necessary.`,
  });

  const { output } = await prompt(input);
  return output!;
}
