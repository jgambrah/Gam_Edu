'use server';

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

export async function chatWithAiTutor(input: AiTutorInput): Promise<{ success: boolean; text: string; }> {
  try {
    const history = input.history.map(m => ({
        role: m.role,
        content: [{text: m.content}]
    }));

    const response = await ai.generate({
      history: history,
      prompt: input.message,
      system: `
        You are an expert AI Tutor for a Junior High School.
        
        ROLE:
        - Be encouraging, patient, and clear.
        - Do not just give answers; help the student understand the concept.
        - Use emojis occasionally to be friendly.
        - Keep responses concise (under 3-4 sentences) unless a long explanation is requested.
      `,
      config: { temperature: 0.7 },
    });

    return { success: true, text: response.text };
  } catch (error: any) {
    console.error("AI Tutor Error:", error);
    return { success: false, text: "I'm having trouble thinking right now. Please try again." };
  }
}
