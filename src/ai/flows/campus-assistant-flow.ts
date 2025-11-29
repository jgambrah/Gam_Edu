'use server';
/**
 * @fileOverview An AI assistant for the CampusConnect platform.
 */

import { ai } from '@/ai/genkit';
import { z } from 'zod';

const HistoryMessageSchema = z.object({
  role: z.enum(['user', 'model']),
  content: z.string(),
});

const CampusAssistantInputSchema = z.object({
  prompt: z.string().describe('The user\'s current question or message.'),
  role: z.string().describe('The role of the user, e.g., "Student", "Teacher", "Administrator".'),
  history: z.array(HistoryMessageSchema).optional().describe('The previous conversation history.'),
});

export type CampusAssistantInput = z.infer<typeof CampusAssistantInputSchema>;

const CampusAssistantOutputSchema = z.object({
  response: z.string().describe('The AI\'s response to the user.'),
});

export type CampusAssistantOutput = z.infer<typeof CampusAssistantOutputSchema>;

export async function campusAssistant(input: CampusAssistantInput): Promise<CampusAssistantOutput> {
  return campusAssistantFlow(input);
}

const prompt = ai.definePrompt({
  name: 'campusAssistantPrompt',
  input: { schema: CampusAssistantInputSchema },
  output: { schema: CampusAssistantOutputSchema },
  prompt: `You are CampusBot, a friendly and helpful AI assistant for the CampusConnect school management platform.

Your primary goal is to assist users based on their role and answer their questions clearly.

CURRENT USER'S ROLE: {{{role}}}

CONTEXTUAL INSTRUCTIONS:
- If the user is a 'Student', your primary function is to be an academic tutor. Explain complex concepts, define terms, and answer general knowledge questions simply and accurately. Also, guide them on how to find platform information like assignments, grades, or club activities. Be encouraging and supportive.
- If the user is a 'Teacher', assist with lesson planning ideas, suggest ways to create assignments or quizzes, and provide guidance on using the platform's academic tools.
- If the user is an 'Administrator' or 'Director', provide information on managing staff, students, and school-wide settings. Explain how to generate reports and manage system configurations.
- If the user's role is 'Parent', help them understand their child's progress, navigate the portal, and find information about school events and announcements.

Always be polite, concise, and clear in your responses. Do not invent features that don't exist. When asked about a specific school-related feature, base your guidance on the known features of the CampusConnect platform.`,
});

const campusAssistantFlow = ai.defineFlow(
  {
    name: 'campusAssistantFlow',
    inputSchema: CampusAssistantInputSchema,
    outputSchema: CampusAssistantOutputSchema,
  },
  async (input) => {
    const { output } = await prompt(input);
    return output!;
  }
);
