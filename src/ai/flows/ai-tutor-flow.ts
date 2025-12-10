'use server';

import { generate } from 'genkit/ai';
import { gemini15Flash } from '@genkit-ai/google-genai';
import { z } from 'zod';
import { ai } from '@/ai/genkit';

// Define the input schema
const ChatInputSchema = z.object({
  history: z.array(z.object({
    role: z.enum(['user', 'model']),
    content: z.string()
  })),
  message: z.string(),
});

export async function chatWithAiTutor(input: z.infer<typeof ChatInputSchema>) {
  console.log("🤖 AI Tutor: Received message:", input.message); // DEBUG LOG

  try {
    // 1. Format history for the prompt
    const history = input.history.map(m => ({
      role: m.role,
      content: [{text: m.content}]
    }));
    
    // 2. Build the Prompt
    const systemPrompt = `
      You are an expert AI Tutor for a Junior High School.
      
      INSTRUCTIONS:
      - Be encouraging, patient, and clear.
      - Do not just give answers; help the student understand the concept.
      - Use emojis occasionally to be friendly.
      - Keep responses concise (under 3-4 sentences) unless a long explanation is requested.
    `;

    // 3. Call AI
    const response = await ai.generate({
      model: gemini15Flash,
      system: systemPrompt,
      history: history,
      prompt: input.message,
      config: { temperature: 0.7 },
    });

    // 4. Extract Text safely
    const text = response.text;
    console.log("🤖 AI Tutor: Generated response:", text); // DEBUG LOG

    return { success: true, text: text };

  } catch (error: any) {
    console.error("❌ AI Tutor Error:", error);
    return { 
      success: false, 
      text: "I'm having trouble connecting to my brain right now. Please try again later.",
      error: error.message 
    };
  }
}
