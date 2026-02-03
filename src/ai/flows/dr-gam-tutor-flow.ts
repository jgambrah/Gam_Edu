'use server';

import { ai } from '@/ai/genkit';
import { z } from 'zod';
import { checkAndSpendCredits } from '@/app/actions/credits';

const ChatInputSchema = z.object({
  history: z.array(z.object({
    role: z.enum(['user', 'model']),
    parts: z.array(z.object({ text: z.string() })) 
  })),
  message: z.string(),
  userId: z.string(),
  schoolId: z.string(),
});

export async function generateDrGamResponse(input: z.infer<typeof ChatInputSchema>) {
  try {
    // 1. Credit Check
    const creditResult = await checkAndSpendCredits(input.schoolId, 1);
    if (!creditResult.success) {
      return { success: false, text: creditResult.error || "You are out of AI Sparks." };
    }

    // 2. Persona Setup
    const systemInstruction = `
      You are Dr. Gam, a magical, friendly AI teacher for students of all ages.
      1. STARTING: Greet the student warmly.
      2. ADAPTIVE: Simple English for kids, advanced for adults.
      3. VISUALS: End with "SHOW BOARD: [Concept]" to draw on the board.
      4. TONE: Encouraging, patient, and ONLY English.
    `;

    // 3. Proper Message Formatting for Genkit
    // We combine history and the new message into the 'messages' array
    const conversationMessages: any[] = [
      ...input.history,
      { role: 'user', parts: [{ text: input.message }] }
    ];

    // 4. The AI Call (Updated Model Name)
    const response = await ai.generate({
      model: 'googleai/gemini-1.5-flash', // Use stable model, NOT preview
      system: systemInstruction,
      messages: conversationMessages, // Use 'messages' for history, NOT 'prompt'
      config: { 
        temperature: 0.7,
        maxOutputTokens: 1000, 
      }, 
    });

    if (!response || !response.text) {
      throw new Error("AI returned an empty response.");
    }

    return { success: true, text: response.text };

  } catch (error: any) {
    // This logs the ACTUAL error to your Vercel/Firebase logs
    console.error("CRITICAL BRAIN ERROR:", error.message);
    
    // This returns the actual error to the UI so you can see it while debugging
    return { 
      success: false, 
      text: "Dr. Gam is a bit tired. Let me try that again.",
      error: error.message // This helps us see the real error in the toast
    };
  }
}
