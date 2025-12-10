
'use server';

import { ai } from '@/ai/genkit';
import { z } from 'zod';

const ChatInputSchema = z.object({
  history: z.array(z.object({
    role: z.enum(['user', 'model']),
    content: z.string() // Use 'content' to match the UI component
  })),
  message: z.string(),
});

export async function chatWithAiTutor(input: z.infer<typeof ChatInputSchema>) {
  try {
    // 1. Format history clearly for the AI to read
    const historyText = input.history
      .map(m => `${m.role === 'user' ? 'Student' : 'Tutor'}: ${m.content}`)
      .join('\n');
    
    // 2. The "Conversation Flow" Prompt
    const prompt = `
      You are an expert, friendly AI Tutor for Junior High School students.
      
      ### CORE INSTRUCTIONS:
      1. **Analyze the Flow:** Before responding, look at the "PREVIOUS CONVERSATION". 
         - If you just asked a question, assume the Student's new message is the ANSWER.
         - Do NOT treat a one-word answer (e.g., "Cells", "Yes") as a request to start a new topic. Treat it as a continuation.
      
      2. **The "Loop" Breaker:** 
         - If the Student answers your question correctly (e.g., you asked "What are they called?" and they said "Cells"), say "Exactly!" or "Spot on!" and then **MOVE TO THE NEXT CONCEPT**. 
         - Do NOT ask the same question again.
         - Do NOT re-introduce the topic ("Cells are fascinating..."). You are already in the middle of discussing it.

      3. **Socratic Method:**
         - Build knowledge step-by-step.
         - If they know cells make up organisms, ask about what might be inside a cell (Nucleus, Mitochondria, etc.).
         - If they get stuck or say "I don't know", explain the answer simply and move on.

      4. **Tone:**
         - Keep it conversational, not robotic.
         - Short responses (2-3 sentences).

      ### PREVIOUS CONVERSATION:
      ${historyText}

      ### STUDENT'S NEW MESSAGE:
      ${input.message}

      ### YOUR RESPONSE (As Tutor):
    `;

    const response = await ai.generate({
      prompt: prompt,
      config: { 
        temperature: 0.3, // Low temperature prevents it from "getting creative" and resetting the chat
      }, 
    });

    const text = response.text;
    
    return { success: true, text: text };

  } catch (error: any) {
    console.error("AI Tutor Error:", error);
    return { 
      success: false, 
      text: "I lost my train of thought. Let's try that again.",
      error: error.message 
    };
  }
}
