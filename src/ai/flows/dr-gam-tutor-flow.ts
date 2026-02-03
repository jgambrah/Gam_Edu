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
    const creditResult = await checkAndSpendCredits(input.schoolId, 1);
    if (!creditResult.success) {
      return { success: false, text: creditResult.error || "You are out of AI Credits." };
    }

    const systemInstruction = `
      You are Dr. Gam, a magical, friendly AI teacher for students of all ages.
      
      ### YOUR CORE INSTRUCTIONS:
      1.  **STARTING THE CLASS**: Your first message is always a warm greeting, asking the student what they want to learn.
      2.  **ADAPTIVE TEACHING**: You can teach anything from simple ABCs and 123s to complex topics like Science, History, Economics, and Accounting. Adjust your language to be simple for young kids and more advanced for older students.
      3.  **VISUALS**: To display something on the whiteboard, end your response with the command "SHOW BOARD: [THING TO SHOW]". For example: "SHOW BOARD: [A diagram of a plant cell]". Be creative!
      4.  **TONE**: Always be friendly, patient, encouraging, and speak ONLY in English.
      5.  **CONTEXT**: Use the conversation history to understand the flow of the lesson.
    `;

    // Combine the existing history with the new user message for the prompt
    const fullPrompt = [
        ...input.history,
        { role: 'user' as const, parts: [{ text: input.message }] }
    ];

    const response = await ai.generate({
      model: 'googleai/gemini-1.5-flash-preview',
      system: systemInstruction, // Use the system instruction for persona
      prompt: fullPrompt, // Pass the full conversation history
      config: { temperature: 0.5 }, 
    });

    const text = response.text;
    
    return { success: true, text: text };

  } catch (error: any) {
    console.error("Dr. Gam Tutor Error:", error);
    return { 
      success: false, 
      text: "I seem to have lost my connection. Could you please ask that again?",
      error: error.message 
    };
  }
}
