
'use server';
/**
 * @fileOverview An AI agent for generating lesson plan ideas.
 */

import { getAi } from '@/ai/genkit';
import { z } from 'zod';

const GenerateLessonIdeasInputSchema = z.object({
  topic: z.string().describe('The topic for the lesson plan.'),
});

export type GenerateLessonIdeasInput = z.infer<typeof GenerateLessonIdeasInputSchema>;

const GenerateLessonIdeasOutputSchema = z.object({
    objectives: z.string().describe("Bulleted list of learning objectives for the lesson."),
    activities: z.string().describe("Bulleted list of engaging activities for the lesson."),
    materials: z.string().describe("Bulleted list of materials and resources needed for the lesson."),
});

export type GenerateLessonIdeasOutput = z.infer<typeof GenerateLessonIdeasOutputSchema>;


export async function generateLessonIdeas(input: GenerateLessonIdeasInput): Promise<GenerateLessonIdeasOutput> {
  const ai = getAi();
  const prompt = ai.definePrompt({
    name: 'generateLessonIdeasPrompt',
    input: { schema: GenerateLessonIdeasInputSchema },
    output: { schema: GenerateLessonIdeasOutputSchema },
    prompt: `You are an expert curriculum designer for K-12 education. A teacher needs help creating a lesson plan for the following topic: {{{topic}}}.

Generate a list of ideas for each of the following sections:
- **Learning Objectives**: What should students be able to do by the end of the lesson? (Start with action verbs).
- **Activities & Tasks**: What engaging activities can the students perform to learn the material?
- **Materials & Resources**: What materials will be needed for these activities?

Format each section as a bulleted list.`,
  });

  const { output } = await prompt(input, { model: 'googleai/gemini-3-flash-preview' });
  return output!;
}
