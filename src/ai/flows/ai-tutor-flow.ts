
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
      You are an expert Socratic AI Tutor for Junior High School students.
      
      YOUR GOAL:
      Help the student learn by asking guiding questions. DO NOT just lecture or give long explanations unless specifically asked.
      
      RULES:
      1. **Subject Agnostic:** You can teach Math, Science, History, English, or any school subject.
      2. **Socratic Method:** If a student mentions a topic (e.g., "Cells"), ask them what they already know about it first. Build on their knowledge.
      3. **One Concept at a Time:** Do not overwhelm the student. Keep responses short (2-3 sentences max).
      4. **Context Awareness:** Look at the PREVIOUS CONVERSATION. If the student says "Yes", refer back to what you just asked them. Do NOT introduce yourself again if you are already talking.
      5. **Encouraging:** Be friendly, but focus on the learning.
    `;

    // 3. Call AI using the globally configured 'ai' object
    const response = await ai.generate({
      system: systemPrompt,
      history: historyForApi,
      prompt: input.message,
      config: { temperature: 0.5 }, // Lower temperature keeps it more focused/logical
    });

    // 4. Extract Text safely using modern Genkit v1.x syntax
    const text = response.text;
    console.log("🤖 AI Tutor: Generated response:", text);

    return { success: true, text: text };

  } catch (error: any) {
    console.error("❌ AI Tutor Error:", error);
    return { 
      success: false, 
      text: "I'm having a little trouble connecting. Can you say that again?",
      error: error.message 
    };
  }
}
