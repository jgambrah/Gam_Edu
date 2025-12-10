'use server';
/**
 * @fileOverview An AI Tutor flow for general academic assistance.
 */

import { ai } from '@/ai/genkit';
import { z } from 'zod';

// Define the input schema (History + New Message)
const ChatInputSchema = z.object({
  history: z.array(z.object({
    role: z.enum(['user', 'model']),
    content: z.string()
  })),
  message: z.string(),
});

export type AiTutorInput = z.infer<typeof ChatInputSchema>;

// Define the output schema
const ChatOutputSchema = z.object({
  text: z.string(),
});

export type AiTutorOutput = z.infer<typeof ChatOutputSchema>;

// Define the prompt
const tutorPrompt = ai.definePrompt({
    name: 'aiTutorPrompt',
    input: { schema: ChatInputSchema },
    prompt: `
      You are an expert AI Tutor for a Junior High School.
      
      ROLE:
      - Be encouraging, patient, and clear.
      - Do not just give answers; help the student understand the concept.
      - Use emojis occasionally to be friendly.
      - Keep responses concise (under 3-4 sentences) unless a long explanation is requested.

      CONVERSATION HISTORY:
      {{#each history}}
        {{#if (eq role 'user')}}Student: {{/if}}{{#if (eq role 'model')}}Tutor: {{/if}}{{content}}
      {{/each}}

      CURRENT QUESTION:
      Student: {{message}}

      TUTOR RESPONSE:
    `,
});

// Define the main flow
const aiTutorFlow = ai.defineFlow(
  {
    name: 'aiTutorFlow',
    inputSchema: ChatInputSchema,
    outputSchema: ChatOutputSchema,
  },
  async (input) => {
    const response = await tutorPrompt(input);
    return { text: response.text };
  }
);


// Exported server action
export async function chatWithAiTutor(input: AiTutorInput): Promise<{ success: boolean; text: string }> {
  try {
    const result = await aiTutorFlow(input);
    return { success: true, text: result.text };
  } catch (error: any) {
    console.error("AI Tutor Error:", error);
    return { success: false, text: "I'm having trouble thinking right now. Please try again." };
  }
}
