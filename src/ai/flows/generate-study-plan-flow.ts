
'use server';
/**
 * @fileOverview An AI agent for generating a personalized study plan.
 */

import { ai } from '@/ai/genkit';
import { z } from 'zod';

const EventSchema = z.object({
  title: z.string(),
  type: z.enum(['Assignment', 'Live Lecture', 'Event']),
  date: z.string().describe("The date of the event in ISO format (e.g., '2024-10-27T10:00:00.000Z')."),
});

const FocusBlockSchema = z.object({
    title: z.string().describe("The suggested study topic, e.g., 'Review algebra for Math test'."),
    startTime: z.string().describe("The suggested start time in ISO format."),
    endTime: z.string().describe("The suggested end time in ISO format."),
    type: z.literal('Focus Block').default('Focus Block'),
});

const GenerateStudyPlanInputSchema = z.object({
  events: z.array(EventSchema).describe('A list of existing assignments, lectures, and events.'),
  startDate: z.string().describe("The start date for the plan in ISO format."),
  endDate: z.string().describe("The end date for the plan in ISO format."),
});

export type GenerateStudyPlanInput = z.infer<typeof GenerateStudyPlanInputSchema>;

const GenerateStudyPlanOutputSchema = z.object({
  focusBlocks: z.array(FocusBlockSchema).describe('An array of generated study blocks.'),
});

export type GenerateStudyPlanOutput = z.infer<typeof GenerateStudyPlanOutputSchema>;


export async function generateStudyPlan(input: GenerateStudyPlanInput): Promise<GenerateStudyPlanOutput> {
  return generateStudyPlanFlow(input);
}


const prompt = ai.definePrompt({
  name: 'generateStudyPlanPrompt',
  input: { schema: GenerateStudyPlanInputSchema },
  output: { schema: GenerateStudyPlanOutputSchema },
  prompt: `You are an expert academic advisor. Your task is to create a study plan for a student based on their existing schedule.

RULES:
1.  Analyze the list of events provided: {{{json events}}}.
2.  The plan should cover the period from {{{startDate}}} to {{{endDate}}}.
3.  Identify deadlines for 'Assignment' type events. These are the top priority.
4.  Schedule 1-hour "Focus Block" sessions to prepare for each assignment.
5.  Schedule these blocks in empty time slots, avoiding conflicts with existing 'Live Lecture' or 'Event' times.
6.  Prioritize placing study blocks 1-2 days before an assignment is due.
7.  Do not schedule study blocks on weekends if possible.
8.  The title of the focus block should clearly state what to study, e.g., "Prepare for 'Biology Paper'".
9.  Return a list of only the new "Focus Block" events.`,
});

const generateStudyPlanFlow = ai.defineFlow(
  {
    name: 'generateStudyPlanFlow',
    inputSchema: GenerateStudyPlanInputSchema,
    outputSchema: GenerateStudyPlanOutputSchema,
  },
  async (input) => {
    const { output } = await prompt(input);
    return output!;
  }
);
