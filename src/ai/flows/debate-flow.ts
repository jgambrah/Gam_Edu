'use server';

import { ai } from '@/ai/genkit';
import { z } from 'zod';

// Input Schema
const DebateInputSchema = z.object({
  topic: z.string(),
  userStance: z.string().optional(), // 'Pro' or 'Con' (optional)
  history: z.array(z.object({
    role: z.enum(['user', 'model']),
    content: z.string()
  })),
  lastMessage: z.string(),
});

export async function generateDebateResponse(input: z.infer<typeof DebateInputSchema>) {
  try {
    // 1. Format history
    const historyText = input.history
      .map(m => `${m.role === 'user' ? 'Debater' : 'Opponent'}: ${m.content}`)
      .join('\n');
    
    // 2. The "Debate Opponent" Persona
    const prompt = `
      You are a skilled Debate Coach and Opponent in a formal debate setting.
      
      TOPIC: "${input.topic}"
      
      YOUR GOAL: 
      Challenge the user's arguments logically. Do not be mean, but do not simply agree. 
      Play "Devil's Advocate". If they make a good point, acknowledge it but offer a counter-perspective.
      
      INSTRUCTIONS:
      1. Keep responses concise (under 3 sentences).
      2. Ask ONE thought-provoking question at the end to keep the debate moving.
      3. Look at the CONVERSATION HISTORY to maintain context.
      
      CONVERSATION HISTORY:
      ${historyText}
      
      CURRENT ARGUMENT FROM USER:
      "${input.lastMessage}"
      
      YOUR COUNTER-ARGUMENT:
    `;

    const response = await ai.generate({
      prompt: prompt,
      config: { temperature: 0.7 }, // Slightly creative for arguments
    });

    const text = response.text;
    
    return { success: true, text: text };

  } catch (error: any) {
    console.error("Debate AI Error:", error);
    return { 
      success: false, 
      text: "I'm having trouble processing that argument. Could you rephrase it?",
      error: error.message 
    };
  }
}
