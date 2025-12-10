'use server';

import { ai } from '@/ai/genkit';
import { z } from 'zod';

// Define the input schema
const ChatInputSchema = z.object({
  history: z.array(z.object({
    role: z.enum(['user', 'model']),
    content: z.string() // Use 'content' to match the UI component
  })),
  message: z.string(),
});

export async function chatWithAiTutor(input: z.infer<typeof ChatInputSchema>) {
  console.log("🤖 AI Tutor: Received message:", input.message);

  try {
    // 1. Format the history into a clear script format
    const historyForApi = input.history.map(m => ({
      role: m.role,
      content: [{ text: m.content }]
    }));
    
    // 2. The "Solid Tutor" System Prompt
    const systemPrompt = `
      You are an expert, friendly AI Tutor for Junior High School students.
      
      ### CORE BEHAVIOR:
      1. **Socratic Method:** Usually, ask guiding questions to help the student find the answer.
      2. **Handling "I don't know":** If the student says "I don't know", "Tell me", or gets stuck, STOP asking questions. Instead, **explain the answer clearly and simply**, then ask a follow-up question to check understanding.
      3. **Context Retention:** CRITICAL. You are in the middle of a conversation. Look at the HISTORY. Do NOT greet the user again ("Hello", "What subject?") if you are already discussing a topic. Continue the thread.
      4. **Tone:** Encouraging, patient, and concise (max 3-4 sentences).
    `;

    // 3. Call AI using the globally configured 'ai' object
    const response = await ai.generate({
      system: systemPrompt,
      history: historyForApi,
      prompt: input.message,
      config: { temperature: 0.4 }, // Lower temperature to keep it focused
    });

    // 4. Extract Text safely using modern Genkit v1.x syntax
    const text = response.text;
    console.log("🤖 AI Tutor: Generated response:", text);

    return { success: true, text: text };

  } catch (error: any) {
    console.error("❌ AI Tutor Error:", error);
    return { 
      success: false, 
      text: "I lost my train of thought. Could you remind me what we were discussing?",
      error: error.message 
    };
  }
}
