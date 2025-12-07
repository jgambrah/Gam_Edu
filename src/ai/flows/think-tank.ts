'use server';

/**
 * @fileOverview AI logic for "The Think Tank" module, providing critical thinking challenges.
 *
 * - generateDailyParadox: Creates a daily logic puzzle or paradox.
 * - runDebateTurn: Powers an AI debate partner.
 */

import { ai } from '@/ai/genkit';
import { z } from 'zod';

// --- 1. Daily Paradox Generation ---

const GenerateParadoxInputSchema = z.object({
  grade: z.string().describe("The target grade level for the puzzle (e.g., 'Grade 9')."),
});
export type GenerateParadoxInput = z.infer<typeof GenerateParadoxInputSchema>;

const GenerateParadoxOutputSchema = z.object({
  question: z.string().describe('The logic puzzle or riddle question.'),
  answer: z.string().describe('The solution to the puzzle.'),
  explanation: z.string().describe('A brief explanation of the logic behind the solution.'),
  difficulty: z.string().describe('The assessed difficulty (e.g., "Easy", "Medium", "Hard").'),
});
export type GenerateParadoxOutput = z.infer<typeof GenerateParadoxOutputSchema>;


const paradoxPrompt = ai.definePrompt({
    name: 'generateDailyParadoxPrompt',
    input: { schema: GenerateParadoxInputSchema },
    output: { schema: GenerateParadoxOutputSchema },
    prompt: `Generate a logic puzzle or lateral thinking riddle suitable for a {{{grade}}} student. It should challenge their critical thinking. Provide the solution and a brief explanation of the logic.`
});

const generateParadoxFlow = ai.defineFlow(
  {
    name: 'generateDailyParadoxFlow',
    inputSchema: GenerateParadoxInputSchema,
    outputSchema: GenerateParadoxOutputSchema,
  },
  async (input) => {
    const { output } = await paradoxPrompt(input);
    return output!;
  }
);

export async function generateDailyParadox(input: GenerateParadoxInput): Promise<GenerateParadoxOutput> {
  return generateParadoxFlow(input);
}


// --- 2. AI Debate Partner ---

const DebateTurnInputSchema = z.object({
    topic: z.string().describe("The central topic of the debate."),
    history: z.array(z.object({
        role: z.string(),
        content: z.string(),
    })).describe("The history of the conversation."),
    userArgument: z.string().describe("The user's most recent argument."),
});
export type DebateTurnInput = z.infer<typeof DebateTurnInputSchema>;

const DebateTurnOutputSchema = z.object({
    rebuttal: z.string().describe("The AI's counter-argument or rebuttal."),
    critique: z.string().describe("A constructive critique of the user's argument, pointing out fallacies or areas for improvement."),
});
export type DebateTurnOutput = z.infer<typeof DebateTurnOutputSchema>;

const debatePrompt = ai.definePrompt({
    name: 'runDebateTurnPrompt',
    input: { schema: DebateTurnInputSchema },
    output: { schema: DebateTurnOutputSchema },
    prompt: `You are a polite but skilled debater. The topic is '{{{topic}}}'. The user has just argued: '{{{userArgument}}}'.
  1. Acknowledge their point.
  2. Provide a counter-argument or point out a logical fallacy to make them think deeper.
  3. Keep it encouraging but challenging.
  4. Context from previous history: {{{json history}}}`
});

const runDebateTurnFlow = ai.defineFlow(
    {
        name: 'runDebateTurnFlow',
        inputSchema: DebateTurnInputSchema,
        outputSchema: DebateTurnOutputSchema,
    },
    async (input) => {
        const { output } = await debatePrompt(input);
        return output!;
    }
);

export async function runDebateTurn(input: DebateTurnInput): Promise<DebateTurnOutput> {
    return runDebateTurnFlow(input);
}
